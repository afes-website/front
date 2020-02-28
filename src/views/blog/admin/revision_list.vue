<template>
  <div class="box">
    <h1>{{ title }}</h1>
    <b-button @click="load">
      Reload
      <fetch-status-icon :status="fetch_status" small />
    </b-button>
    <table class="table">
      <thead>
        <tr>
          <th>id</th>
          <th>title</th>
          <th>path</th>
          <th>time</th>
          <th>status</th>
          <th>show</th>
        </tr>
      </thead>
      <tbody>
        <b-tr
          v-for="revision in sorted(revisions)"
          :key="revision.id"
          :variant="
            revision.status == 'accepted'
              ? 'success'
              : revision.status == 'rejected'
              ? 'secondary'
              : ''
          "
        >
          <th>{{ revision.id }}</th>
          <td>{{ revision.title }}</td>
          <td>{{ revision.article_id }}</td>
          <td>{{ getStringTime(revision.timestamp) }}</td>
          <td>{{ revision.status }}</td>
          <td>
            <b-link
              v-if="
                revision.article !== null &&
                  revision.article.revision_id == revision.id
              "
              :to="{
                name: 'show_article',
                params: {
                  category: revision.article.category,
                  id: revision.article_id
                }
              }"
            >
              show
            </b-link>
            <b-link
              v-else
              :to="{ name: 'revision_preview', params: { id: revision.id } }"
            >
              preview
            </b-link>
          </td>
        </b-tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  margin-bottom: 0.5rem;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import WriterAuth from "@/libs/auth/writer_auth";
import { BlogRevision } from "@/apis/blog/revisions/@types";
import { BlogArticle } from "@/apis/blog/articles/@types";
import is_axios_error from "@/libs/is_axios_error";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";

interface BlogRevisionWithArticle extends BlogRevision {
  article: BlogArticle | null;
}

@Component({ components: { FetchStatusIcon } })
export default class RevisionList extends Vue {
  title = "ブログ あなたの記事リクエスト一覧";
  revisions: BlogRevisionWithArticle[] = [];
  client = aspida();

  fetch_status: FetchStatus = "idle";

  mounted() {
    this.load();
  }

  load() {
    if (this.fetch_status == "pending") return;
    this.fetch_status = "pending";
    this.revisions = [];
    WriterAuth.attempt_get_JWT()
      .then(token => {
        api(this.client)
          .blog.revisions.$get({
            headers: {
              "X-BLOG-WRITER-TOKEN": token.content
            }
          })
          .then((data: BlogRevision[]) => {
            const promises: Promise<void>[] = [];
            for (const revision of data) {
              promises.push(
                api(this.client)
                  .blog.articles._id(revision.article_id)
                  .$get()
                  .then((article: BlogArticle) => {
                    this.revisions.push({
                      ...revision,
                      article: article
                    });
                  })
                  .catch((e: unknown) => {
                    if (
                      is_axios_error(e) &&
                      e.response &&
                      e.response.status == 404
                    ) {
                      this.revisions.push({
                        ...revision,
                        article: null
                      });
                      return;
                    }
                    throw e;
                  })
              );
            }
            Promise.all(promises)
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
      })
      .catch(() => {
        this.fetch_status = "fail";
      });
  }

  sorted(revisions: BlogRevisionWithArticle[]) {
    return revisions.sort((a, b) => {
      return a.id - b.id;
    });
  }

  getStringTime(laravel_time: string): string {
    const date = new Date(Date.parse(laravel_time));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
    return year + "/" + month + "/" + day + " " + hour + ":" + min;
  }
}
</script>
