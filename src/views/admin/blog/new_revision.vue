<template>
  <forbidden :is-forbidden="forbidden" class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <b-form-group label="id:">
      <b-input v-model="article_path" :state="is_valid_path" />
      <b-form-invalid-feedback v-if="!is_valid_path">
        idには英数、アンダーバー(<code>_</code>)、ハイフン(<code>-</code>)のみ使用することができます。
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group>
      <b-button @click="loadArticle" :disabled="is_article_path_empty">
        記事情報を読みこむ
        <fetch-status-icon :status="fetch_status" />
      </b-button>
    </b-form-group>
    <b-form-group label="title:">
      <b-input
        v-model="article_title"
        @change="apply_ogimage_title"
        :state="!!article_title"
      />
      <b-form-invalid-feedback v-if="!article_title">
        タイトルを指定してください。
      </b-form-invalid-feedback>
      <template v-slot:description>
        <code>%0A</code>または<code>\n</code>で og:image 内で改行できます。
      </template>
    </b-form-group>
    <b-tabs>
      <b-tab title="編集" active>
        <div class="toolbar">
          <b-button @click="show_image_upload_modal"> 画像を追加 </b-button>
        </div>
        <b-textarea v-model="content" class="edit-area"></b-textarea>
      </b-tab>
      <b-tab title="プレビュー" id="preview">
        <h1>{{ decoded_article_title }}</h1>
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
          <span>
            <font-awesome-icon :icon="'stopwatch'" class="fa-fw" />
            約 {{ time_to_read }} 分
          </span>
        </div>
        <div v-html="rendered_content"></div>
        <hr />
        <h3>card preview</h3>
        <b-card :img-src="card_image" img-alt="eye catch" img-left class="mb-3">
          <b-card-title>
            {{ decoded_article_title }}
          </b-card-title>
          <b-card-sub-title>
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
            <span>
              <font-awesome-icon :icon="'stopwatch'" class="fa-fw" />
              約 {{ time_to_read }} 分
            </span>
          </b-card-sub-title>
          <b-card-text v-html="card_text" />
        </b-card>
        <h3>og:image preview</h3>
        <small class="text-muted">
          SNSで共有されたときのサムネイルのプレビュー
        </small>
        <img v-if="!!ogimage_title" :src="ogimage_url" alt="" />
        <div v-else>
          <small class="text-danger"> タイトルを指定してください。 </small>
        </div>
      </b-tab>
      <b-tab title="現在との差分">
        <div id="diff-view" v-html="diff_from_current" class="diff"></div>
      </b-tab>
    </b-tabs>
    <b-button
      @click="post"
      variant="theme-dark"
      class="mt-3 mb-2"
      :disabled="!can_post"
    >
      post
      <fetch-status-icon :status="status" small />
    </b-button>
    <image-upload-modal
      v-model="image_upload_modal_shown"
      @uploaded="image_uploaded"
    />
  </forbidden>
</template>

<style lang="scss" scoped>
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
  max-width: 952px;
}

.card {
  height: 150px;
  width: 100%;
  color: #222;
  .card-img-left {
    max-width: 148px; // 150px(height) - 1px(border) * 2
    min-width: 148px; // tricky solution for image collapsing
    display: block;
    width: auto;
    height: auto;
  }

  .card-body {
    overflow: hidden;
    width: 100%;
    .card-title {
      margin-top: -8px;
      margin-bottom: 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      max-height: 1.2em;
      white-space: nowrap;
    }

    .card-subtitle {
      margin-bottom: 5px;

      span {
        margin-right: 0.5em;
      }
    }

    .card-text {
      display: block; // fallback
      display: -webkit-box;
      //max-height: 4.5em;
      position: relative;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; // 2 lines
      text-overflow: ellipsis;
      line-height: 1.5;
    }
  }
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
@import "../../../../node_modules/diff2html/bundles/css/diff2html.min.css";
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
import { Component, Vue, Watch } from "vue-property-decorator";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import { BlogRevision } from "@afes-website/docs";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";
import Markdown from "@/libs/markdown";
import DiffLib from "difflib";
import * as Diff2Html from "diff2html";
import ImageUploadModal from "@/components/ImageUploadModal.vue";
import { get_image_url } from "@afes-website/docs";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Forbidden from "@/components/Forbidden.vue";
import auth_eventhub from "@/libs/auth/auth_eventhub";

@Component({
  components: { FetchStatusIcon, ImageUploadModal, Breadcrumb, Forbidden },
})
export default class NewRevision extends Vue {
  readonly page_title = "記事投稿/編集";

  article_title = "";
  ogimage_title = "";
  article_path = "";
  content = "";
  latest_content = "";

  status: FetchStatus = "idle";
  fetch_status: FetchStatus = "idle";

  image_upload_modal_shown = false;

  forbidden = false;

  readonly noImage = require("@/assets/no-image.svg");

  image_uploaded(id: string) {
    this.content += `![image alt](${get_image_url(id)})\n`;
  }

  mounted() {
    if ("path" in this.$route.query && !Array.isArray(this.$route.query.path)) {
      this.article_path = this.$route.query.path;
      this.loadArticle();
    }
    this.load();
    auth_eventhub.onUpdateAuth(this.load);
  }

  @Watch("$route")
  on_route_changed() {
    this.mounted();
  }

  load() {
    this.forbidden = false;
    this.$auth.attempt_get_JWT("blogWriter").catch(() => {
      this.forbidden = true;
    });
  }

  loadArticle() {
    this.fetch_status = "pending";
    api(aspida())
      .blog.articles._id(this.article_path)
      .$get()
      .then((article) => {
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

    this.$auth.attempt_get_JWT("blogWriter").then((token) => {
      api(aspida())
        .blog.revisions.$post({
          body: {
            title: this.article_title,
            article_id: this.article_path,
            content: this.content,
            handle_name: null,
          },

          headers: {
            Authorization: "bearer " + token,
          },
        })
        .then((data: BlogRevision) => {
          this.status = "idle";
          this.$bvToast.toast("Revision created: " + data.id, {
            // TODO: toast won't shows (main.scss causes?)
            title: "Create new revision",
            autoHideDelay: 5000,
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
        lineterm: "",
      }
    ).join("\n");
    return Diff2Html.html(diff, {
      drawFileList: true,
      matching: "lines",
      outputFormat: "side-by-side",
    });
  }

  get card_text(): string {
    return Markdown.render_plaintext(this.content);
  }

  get card_image() {
    return Markdown.get_first_image(this.content) || this.noImage;
  }

  readonly path_rule = /^[A-Za-z0-9_-]+$/;
  get is_valid_path() {
    return this.path_rule.test(this.article_path);
  }

  get is_article_path_empty() {
    return this.article_path === "";
  }

  apply_ogimage_title() {
    this.ogimage_title = this.article_title;
  }

  show_image_upload_modal() {
    this.image_upload_modal_shown = true;
  }

  get ogimage_url() {
    return `https://api.afes.info/ogimage/preview?title=${this.ogimage_title}&author=author&category=category`;
  }

  get can_post() {
    return this.article_path !== "" && this.article_title !== "";
  }

  get decoded_article_title() {
    let decoded = this.article_title;
    decoded = unescape(decoded);
    decoded = decoded.replace(/\\(.)/g, function (ma, m1) {
      switch (m1) {
        case "n":
          return "";
        case "\\":
          return "\\";
        default:
          return "\\" + m1;
      }
    });
    decoded = decoded.replace(/\n/g, "");
    return decoded;
  }

  get time_to_read() {
    return Markdown.time_to_read(this.content);
  }
}
</script>