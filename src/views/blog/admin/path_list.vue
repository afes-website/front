<template>
  <div id="path-list" class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <b-button @click="load">
      Reload
      <fetch-status-icon :status="fetch_status" small />
    </b-button>
    <b-table-simple responsive hover class="table">
      <b-thead>
        <b-tr>
          <b-th>id</b-th>
          <b-th>title</b-th>
          <b-th>category</b-th>
          <b-th>created</b-th>
          <b-th>updated</b-th>
          <b-th>show</b-th>
          <b-th>manage</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <b-tr
          v-for="(path, route) in paths"
          :key="route"
          @click="open_manage_path(route)"
        >
          <b-th>
            {{ route }}
            <b-badge
              variant="warning"
              v-if="has_waiting(path)"
              v-b-tooltip.hover
              :title="format_waiting_revision_msg(path)"
              class="ml-1"
            >
              {{ path.waiting_count }}
            </b-badge>
          </b-th>
          <b-td>{{ path.title || "-" }}</b-td>
          <b-td>{{
            path.category ? categories[path.category].name : "-"
          }}</b-td>
          <b-td class="td-time">
            {{ getStringTime(path.created_at) || "-" }}
          </b-td>
          <b-td class="td-time">
            {{ getStringTime(path.updated_at) || "-" }}
          </b-td>
          <b-td class="td-icon">
            <b-link
              v-if="get_category(path)"
              :to="{
                name: 'show_article',
                params: { category: get_category(path), id: route },
              }"
            >
              <font-awesome-icon :icon="'file'" class="fa-fw fa-2x" />
            </b-link>
          </b-td>
          <b-td class="td-icon">
            <b-link :to="{ name: 'manage_path', params: { id: route } }">
              <font-awesome-icon :icon="'tools'" class="fa-fw fa-2x" />
            </b-link>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
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

interface Path {
  category?: string;
  title?: string;
  created_at?: string;
  updated_at?: string;
  waiting_count: number;
}

@Component({ components: { FetchStatusIcon, Breadcrumb } })
export default class PathList extends Vue {
  readonly page_title = "記事一覧";
  paths: { [key: string]: Path } = {};
  client = aspida();
  categories: Categories = {};
  readonly getStringTime = getStringTime;

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
        api(this.client)
          .blog.articles.$get()
          .then((data: BlogArticle[]) => {
            for (const article of data) {
              this.$set(this.paths, article.id, {
                category: article.category,
                title: article.title,
                created_at: article.created_at,
                updated_at: article.updated_at,
                waiting_count: 0,
              });
            }
          });
        return token;
      })
      .then((token) => {
        api(this.client)
          .blog.revisions.$get({
            headers: {
              "X-ADMIN-TOKEN": token.content,
            },
          })
          .then((data: BlogRevision[]) => {
            for (const revision of data) {
              if (!(revision.article_id in this.paths)) {
                // does not exist
                this.$set(this.paths, revision.article_id, {
                  title: revision.title,
                  waiting_count: 0,
                });
              }
              if (revision.status === "waiting") {
                this.paths[revision.article_id].waiting_count++;
              }
            }
            this.fetch_status = "idle";
          })
          .catch(() => {
            this.fetch_status = "fail";
          });
      });
  }

  open_manage_path(route: string) {
    this.$router.push({
      name: "manage_path",
      params: { id: route },
    });
  }

  has_waiting(path: Path) {
    return path.waiting_count != 0;
  }

  format_waiting_revision_msg(path: Path) {
    return "has " + path.waiting_count + " waiting revisions";
  }

  get_category(path: Path) {
    return path.category;
  }
}
</script>
