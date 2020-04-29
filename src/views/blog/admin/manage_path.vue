<template>
  <div class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <b-button @click="load">
      reload
      <fetch-status-icon :status="fetch_status" small />
    </b-button>
    <section id="form">
      Category
      <b-form-select v-model="category" :state="is_category_valid">
        <b-form-select-option
          v-for="(cat_obj, cat_id) in categories"
          :key="cat_id"
          :value="cat_id"
        >
          {{ get_category_name(cat_obj) }}
        </b-form-select-option>
      </b-form-select>
      <b-table-simple responsive hover small class="table">
        <b-thead>
          <b-tr>
            <b-th></b-th>
            <b-th>title</b-th>
            <b-th>author</b-th>
            <b-th>created</b-th>
            <b-th>stat</b-th>
            <b-th>operations</b-th>
            <b-th>preview</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr
            v-for="(revision, id) in revisions"
            :key="id"
            :variant="get_status_color(revision)"
            @click="select_revision(id)"
          >
            <b-th>
              <b-form-radio
                v-model.number="revision_selection"
                name="revision-selector"
                :disabled="!is_revision_accepted(revision)"
                :value="id"
                >{{ id }}</b-form-radio
              >
            </b-th>
            <b-td>{{ get_revision_title(revision) }}</b-td>
            <b-td>{{ revision_author_name }}</b-td>
            <b-td>{{ get_revision_timestampe(revision) }}</b-td>
            <b-td>
              <font-awesome-icon
                :icon="get_status_icon(revision)"
                :id="format_revision_icon_id(revision)"
                class="fa-fw"
              />
              <b-tooltip
                :target="format_revision_icon_id(revision)"
                triggers="hover"
              >
                {{ get_revision_status(revision) }}
              </b-tooltip>
            </b-td>
            <b-td>
              <b-button-group>
                <b-button
                  @click="accept_revision(id)"
                  v-if="is_revision_waiting(revision)"
                  variant="success"
                >
                  Accept
                </b-button>
                <b-button
                  @click="reject_revision(id)"
                  v-if="is_revision_waiting(revision)"
                  variant="danger"
                >
                  Reject
                </b-button>
              </b-button-group>
            </b-td>
            <b-td>
              <b-link :to="{ name: 'revision_preview', params: { id: id } }">
                <font-awesome-icon :icon="['far', 'file']" class="fa-fw" />
                preview
              </b-link>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </section>
    <section>
      <h2>差分</h2>
      <div id="diff-view" v-html="diff_from_original"></div>
    </section>
    <b-button-group>
      <b-button @click="apply_changes" variant="primary" :disabled="!can_apply">
        apply
        <fetch-status-icon :status="post_status" small />
      </b-button>
      <b-button
        v-b-modal="'delete-confirm-modal'"
        variant="danger"
        :disabled="!article_exists"
      >
        delete
        <fetch-status-icon :status="delete_status" small />
      </b-button>
    </b-button-group>
    <b-modal id="delete-confirm-modal" @ok="delete_article">
      <p>削除してもよろしいですか?</p>
    </b-modal>
  </div>
</template>

<style lang="scss" scoped>
.table {
  white-space: nowrap;

  td,
  th {
    vertical-align: middle;
  }
}

.td-time {
  white-space: pre-wrap;
}

.td-icon {
  text-align: center;
}
</style>

<style lang="scss">
@import "~diff2html/bundles/css/diff2html.min.css";
#diff-view {
  .d2h-file-list-wrapper {
    display: none;
  }
  .d2h-wrapper {
    .d2h-file-header {
      display: none;
    }
    td {
      padding: 0;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import AdminAuth from "@/libs/auth/admin_auth";
import { BlogRevision } from "@/apis/blog/revisions/@types";
import { BlogArticle } from "@/apis/blog/articles/@types";
import is_axios_error from "@/libs/is_axios_error";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";
import DiffLib from "difflib";
import * as Diff2Html from "diff2html";
import { Categories } from "@/apis/blog/categories/@types";
import getCategories from "@/libs/categories";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { getStringTime } from "@/libs/string_date";
import { Category } from "../../../apis/blog/categories/@types";

@Component({ components: { FetchStatusIcon, Breadcrumb } })
export default class ManagePath extends Vue {
  page_title = "記事管理";
  revisions: { [key: number]: BlogRevision } = {};
  client = aspida();
  categories: Categories = {};

  revision_selection = 0;
  original_selection = 0;
  category = "";

  fetch_status: FetchStatus = "idle";
  post_status: FetchStatus = "idle";
  delete_status: FetchStatus = "idle";

  article_exists = false;

  mounted() {
    getCategories()
      .then((data) => {
        this.categories = data;
      })
      .then(() => {
        this.load();
      });
  }

  @Watch("$route")
  route_changed() {
    this.load();
  }

  load() {
    this.fetch_status = "pending";
    this.article_exists = false;
    this.revision_selection = 0;
    this.original_selection = 0;
    this.page_title = "記事管理: " + this.$route.params.id;
    AdminAuth.attempt_get_JWT()
      .then((token) => {
        Promise.all([
          api(this.client)
            .blog.articles._id(this.$route.params.id)
            .$get()
            .then((data: BlogArticle) => {
              this.category = data.category;
              this.original_selection = data.revision_id;
              this.revision_selection = data.revision_id;
              this.article_exists = true;
            })
            .catch((e: unknown) => {
              if (is_axios_error(e) && e.response && e.response.status == 404) {
                // article may not to exist
                return;
              }
              throw e;
            }),
          api(this.client)
            .blog.revisions.$get({
              query: {
                article_id: this.$route.params.id,
              },
              headers: {
                "X-ADMIN-TOKEN": token.content,
              },
            })
            .then((data: BlogRevision[]) => {
              for (const revision of data) {
                this.$set(this.revisions, revision.id, revision);
              }
            }),
        ])
          .then(() => {
            this.fetch_status = "idle";
          })
          .catch(() => {
            this.fetch_status = "fail";
          });
      })
      .catch(() => {
        this.fetch_status = "fail";
      });
  }

  accept_revision(id: number) {
    AdminAuth.attempt_get_JWT().then((token) => {
      api(this.client)
        .blog.revisions._id(id)
        .accept.$patch({
          headers: {
            "X-ADMIN-TOKEN": token.content,
          },
        })
        .then((data: BlogRevision) => {
          this.$set(this.revisions, id, data);
        });
    });
  }

  reject_revision(id: number) {
    AdminAuth.attempt_get_JWT().then((token) => {
      api(this.client)
        .blog.revisions._id(id)
        .reject.$patch({
          headers: {
            "X-ADMIN-TOKEN": token.content,
          },
        })
        .then((data: BlogRevision) => {
          this.$set(this.revisions, id, data);
        });
    });
  }

  apply_changes() {
    this.post_status = "pending";
    AdminAuth.attempt_get_JWT()
      .then((token) => {
        return api(this.client)
          .blog.articles._id(this.$route.params.id)
          .$patch({
            data: {
              category: this.category,
              revision_id: this.revision_selection,
            },
            headers: {
              "X-ADMIN-TOKEN": token.content,
            },
          });
      })
      .then(() => {
        this.post_status = "idle";
        this.load();
      })
      .catch(() => {
        this.post_status = "fail";
      });
  }

  get is_category_valid() {
    return this.category in this.categories;
  }

  get can_apply() {
    return this.category != "" && this.revision_selection in this.revisions;
  }

  delete_article() {
    this.delete_status = "pending";
    AdminAuth.attempt_get_JWT()
      .then((token) => {
        return api(this.client)
          .blog.articles._id(this.$route.params.id)
          .delete({
            headers: { "X-ADMIN-TOKEN": token.content },
          });
      })
      .then(() => {
        this.delete_status = "idle";
        this.load();
      })
      .catch(() => {
        this.delete_status = "fail";
      });
  }

  get diff_from_original() {
    const original_content =
      this.original_selection in this.revisions
        ? this.revisions[this.original_selection].content.split("\n")
        : [];
    const current_content =
      this.revision_selection in this.revisions
        ? this.revisions[this.revision_selection].content.split("\n")
        : [];

    const diff = DiffLib.unifiedDiff(original_content, current_content, {
      fromfile: "Original",
      tofile: "Current",
      lineterm: "",
    }).join("\n");

    return Diff2Html.html(diff, {
      drawFileList: true,
      matching: "lines",
      outputFormat: "side-by-side",
    });
  }

  select_revision(id: number) {
    if (this.revisions[id].status == "accepted") this.revision_selection = id;
  }

  get_status_color(revision: BlogRevision) {
    switch (revision.status) {
      case "accepted":
        return "success";
      case "rejected":
        return "secondary";
    }
    return "";
  }

  get_status_icon(revision: BlogRevision) {
    switch (revision.status) {
      case "accepted":
        return "check-circle";
      case "rejected":
        return "times-circle";
      case "waiting":
        return "hourglass-half";
    }
  }

  is_revision_accepted(revision: BlogRevision) {
    return revision.status == "accepted";
  }

  is_revision_waiting(revision: BlogRevision) {
    return revision.status === "waiting";
  }

  format_revision_icon_id(revision: BlogRevision) {
    return revision.id + "-status-icon";
  }

  get_category_name(category: Category) {
    return category.name;
  }

  get_revision_title(revision: BlogRevision) {
    return revision.title;
  }

  get_revision_author_name(revision: BlogRevision) {
    return revision.author.name;
  }

  get_revision_timestamp(revision: BlogRevision) {
    return getStringTime(revision.timestamp);
  }

  get_revision_status(revision: BlogRevision) {
    return revision.status;
  }
}
</script>
