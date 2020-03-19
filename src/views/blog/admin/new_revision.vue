<template>
  <div class="box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <p>id:<b-input v-model="article_path" /></p>
    <p>
      <b-button @click="load" :disabled="article_path === ''">
        記事情報を読みこむ
        <fetch-status-icon :status="fetch_status" />
      </b-button>
    </p>
    <p>title:<b-input v-model="article_title" /></p>
    <b-tabs>
      <b-tab title="編集" active>
        <div class="toolbar">
          <b-button @click="image_upload_modal_shown = true">
            画像を追加
          </b-button>
        </div>
        <b-textarea v-model="content" class="edit-area"></b-textarea>
      </b-tab>
      <b-tab title="プレビュー" id="preview">
        <h1>{{ article_title }}</h1>
        <div class="under-title">
          <span>
            <font-awesome-icon :icon="'user'" class="fa-fw" />
            author
          </span>
          <span>
            <font-awesome-icon :icon="'folder'" class="fa-fw" />
            category
          </span>
          <span>
            <font-awesome-icon :icon="'clock'" class="fa-fw" />
            yyyy/mm/dd
          </span>
        </div>
        <div v-html="rendered_content"></div>
      </b-tab>
      <b-tab title="現在との差分">
        <div id="diff-view" v-html="diff_from_current" class="diff"></div>
      </b-tab>
    </b-tabs>
    <b-button
      @click="post"
      variant="primary"
      class="mt-3 mb-2"
      :disabled="article_path === '' || article_title === ''"
    >
      post
      <fetch-status-icon :status="status" small />
    </b-button>
    <image-upload-modal
      v-model="image_upload_modal_shown"
      @uploaded="image_uploaded"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/wide_main_box.scss";

.edit-area,
div.preview,
div.diff {
  height: 750px;
  overflow: scroll;
  border: 1px solid #ced4da;
  border-radius: 4px;
}
div#preview {
  padding-top: 1rem;
  max-width: 804px;
}
</style>

<style lang="scss">
#preview {
  .under-title {
    margin-top: -14px;
    margin-bottom: 16px;
    text-align: right;
    color: #6c757d;
    font-weight: 500;

    span {
      margin-right: 0.5em;
    }
  }
}
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
      position: unset;
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
import ImageUploadModal from "@/components/ImageUploadModal.vue";
import { get_image_url } from "@/apis/images/@utils";
import Breadcrumb from "@/components/Breadcrumb.vue";

@Component({ components: { FetchStatusIcon, ImageUploadModal, Breadcrumb } })
export default class NewRevision extends Vue {
  readonly page_title = "記事投稿/編集";

  article_title = "";
  article_path = "";
  content = "";
  latest_content = "";

  status: FetchStatus = "idle";
  fetch_status: FetchStatus = "idle";

  image_upload_modal_shown = false;

  image_uploaded(id: string) {
    this.content += `![image alt](${get_image_url(id)})\n`;
  }

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
          this.$router.push({ name: "revision_list" });
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
