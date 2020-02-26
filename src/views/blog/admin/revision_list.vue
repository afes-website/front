<template>
  <div class="box">
    <h1>{{ title }}</h1>
    <b-button @click="load">Reload</b-button>
    {{ fetch_status }}
    <table class="table">
      <thead>
        <tr>
          <th>id</th>
          <th>title</th>
          <th>path</th>
          <th>timestamp</th>
          <th>status</th>
          <th>show</th>
        </tr>
      </thead>
      <tbody>
        <b-tr
          v-for="revision in revisions"
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
          <td>{{ revision.timestamp }}</td>
          <td>{{ revision.status }}</td>
          <td>
            <b-link
              v-if="revision.status == 'accepted'"
              :to="{
                name: 'show_article',
                params: { category: 'category', id: revision.article_id } // this will be redirected.
              }"
            >
              show
            </b-link>
          </td>
        </b-tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import WriterAuth from "@/libs/auth/writer_auth";
import { BlogRevision } from "@/apis/blog/revisions/@types";

interface Path {
  category?: string;
  title?: string;
  created_at?: string;
  updated_at?: string;
  waiting_count: number;
}

@Component
export default class RevisionList extends Vue {
  title = "ブログ あなたの記事リクエスト一覧";
  revisions: BlogRevision[] = [];
  client = aspida();

  fetch_status: "idle" | "pending" | "fail" = "idle";

  mounted() {
    this.load();
  }

  load() {
    if (this.fetch_status == "pending") return;
    this.fetch_status = "pending";
    this.revisions = [];
    WriterAuth.attempt_get_JWT().then(token => {
      api(this.client)
        .blog.revisions.$get({
          headers: {
            "X-BLOG-WRITER-TOKEN": token.content
          }
        })
        .then((data: BlogRevision[]) => {
          this.revisions = data;
          this.fetch_status = "idle";
        })
        .catch(() => {
          this.fetch_status = "fail";
        });
    });
  }
}
</script>
