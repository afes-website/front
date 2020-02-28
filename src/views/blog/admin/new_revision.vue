<template>
  <div class="box">
    <h1>{{ title }}</h1>
    <p>path:<b-input v-model="article_path" /></p>
    <p>
      <b-button @click="load">
        記事情報を読みこむ
        <fetch-status-icon :status="fetch_status" />
      </b-button>
    </p>
    <p>title:<b-input v-model="article_title" /></p>
    <b-tabs>
      <b-tab title="編集" active>
        <b-textarea v-model="content" rows="30"></b-textarea>
      </b-tab>
      <b-tab title="プレビュー">
        <div v-html="rendered_content"></div>
      </b-tab>
      <b-tab title="現在との差分">
        <div id="diff-view" v-html="diff_from_current"></div>
      </b-tab>
    </b-tabs>
    <b-button @click="post" variant="primary">
      post
      <fetch-status-icon :status="status" small />
    </b-button>
  </div>
</template>

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
import { Component, Vue } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import WriterAuth from "@/libs/auth/writer_auth";
import { BlogRevision } from "@/apis/blog/revisions/@types";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";
import Markdown from "@/libs/markdown";
import DiffLib from "difflib";
import * as Diff2Html from "diff2html";

@Component({ components: { FetchStatusIcon } })
export default class NewRevision extends Vue {
  title = "ブログ 記事投稿/編集";

  article_title = "";
  article_path = "";
  content = "";
  latest_content = "";

  status: FetchStatus = "idle";
  fetch_status: FetchStatus = "idle";

  load() {
    this.fetch_status = "pending";
    api(aspida())
      .blog.articles._id(this.article_path)
      .$get()
      .then(article => {
        this.article_title = article.title;
        this.latest_content = article.content;
        this.content = article.content;
        this.fetch_status = "idle";
      })
      .catch(() => {
        this.fetch_status = "fail";
      });
  }

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

  get rendered_content() {
    return Markdown.render(this.content);
  }

  get diff_from_current(): string {
    const diff = DiffLib.unifiedDiff(
      this.latest_content.split("\n"), // old
      this.content.split("\n"), // new
      {
        fromfile: "Original",
        tofile: "Current",
        lineterm: ""
      }
    ).join("\n");
    return Diff2Html.html(diff, {
      drawFileList: true,
      matching: "lines",
      outputFormat: "side-by-side"
    });
  }
}
</script>
