<template>
  <div class="box">
    <h1>{{ page_title }}</h1>
    <b-button @click="load">
      reload
      <fetch-status-icon :status="fetch_status" small />
    </b-button>
    <section id="form">
      Category
      <b-form-select v-model="category" :state="category in categories">
        <b-form-select-option
          v-for="(cat_obj, cat_id) in categories"
          :key="cat_id"
          :value="cat_id"
        >
          {{ cat_obj.name }}
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
            :variant="
              revision.status == 'accepted'
                ? 'success'
                : revision.status == 'rejected'
                ? 'secondary'
                : ''
            "
            @click="select_revision(id)"
          >
            <b-th>
              <b-form-radio
                v-model.number="revision_selection"
                name="revision-selector"
                :disabled="revision.status != 'accepted'"
                :value="id"
                >{{ id }}</b-form-radio
              >
            </b-th>
            <b-td>{{ revision.title }}</b-td>
            <b-td>{{ revision.user_id }}</b-td>
            <b-td>{{ getStringTime(revision.timestamp) }}</b-td>
            <b-td>
              <font-awesome-icon
                :icon="
                  revision.status === 'accepted'
                    ? 'check-circle'
                    : revision.status === 'rejected'
                    ? 'times-circle'
                    : 'hourglass-half'
                "
                :id="[revision.id + '-status-icon']"
                class="fa-fw"
              />
              <b-tooltip
                :target="revision.id + '-status-icon'"
                triggers="hover"
              >
                {{ revision.status }}
              </b-tooltip>
            </b-td>
            <b-td>
              <b-button-group>
                <b-button
                  @click="accept_revision(id)"
                  v-if="revision.status === 'waiting'"
                  variant="success"
                >
                  Accept
                </b-button>
                <b-button
                  @click="reject_revision(id)"
                  v-if="revision.status === 'waiting'"
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
import categories from "@/libs/categories";

@Component({ components: { FetchStatusIcon } })
export default class ManagePath extends Vue {
  page_title = "ブログ 記事管理";
  revisions: { [key: number]: BlogRevision } = {};
  client = aspida();
  readonly categories = categories;

  revision_selection = 0;
  original_selection = 0;
  category = "";

  fetch_status: FetchStatus = "idle";
  post_status: FetchStatus = "idle";
  delete_status: FetchStatus = "idle";

  article_exists = false;

  mounted() {
    this.load();
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
    this.page_title = "ブログ 記事管理: " + this.$route.params.id;
    AdminAuth.attempt_get_JWT()
      .then(token => {
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
                article_id: this.$route.params.id
              },
              headers: {
                "X-ADMIN-TOKEN": token.content
              }
            })
            .then((data: BlogRevision[]) => {
              for (const revision of data) {
                this.$set(this.revisions, revision.id, revision);
              }
            })
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
    AdminAuth.attempt_get_JWT().then(token => {
      api(this.client)
        .blog.revisions._id(id)
        .accept.$patch({
          headers: {
            "X-ADMIN-TOKEN": token.content
          }
        })
        .then((data: BlogRevision) => {
          this.$set(this.revisions, id, data);
        });
    });
  }

  reject_revision(id: number) {
    AdminAuth.attempt_get_JWT().then(token => {
      api(this.client)
        .blog.revisions._id(id)
        .reject.$patch({
          headers: {
            "X-ADMIN-TOKEN": token.content
          }
        })
        .then((data: BlogRevision) => {
          this.$set(this.revisions, id, data);
        });
    });
  }

  apply_changes() {
    this.post_status = "pending";
    AdminAuth.attempt_get_JWT()
      .then(token => {
        return api(this.client)
          .blog.articles._id(this.$route.params.id)
          .$patch({
            data: {
              category: this.category,
              revision_id: this.revision_selection
            },
            headers: {
              "X-ADMIN-TOKEN": token.content
            }
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

  get can_apply() {
    return this.category != "" && this.revision_selection in this.revisions;
  }

  delete_article() {
    this.delete_status = "pending";
    AdminAuth.attempt_get_JWT()
      .then(token => {
        return api(this.client)
          .blog.articles._id(this.$route.params.id)
          .delete({
            headers: { "X-ADMIN-TOKEN": token.content }
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
      lineterm: ""
    }).join("\n");

    return Diff2Html.html(diff, {
      drawFileList: true,
      matching: "lines",
      outputFormat: "side-by-side"
    });
  }

  getStringTime(laravel_time: string): string {
    if (!laravel_time) return "";
    const date = new Date(Date.parse(laravel_time));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const min =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return year + "/" + month + "/" + day + " " + hour + ":" + min;
  }

  select_revision(id: number) {
    if (this.revisions[id].status == "accepted") this.revision_selection = id;
  }
}
</script>
