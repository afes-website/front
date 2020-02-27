<template>
  <div class="box">
    <h1>{{ title }}</h1>
    <p>path:<b-input v-model="article_path" /></p>
    <p>title:<b-input v-model="article_title" /></p>
    <b-textarea v-model="content"></b-textarea>
    <b-button @click="post" variant="primary">post</b-button>
    {{ status }}
  </div>
</template>

<style lang="scss"></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import WriterAuth from "@/libs/auth/writer_auth";
import { BlogRevision } from "@/apis/blog/revisions/@types";
import FetchStatus from "@/libs/fetch_status";

@Component
export default class NewRevision extends Vue {
  title = "ブログ 記事投稿/編集";

  article_title = "";
  article_path = "";
  content = "";

  status: FetchStatus = "idle";

  post() {
    this.status = "pending";

    WriterAuth.attempt_get_JWT().then(token => {
      api(aspida())
        .blog.revisions.$post({
          data: {
            title: this.article_title,
            article_id: this.article_path,
            content: this.content
          },
          headers: {
            "X-BLOG-WRITER-TOKEN": token.content
          }
        })
        .then((data: BlogRevision) => {
          this.status = "idle";
          this.$bvToast.toast("Revision created: " + data.id, {
            // TODO: toast won't shows (main.scss causes?)
            title: "Create new revision",
            autoHideDelay: 5000
          });
        })
        .catch(() => {
          this.status = "fail";
        });
    });
  }
}
</script>
