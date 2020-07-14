<template>
  <div id="path-list" class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <b-button @click="load">
      Reload
      <fetch-status-icon :status="fetch_status" small />
    </b-button>
    <b-form-group label="filter">
      <b-input v-model="pathFilter" class="bg-transparent"></b-input>
    </b-form-group>
    <b-table
      show-empty
      small
      hover
      responsive="lg"
      head-variant="light"
      :items="array_paths"
      :fields="pathFields"
      :filter="pathFilter"
      :sort-by.sync="sortBy"
      class="mb-0"
    >
      <template v-slot:cell(waiting_count)="row">
        <font-awesome-icon
          icon="angle-down"
          class="fa-fw"
          v-if="get_is_details_showing(row)"
          @click="toggle_details(row)"
        />
        <font-awesome-icon
          icon="angle-right"
          class="fa-fw"
          v-else
          @click="toggle_details(row)"
        />
        <b-badge
          variant="warning"
          v-if="has_waiting(row)"
          v-b-tooltip.hover
          :title="format_waiting_revision_msg(row)"
          class="ml-1"
        >
          {{ get_waiting_count(row) }}
        </b-badge>
      </template>
      <template v-slot:cell(manage)="row">
        <b-button
          :to="{ name: 'manage_path', params: { id: get_article_id(row) } }"
          target="_blank"
          size="sm"
          variant="theme-dark"
          class="mb-0"
        >
          <font-awesome-icon icon="wrench" class="fa-fw" />
        </b-button>
      </template>
      <template v-slot:cell(show)="row">
        <b-button
          v-if="get_category(row)"
          :to="{
            name: 'show_article',
            params: { category: get_category(row), id: get_article_id(row) },
          }"
          target="_blank"
          size="sm"
          variant="secondary"
          class="mb-0"
        >
          <font-awesome-icon icon="file" class="fa-fw" />
        </b-button>
      </template>
      <template v-slot:row-details="row">
        <b-table
          show-empty
          small
          hover
          :responsive="true"
          head-variant="light"
          :items="get_revisions(row)"
          :fields="revisionFields"
          sort-by="id"
          class="mb-1"
          style="width: calc(100% - 24px); margin-left: 24px;"
        >
          <template v-slot:cell(id)="r_row">
            <b-form-radio
              :disabled="!is_revision_accepted(r_row)"
              :value="get_revision_id(r_row)"
              :checked="get_revision_selection(row)"
              @click="update_revision_selection(row, r_row)"
            >
              {{ get_revision_id(r_row) }}
            </b-form-radio>
          </template>
          <template v-slot:cell(status)="r_row">
            <font-awesome-icon
              :icon="get_status_icon(r_row)"
              :id="format_revision_icon_id(r_row)"
              class="fa-fw"
            />
            <b-tooltip
              :target="format_revision_icon_id(r_row)"
              triggers="hover"
            >
              {{ get_revision_status(r_row) }}
            </b-tooltip>
          </template>
          <template v-slot:cell(actions)="r_row">
            <b-button-group size="sm">
              <b-button
                @click="
                  accept_revision(get_article_id(row), get_revision_id(r_row))
                "
                v-if="is_revision_waiting(r_row)"
                variant="success"
                class="mb-0"
              >
                Accept
              </b-button>
              <b-button
                @click="
                  reject_revision(get_article_id(row), get_revision_id(r_row))
                "
                v-if="is_revision_waiting(r_row)"
                variant="danger"
                class="mb-0"
              >
                Reject
              </b-button>
            </b-button-group>
          </template>
          <template v-slot:cell(preview)="r_row">
            <b-button
              :to="{
                name: 'revision_preview',
                params: { id: get_revision_id(r_row) },
              }"
              target="_blank"
              size="sm"
              variant="secondary"
              class="mb-0"
            >
              <font-awesome-icon :icon="['far', 'file']" class="fa-fw" />
              preview
            </b-button>
          </template>
        </b-table>
        <b-form-group class="ml-4">
          <b-form-select
            :value="get_category_selection(row)"
            @change="set_category_selection(row, $event)"
            size="sm"
            class="mb-1"
          >
            <b-form-select-option
              v-for="(cat_obj, cat_id) in categories"
              :key="cat_id"
              :value="cat_id"
            >
              {{ get_category_name(cat_id) }}
            </b-form-select-option>
          </b-form-select>
          <b-button-group size="sm">
            <b-button
              @click="apply_changes"
              variant="primary"
              :disabled="!can_apply"
              class="mb-0"
            >
              apply
            </b-button>
            <b-button
              variant="danger"
              :disabled="!get_article_exists(row)"
              class="mb-0"
            >
              delete
            </b-button>
          </b-button-group>
        </b-form-group>
      </template>
    </b-table>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  margin-bottom: 0.5rem;
}

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
#articles {
  display: flex;
  flex-wrap: wrap;

  .article-card {
    margin: 1rem;
    flex-grow: 1;
    height: 10rem;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    // background: white;
    // box-shadow: 0.5rem 0.5rem 1rem rgba(black, 0.5);
    // border-radius: 1rem;
    img {
      height: 10rem;
      width: 10rem;
    }

    p {
      flex-grow: 1;
      height: 10rem;
      width: 10rem;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import { BlogArticle } from "@/apis/blog/articles/@types";
import AdminAuth from "@/libs/auth/admin_auth";
import { BlogRevision } from "@/apis/blog/revisions/@types";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";
import { Categories } from "@/apis/blog/categories/@types";
import getCategories from "@/libs/categories";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { getStringTime } from "@/libs/string_date";
import { WriterUserInfo } from "@/apis/writer/user";
import { BvTableVariant } from "bootstrap-vue";
import JWT from "@/libs/auth/jwt";

interface ArrayPath {
  id: string;
  category?: string;
  title?: string;
  author?: WriterUserInfo;
  handle_name?: string | null;
  created_at?: string;
  updated_at?: string;
  revision_id: number;
  waiting_count: number;
  article_exists: boolean;
  revisions: TableRevision[];
  revision_selection?: number;
  category_selection?: string;
}
interface Path {
  category?: string;
  title?: string;
  author?: WriterUserInfo;
  handle_name?: string | null;
  created_at?: string;
  updated_at?: string;
  revision_id: number;
  waiting_count: number;
  article_exists: boolean;
  revisions: TableRevision[];
  revision_selection?: number;
  category_selection?: string;
}
interface TableRevision extends BlogRevision {
  _rowVariant?: BvTableVariant;
}

@Component({ components: { FetchStatusIcon, Breadcrumb } })
export default class PathList extends Vue {
  readonly page_title = "記事一覧";
  paths: { [key: string]: Path } = {};
  readonly pathFields = [
    { key: "waiting_count", label: "" },
    { key: "id", label: "Article ID" },
    { key: "revision_id", label: "Revision ID", sortable: true },
    { key: "category", formatter: this.get_category_name },
    { key: "title" },
    { key: "author", formatter: this.get_author_name },
    { key: "handle_name" },
    { key: "created_at", formatter: this.get_formatted_time, sortable: true },
    { key: "updated_at", formatter: this.get_formatted_time, sortable: true },
    { key: "manage" },
    { key: "show" },
  ];
  readonly revisionFields = [
    { key: "id", label: "No.", sortable: true },
    { key: "status", label: "" },
    { key: "title" },
    { key: "author", formatter: this.get_author_name },
    { key: "handle_name" },
    {
      key: "timestamp",
      label: "Timestamp",
      formatter: this.get_formatted_time,
      sortable: true,
    },
    { key: "actions", label: "" },
    { key: "preview" },
  ];
  pathFilter = "";
  sortBy = "revision_id";

  client = aspida();
  categories: Categories = {};

  fetch_status: FetchStatus = "idle";

  mounted() {
    getCategories()
      .then((data) => {
        this.categories = data;
      })
      .then(() => {
        this.load();
      });
  }

  load() {
    if (this.fetch_status == "pending") return;
    this.fetch_status = "pending";
    this.paths = {};
    AdminAuth.attempt_get_JWT()
      .then((token) => {
        // get articles
        return new Promise<JWT>((resolve) =>
          api(this.client)
            .blog.articles.$get()
            .then((data: BlogArticle[]) => {
              for (const article of data) {
                this.$set(this.paths, article.id, {
                  category: article.category,
                  title: article.title,
                  author: article.author,
                  handle_name: article.handle_name,
                  created_at: article.created_at,
                  updated_at: article.updated_at,
                  waiting_count: 0,
                  revision_id: article.revision_id,
                  article_exists: true,
                  revisions: [],
                  revision_selection: article.revision_id,
                  category_selection: article.category,
                });
              }
              resolve(token);
            })
        );
      })
      .then((token) => {
        // get revisions
        api(this.client)
          .blog.revisions.$get({
            headers: {
              "X-ADMIN-TOKEN": token.content,
            },
          })
          .then((data: TableRevision[]) => {
            for (const revision of data) {
              if (!(revision.article_id in this.paths)) {
                // does not exist
                this.$set(this.paths, revision.article_id, {
                  title: revision.title,
                  created_at: revision.timestamp,
                  author: revision.author,
                  handle_name: revision.handle_name,
                  article_exists: false,
                  waiting_count: 0,
                  revision_id: revision.id,
                  revisions: [],
                });
              }
              if (revision.status === "waiting") {
                this.paths[revision.article_id].waiting_count++;
              }
              switch (revision.status) {
                case "accepted":
                  revision["_rowVariant"] = "success";
                  break;
                case "rejected":
                  revision["_rowVariant"] = "secondary";
                  break;
                case "waiting":
                  revision["_rowVariant"] = "warning";
                  break;
              }
              this.paths[revision.article_id].revisions.push(revision);
              this.fetch_status = "idle";
            }
          })
          .catch(() => {
            this.fetch_status = "fail";
          });
      });
  }

  accept_revision(article_id: string, revision_id: number) {
    AdminAuth.attempt_get_JWT().then((token) => {
      api(this.client)
        .blog.revisions._id(revision_id)
        .accept.$patch({
          headers: {
            "X-ADMIN-TOKEN": token.content,
          },
        })
        .then((data: BlogRevision) => {
          this.$set(this.paths[article_id], revision_id, data);
        });
    });
  }

  reject_revision(article_id: string, revision_id: number) {
    AdminAuth.attempt_get_JWT().then((token) => {
      api(this.client)
        .blog.revisions._id(revision_id)
        .reject.$patch({
          headers: {
            "X-ADMIN-TOKEN": token.content,
          },
        })
        .then((data: BlogRevision) => {
          this.$set(this.paths[article_id], revision_id, data);
        });
    });
  }

  apply_changes(row: { item: ArrayPath }) {
    AdminAuth.attempt_get_JWT()
      .then((token) => {
        return api(this.client)
          .blog.articles._id(row.item.id)
          .$patch({
            data: {
              category: row.item.category_selection,
              revision_id: row.item.revision_selection,
            },
            headers: {
              "X-ADMIN-TOKEN": token.content,
            },
          });
      })
      .then(() => {
        this.load();
      })
      .catch(() => {
        this.$bvToast.toast("apply changes failed", {
          title: "Error",
          variant: "Danger",
        });
      });
  }

  get array_paths(): ArrayPath[] {
    // object -> array
    const array_paths: ArrayPath[] = [];
    for (const [id, path] of Object.entries(this.paths)) {
      array_paths.push({
        id: id,
        category: path.category,
        title: path.title,
        author: path.author,
        handle_name: path.handle_name,
        created_at: path.created_at,
        updated_at: path.updated_at,
        waiting_count: path.waiting_count,
        revision_id: path.revision_id,
        article_exists: path.article_exists,
        revisions: path.revisions,
        revision_selection: path.revision_selection,
        category_selection: path.category_selection,
      });
    }
    return array_paths;
  }

  can_apply(row: { item: ArrayPath }) {
    if (row.item.category_selection && row.item.revision_selection)
      return (
        row.item.category_selection in this.categories &&
        row.item.revision_selection in row.item.revisions
      );
    return false;
  }

  get_article_exists(row: { item: ArrayPath }) {
    return row.item.article_exists;
  }

  has_waiting(row: { item: ArrayPath }) {
    return row.item.waiting_count != 0;
  }

  format_waiting_revision_msg(row: { item: ArrayPath }) {
    return "has " + row.item.waiting_count + " waiting revisions";
  }

  get_category(row: { item: ArrayPath }) {
    return row.item.category;
  }

  get_author_name(author: WriterUserInfo) {
    return author.name;
  }

  get_article_id(row: { item: ArrayPath }) {
    return row.item.id;
  }

  get_waiting_count(row: { item: ArrayPath }) {
    return row.item.waiting_count;
  }

  get_revisions(row: { item: ArrayPath }) {
    return row.item.revisions;
  }

  toggle_details(row: { toggleDetails(): void }) {
    return row.toggleDetails();
  }

  get_is_details_showing(row: { detailsShowing: boolean }) {
    return row.detailsShowing;
  }

  get_category_name(category_id: string | undefined) {
    if (category_id && category_id in this.categories)
      return this.categories[category_id].name;
    return "-";
  }

  get_formatted_time(timestamp: string | undefined) {
    return timestamp ? getStringTime(timestamp) : "-";
  }

  get_status_color(r_row: { item: BlogRevision }) {
    switch (r_row.item.status) {
      case "accepted":
        return "success";
      case "rejected":
        return "secondary";
    }
    return "";
  }

  get_status_icon(r_row: { item: BlogRevision }) {
    switch (r_row.item.status) {
      case "accepted":
        return "check-circle";
      case "rejected":
        return "times-circle";
      case "waiting":
        return "hourglass-half";
    }
  }

  is_revision_accepted(r_row: { item: BlogRevision }) {
    return r_row.item.status == "accepted";
  }

  is_revision_waiting(r_row: { item: BlogRevision }) {
    return r_row.item.status === "waiting";
  }

  format_revision_icon_id(r_row: { item: BlogRevision }) {
    return r_row.item.id + "-status-icon";
  }

  get_revision_status(r_row: { item: BlogRevision }) {
    return r_row.item.status;
  }

  get_revision_id(r_row: { item: BlogRevision }) {
    return r_row.item.id;
  }

  get_revision_selection(row: { item: ArrayPath }) {
    return row.item.revision_selection;
  }

  update_revision_selection(
    row: { item: ArrayPath },
    r_row: { item: TableRevision }
  ) {
    row.item.revision_selection = r_row.item.id;
  }

  get_category_selection(row: { item: ArrayPath }) {
    return row.item.category_selection;
  }

  set_category_selection(
    row: { item: ArrayPath },
    event: { target: { value: string } }
  ) {
    row.item.category_selection = event.target.value;
  }
}
</script>
