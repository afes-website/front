<template>
  <div id="path-list" class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <b-button @click="load">
      Reload
      <fetch-status-icon :status="fetch_status" small />
    </b-button>
    <b-table
      show-empty
      small
      hover
      :responsive="true"
      :items="paths"
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
      <template v-slot:row-details="row">
        <b-table
          show-empty
          small
          hover
          :responsive="true"
          :items="get_revisions(row)"
          :fields="revisionFields"
          sort-by="id"
          class="mb-1"
        >
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
        </b-table>
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

interface Path {
  id: string;
  category?: string;
  title?: string;
  author?: WriterUserInfo;
  handle_name?: string | null;
  created_at?: string;
  updated_at?: string;
  waiting_count: number;
  revisions: TableRevision[];
}
interface TmpPath {
  category?: string;
  title?: string;
  author?: WriterUserInfo;
  handle_name?: string | null;
  created_at?: string;
  updated_at?: string;
  waiting_count: number;
  revisions: TableRevision[];
}
interface TableRevision extends BlogRevision {
  _rowVariant?: BvTableVariant;
}

@Component({ components: { FetchStatusIcon, Breadcrumb } })
export default class PathList extends Vue {
  readonly page_title = "記事一覧";
  paths: Path[] = [];
  readonly pathFields = [
    { key: "waiting_count", label: "" },
    { key: "id", label: "Article ID" },
    { key: "category", formatter: this.get_category_name },
    { key: "title" },
    { key: "author", formatter: this.get_author_name },
    { key: "handle_name" },
    { key: "created_at", formatter: this.get_formatted_time, sortable: true },
    { key: "updated_at", formatter: this.get_formatted_time, sortable: true },
    { key: "actions", label: "" },
  ];
  readonly revisionFields = [
    { key: "id", label: "No.", sortable: true },
    { key: "status", label: "" },
    { key: "title" },
    { key: "author", formatter: this.get_author_name },
    { key: "handle_name" },
    {
      key: "timestamp",
      label: "Created At",
      formatter: this.get_formatted_time,
      sortable: true,
    },
    { key: "actions", label: "" },
  ];
  pathFilter = "";
  sortBy = "created_at";

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
    this.paths = [];
    const tmp_paths: { [key: string]: TmpPath } = {};
    AdminAuth.attempt_get_JWT()
      .then((token) => {
        // get articles
        api(this.client)
          .blog.articles.$get()
          .then((data: BlogArticle[]) => {
            for (const article of data) {
              tmp_paths[article.id] = {
                category: article.category,
                title: article.title,
                author: article.author,
                handle_name: article.handle_name,
                created_at: article.created_at,
                updated_at: article.updated_at,
                waiting_count: 0,
                revisions: [],
              };
            }
          });
        return token;
      })
      .then((token) => {
        // eslint-disable-next-line no-console
        console.log(tmp_paths);
        // get revisions
        return api(this.client)
          .blog.revisions.$get({
            headers: {
              "X-ADMIN-TOKEN": token.content,
            },
          })
          .then((data: TableRevision[]) => {
            for (const revision of data) {
              if (!(revision.article_id in tmp_paths)) {
                // does not exist
                tmp_paths[revision.article_id] = {
                  title: revision.title,
                  created_at: revision.timestamp,
                  author: revision.author,
                  handle_name: revision.handle_name,
                  waiting_count: 0,
                  revisions: [],
                };
              }
              if (revision.status === "waiting") {
                tmp_paths[revision.article_id].waiting_count++;
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
              tmp_paths[revision.article_id].revisions.push(revision);
            }
          })
          .catch(() => {
            this.fetch_status = "fail";
          });
      })
      .then(() => {
        // object -> array
        const array_paths: Path[] = [];
        for (const [id, path] of Object.entries(tmp_paths)) {
          array_paths.push({
            id: id,
            category: path.category,
            title: path.title,
            author: path.author,
            handle_name: path.handle_name,
            created_at: path.created_at,
            updated_at: path.updated_at,
            waiting_count: path.waiting_count,
            revisions: path.revisions,
          });
        }
        this.paths.splice(0, this.paths.length, ...array_paths);
        this.fetch_status = "idle";
      });
  }

  open_manage_path(route: string) {
    this.$router.push({
      name: "manage_path",
      params: { id: route },
    });
  }

  has_waiting(row: { item: Path }) {
    return row.item.waiting_count != 0;
  }

  format_waiting_revision_msg(row: { item: Path }) {
    return "has " + row.item.waiting_count + " waiting revisions";
  }

  get_category(row: { item: Path }) {
    return row.item.category;
  }

  get_author_name(author: WriterUserInfo) {
    return author.name;
  }

  get_waiting_count(row: { item: Path }) {
    return row.item.waiting_count;
  }

  get_revisions(row: { item: Path }) {
    return row.item.revisions;
  }

  toggle_details(row: { toggleDetails(): void }) {
    return row.toggleDetails();
  }

  get_is_details_showing(row: { detailsShowing: boolean }) {
    return row.detailsShowing;
  }

  get_category_name(category_id: string | undefined) {
    return category_id ? this.categories[category_id].name : "-";
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
}
</script>
