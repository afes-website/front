<template>
  <article class="box">
    <h1>{{ title }}</h1>
    <b-button @click="load">Reload</b-button>
    <table class="table">
      <thead>
        <tr>
          <th>path</th>
          <th>title</th>
          <th>category</th>
          <th>created</th>
          <th>updated</th>
          <th>show</th>
          <th>edit</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(path, route) in paths" :key="route">
          <th>{{ route }}</th>
          <td>{{ path.title || "-" }}</td>
          <td>{{ path.category || "-" }}</td>
          <td>{{ path.created_at || "-" }}</td>
          <td>{{ path.updated_at || "-" }}</td>
          <td><b-link>show</b-link></td>
          <td>
            <b-link :to="{ name: 'manage_path', params: { id: route } }"
              >edit</b-link
            >
          </td>
          <td>
            <b-badge
              variant="info"
              v-if="path.waiting_count != 0"
              v-b-tooltip.hover
              :title="'has ' + path.waiting_count + ' waiting revisions'"
              >{{ path.waiting_count }}</b-badge
            >
          </td>
        </tr>
      </tbody>
    </table>
  </article>
</template>

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
import { attempt_get_JWT } from "@/libs/auth/admin_auth";
import { BlogRevision } from "@/apis/blog/revisions/@types";

interface Path {
  category?: string;
  title?: string;
  created_at?: string;
  updated_at?: string;
  waiting_count: number;
}

@Component
export default class PathList extends Vue {
  title = "ブログ 管理画面 記事情報";
  paths: { [key: string]: Path } = {};
  client = aspida();
  mounted() {
    this.load();
  }

  load() {
    this.paths = {};
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
      })
      .then(async () => {
        return api(this.client).blog.revisions.$get({
          headers: { "X-ADMIN-TOKEN": (await attempt_get_JWT()).content }
        });
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
      });
  }
}
</script>
