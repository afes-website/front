<template>
  <forbidden :is-forbidden="forbidden" id="path-list" class="box wide-box">
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
      :sort-desc.sync="sortDesc"
      :busy="is_busy"
      class="mb-0"
      @row-clicked="toggle_details"
    >
      <template v-slot:cell(waiting_count)="row">
        <font-awesome-icon
          icon="angle-down"
          class="fa-fw"
          v-if="get_is_details_showing(row)"
        />
        <font-awesome-icon icon="angle-right" class="fa-fw" v-else />
        <b-badge
          variant="warning"
          v-if="get_has_waiting_revision(row)"
          v-b-tooltip.hover
          :title="get_formatted_waiting_revision_msg(row)"
          class="ml-1"
        >
          {{ get_path_waiting_count(row) }}
        </b-badge>
      </template>
      <template v-slot:cell(manage)="row">
        <b-button
          :to="{
            name: 'manage_path',
            params: { id: get_path_article_id(row) },
          }"
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
          v-if="get_path_category(row)"
          :to="{
            name: 'show_article',
            params: {
              category: get_path_category(row),
              id: get_path_article_id(row),
            },
          }"
          target="_blank"
          size="sm"
          variant="secondary"
          class="mb-0"
        >
          <font-awesome-icon icon="file" class="fa-fw" />
        </b-button>
      </template>
      <template v-slot:table-busy>
        <div class="text-center text-theme-dark my-2">
          <b-spinner class="align-middle mr-2"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-slot:row-details="row">
        <b-table-lite
          small
          hover
          :responsive="true"
          head-variant="light"
          :items="get_path_revisions(row)"
          :fields="revisionFields"
          class="mb-1"
          style="width: calc(100% - 24px); margin-left: 24px"
        >
          <template v-slot:cell(id)="r_row">
            <b-form-radio
              :disabled="!is_revision_accepted(r_row)"
              :value="get_revision_id(r_row)"
              :checked="get_revision_selection(row)"
              @change="set_revision_selection(row, $event)"
            >
              {{ get_revision_id(r_row) }}
            </b-form-radio>
          </template>
          <template v-slot:cell(status)="r_row">
            <font-awesome-icon
              :icon="get_status_icon(r_row)"
              :id="get_formatted_revision_icon_id(r_row)"
              class="fa-fw"
            />
            <b-tooltip
              :target="get_formatted_revision_icon_id(r_row)"
              triggers="hover"
            >
              {{ get_revision_status(r_row) }}
            </b-tooltip>
          </template>
          <template v-slot:cell(actions)="r_row">
            <b-button-group size="sm">
              <b-button
                @click="
                  accept_revision(
                    get_path_article_id(row),
                    get_revision_id(r_row)
                  )
                "
                v-if="is_revision_waiting(r_row)"
                variant="success"
                class="mb-0"
              >
                Accept
              </b-button>
              <b-button
                @click="
                  reject_revision(
                    get_path_article_id(row),
                    get_revision_id(r_row)
                  )
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
        </b-table-lite>
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
              @click="apply_changes(row)"
              variant="primary"
              :disabled="!get_can_apply"
              class="mb-0"
            >
              apply
            </b-button>
            <b-button
              variant="danger"
              :disabled="!get_is_article_exists(row)"
              class="mb-0"
            >
              delete
            </b-button>
          </b-button-group>
        </b-form-group>
      </template>
    </b-table>
  </forbidden>
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
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import { BlogArticle } from "@afes-website/docs";
import { BlogRevision } from "@afes-website/docs";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";
import { Categories } from "@afes-website/docs";
import getCategories from "@/libs/categories";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { getStringTime } from "@/libs/string_date";
import { UserInfo } from "@afes-website/docs";
import { BvTableVariant } from "bootstrap-vue";
import Forbidden from "@/components/Forbidden.vue";
import auth_eventhub from "@/libs/auth/auth_eventhub";

interface ArrayPath {
  id: string;
  category?: string;
  title?: string;
  author?: UserInfo;
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
  author?: UserInfo;
  handle_name?: string | null;
  created_at?: string;
  updated_at?: string;
  revision_id: number;
  waiting_count: number;
  article_exists: boolean;
  revisions: BlogRevision[];
  revision_selection?: number;
  category_selection?: string;
}
interface TableRevision extends BlogRevision {
  _rowVariant?: BvTableVariant;
}

@Component({ components: { FetchStatusIcon, Breadcrumb, Forbidden } })
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
    { key: "manage", label: "" },
    { key: "show", label: "" },
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
  sortDesc = true;

  client = aspida();
  categories: Categories = {};

  fetch_status: FetchStatus = "idle";
  forbidden = false;

  mounted() {
    getCategories()
      .then((data) => {
        this.categories = data;
      })
      .then(() => {
        this.load();
      });
    auth_eventhub.onUpdateAuth(this.load);
  }

  async load() {
    this.forbidden = false;
    if (this.fetch_status == "pending") return;
    this.fetch_status = "pending";
    this.paths = {};

    this.$auth
      .attempt_get_JWT("blogAdmin")
      .then((token) => {
        // get articles
        return new Promise<string>((resolve) =>
          api(this.client)
            .blog.articles.$get()
            .then((data: BlogArticle[]) => {
              for (const article of data) {
                this.$set(this.paths, article.id, {
                  ...article,
                  waiting_count: 0,
                  article_exists: true,
                  revisions: [],
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
              Authorization: "bearer " + token,
            },
          })
          .then((data: TableRevision[]) => {
            for (const revision of data) {
              if (!(revision.article_id in this.paths)) {
                // does not exist
                const { id, timestamp, ...rest } = revision;
                this.$set(this.paths, revision.article_id, {
                  ...rest,
                  article_exists: false,
                  waiting_count: 0,
                  revision_id: id,
                  revisions: [],
                  created_at: timestamp,
                });
              }
              if (revision.status === "waiting") {
                this.paths[revision.article_id].waiting_count++;
              }
              this.paths[revision.article_id].revisions.push(revision);
              this.fetch_status = "idle";
            }
          })
          .catch(() => {
            this.fetch_status = "fail";
          });
      })
      .catch(() => {
        this.forbidden = true;
        this.fetch_status = "fail";
      });
  }

  accept_revision(article_id: string, revision_id: number) {
    this.$auth.attempt_get_JWT("blogAdmin").then((token) => {
      api(this.client)
        .blog.revisions._id(revision_id)
        .accept.$patch({
          headers: {
            Authorization: "bearer " + token,
          },
        })
        .then((res) => {
          const index = this.paths[article_id].revisions.findIndex(
            ({ id }) => id === revision_id
          );
          this.paths[article_id].revisions.splice(index, 1, res);
          this.paths[article_id].waiting_count--;
        });
    });
  }

  reject_revision(article_id: string, revision_id: number) {
    this.$auth.attempt_get_JWT("blogAdmin").then((token) => {
      api(this.client)
        .blog.revisions._id(revision_id)
        .reject.$patch({
          headers: {
            Authorization: "bearer " + token,
          },
        })
        .then((res) => {
          const index = this.paths[article_id].revisions.findIndex(
            ({ id }) => id === revision_id
          );
          this.paths[article_id].revisions.splice(index, 1, res);
          this.paths[article_id].waiting_count--;
        });
    });
  }

  apply_changes(row: { item: ArrayPath }) {
    this.$auth.attempt_get_JWT("blogAdmin").then((token) => {
      return new Promise<BlogArticle>((resolve) =>
        api(this.client)
          .blog.articles._id(row.item.id)
          .$patch({
            body: {
              category: row.item.category_selection,
              revision_id: row.item.revision_selection,
            },
            headers: {
              Authorization: "bearer " + token,
            },
          })
          .then((article) => {
            // update article
            this.$set(this.paths, article.id, {
              ...article,
              waiting_count: 0,
              article_exists: true,
              revisions: [],
            });
            resolve(article);
          })
      )
        .then((article) => {
          api(this.client)
            .blog.revisions.$get({
              query: {
                article_id: article.id,
              },
              headers: {
                Authorization: "bearer " + token,
              },
            })
            .then((revisions) => {
              // update article.revisions
              for (const revision of revisions) {
                if (revision.status === "waiting")
                  this.paths[revision.article_id].waiting_count++;
                this.paths[revision.article_id].revisions.push(revision);
              }
            });
        })
        .catch(() => {
          this.$bvToast.toast("apply changes failed", {
            title: "Error",
            variant: "Danger",
          });
        });
    });
  }

  get array_paths(): ArrayPath[] {
    // object -> array
    const array_paths: ArrayPath[] = [];
    for (const [id, path] of Object.entries(this.paths)) {
      const table_revisions: TableRevision[] = [];
      for (const revision of path.revisions) {
        table_revisions.push({
          _rowVariant: this.get_status_variant(revision.status),
          ...revision,
        });
      }

      // TODO: fix rule
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { revisions, ...rest } = path;
      array_paths.push({
        id: id,
        revisions: table_revisions,
        ...rest,
      });
    }
    return array_paths;
  }

  get is_busy() {
    return this.fetch_status !== "idle";
  }

  /* ==== Paths Table : main ==== */

  get_is_article_exists(row: { item: ArrayPath }) {
    return row.item.article_exists;
  }

  get_has_waiting_revision(row: { item: ArrayPath }) {
    return row.item.waiting_count != 0;
  }

  get_path_waiting_count(row: { item: ArrayPath }) {
    return row.item.waiting_count;
  }

  get_formatted_waiting_revision_msg(row: { item: ArrayPath }) {
    return "has " + row.item.waiting_count + " waiting revisions";
  }

  get_path_article_id(row: { item: ArrayPath }) {
    return row.item.id;
  }

  get_path_category(row: { item: ArrayPath }) {
    return row.item.category;
  }

  get_path_revisions(row: { item: ArrayPath }) {
    return row.item.revisions;
  }

  /* ==== Paths Table : details ==== */

  toggle_details(item: { _showDetails: boolean | undefined }) {
    this.$set(item, "_showDetails", !item._showDetails);
  }

  get_is_details_showing(row: { detailsShowing: boolean }) {
    return row.detailsShowing;
  }

  get_revision_selection(row: { item: ArrayPath }) {
    return row.item.revision_selection;
  }

  set_category_selection(row: { item: ArrayPath }, event: string) {
    row.item.category_selection = event;
  }

  get_category_selection(row: { item: ArrayPath }) {
    return row.item.category_selection;
  }

  set_revision_selection(row: { item: ArrayPath }, event: number) {
    row.item.revision_selection = event;
  }

  get_can_apply(row: { item: ArrayPath }) {
    if (row.item.category_selection && row.item.revision_selection)
      return (
        row.item.category_selection in this.categories &&
        row.item.revision_selection in row.item.revisions
      );
    return false;
  }

  /* ==== Revisions Table ==== */

  is_revision_accepted(r_row: { item: BlogRevision }) {
    return r_row.item.status == "accepted";
  }

  is_revision_waiting(r_row: { item: BlogRevision }) {
    return r_row.item.status === "waiting";
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

  get_formatted_revision_icon_id(r_row: { item: BlogRevision }) {
    return r_row.item.id + "-status-icon";
  }

  get_revision_status(r_row: { item: BlogRevision }) {
    return r_row.item.status;
  }

  get_revision_id(r_row: { item: BlogRevision }) {
    return r_row.item.id;
  }

  /* ==== Other Utils ==== */

  get_author_name(author: UserInfo) {
    return author.name;
  }

  get_category_name(category_id: string | undefined) {
    if (category_id && category_id in this.categories)
      return this.categories[category_id].name;
    return "-";
  }

  get_formatted_time(timestamp: string | undefined) {
    return timestamp ? getStringTime(timestamp) : "-";
  }

  get_status_variant(status: "waiting" | "accepted" | "rejected") {
    switch (status) {
      case "accepted":
        return "success";
      case "rejected":
        return "secondary";
      case "waiting":
        return "warning";
    }
  }
}
</script>
