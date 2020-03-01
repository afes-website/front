<template>
  <div id="path-list" class="box">
    <h1>{{ title }}</h1>
    <b-button @click="load">
      Reload
      <fetch-status-icon :status="fetch_status" small />
    </b-button>
    <table class="table">
      <thead>
        <tr>
          <th>path</th>
          <th>title</th>
          <th>category</th>
          <th>created</th>
          <th>updated</th>
          <th>show</th>
          <th>manage</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(path, route) in paths" :key="route">
          <th>
            {{ route }}
            <b-badge
              variant="warning"
              v-if="path.waiting_count != 0"
              v-b-tooltip.hover
              :title="'has ' + path.waiting_count + ' waiting revisions'"
              class="ml-1"
            >
              {{ path.waiting_count }}
            </b-badge>
          </th>
          <td>{{ path.title || "-" }}</td>
          <td>{{ getCategory(path.category) || "-" }}</td>
          <td class="td-time">{{ getStringTime(path.created_at) || "-" }}</td>
          <td class="td-time">{{ getStringTime(path.updated_at) || "-" }}</td>
          <td class="td-icon">
            <b-link
              v-if="path.category"
              :to="{
                name: 'show_article',
                params: { category: path.category, id: route }
              }"
            >
              <font-awesome-icon :icon="'file'" class="fa-fw fa-2x" />
            </b-link>
          </td>
          <td class="td-icon">
            <b-link :to="{ name: 'manage_path', params: { id: route } }">
              <font-awesome-icon :icon="'tools'" class="fa-fw fa-2x" />
            </b-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  margin-bottom: 0.5rem;
}

.table {
  display: block;
  overflow-x: scroll;
  white-space: nowrap;
}

.td-time {
  white-space: pre-wrap;
}

.td-icon {
  text-align: center;
  vertical-align: middle;
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
import getCategory from "@/libs/categories";

interface Path {
  category?: string;
  title?: string;
  created_at?: string;
  updated_at?: string;
  waiting_count: number;
}

@Component({ components: { FetchStatusIcon } })
export default class PathList extends Vue {
  title = "ブログ 管理画面 記事情報";
  paths: { [key: string]: Path } = {};
  client = aspida();
  getCategory = getCategory;

  fetch_status: FetchStatus = "idle";

  mounted() {
    this.load();
  }

  load() {
    if (this.fetch_status == "pending") return;
    this.fetch_status = "pending";
    this.paths = {};
    AdminAuth.attempt_get_JWT()
      .then(token => {
        api(this.client)
          .blog.articles.$get()
          .then((data: BlogArticle[]) => {
            for (const article of data) {
              this.$set(this.paths, article.id, {
                category: article.category,
                title: article.title,
                created_at: article.created_at,
                updated_at: article.updated_at,
                waiting_count: 0
              });
            }
          });
        return token;
      })
      .then(token => {
        api(this.client)
          .blog.revisions.$get({
            headers: {
              "X-ADMIN-TOKEN": token.content
            }
          })
          .then((data: BlogRevision[]) => {
            for (const revision of data) {
              if (!(revision.article_id in this.paths)) {
                // does not exist
                this.$set(this.paths, revision.article_id, {
                  title: revision.title,
                  waiting_count: 0
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
}
</script>
