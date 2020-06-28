<template>
  <div class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <template v-if="writing">
      <b-alert variant="theme-dark" show>
        寄稿の受付は麻布生のみとなっています。麻布生以外の方の寄稿はご遠慮ください。
        <hr />
        <a href="https://afes.info/blog/internal/contrib_announce">
          寄稿案内・ルールはこちら
        </a>
      </b-alert>
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
      <b-form-group label="handle name (optional):">
        <b-input
          v-model="handle_name"
          @change="apply_ogimage_title"
          placeholder="名もなき麻布生"
        />
      </b-form-group>
      <b-tabs>
        <b-tab title="編集" active>
          <b-textarea v-model="content" class="edit-area"></b-textarea>
        </b-tab>
        <b-tab title="プレビュー" id="preview">
          <h1>{{ decoded_article_title }}</h1>
          <div class="under-title">
            <span>
              <font-awesome-icon :icon="'user'" class="fa-fw" />
              名もなき麻布生
            </span>
            <span>
              <font-awesome-icon :icon="'folder'" class="fa-fw" />
              個人･寄稿
            </span>
            <span>
              <font-awesome-icon :icon="'clock'" class="fa-fw" />
              yyyy/mm/dd
            </span>
          </div>
          <div v-html="rendered_content"></div>
          <hr />
          <h3>card preview</h3>
          <b-card
            :img-src="card_image"
            img-alt="eye catch"
            img-left
            class="mb-3"
          >
            <b-card-title>
              {{ decoded_article_title }}
            </b-card-title>
            <b-card-sub-title>
              <span>
                <font-awesome-icon :icon="'user'" class="fa-fw" />
                名もなき麻布生
              </span>
              <span>
                <font-awesome-icon :icon="'folder'" class="fa-fw" />
                個人･寄稿
              </span>
              <span>
                <font-awesome-icon :icon="'clock'" class="fa-fw" />
                yyyy/mm/dd
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
            <small class="text-danger">
              タイトルを指定してください。
            </small>
          </div>
        </b-tab>
      </b-tabs>
      <b-button
        @click="post"
        variant="theme-dark"
        class="mt-3 mb-2"
        :disabled="!can_post"
      >
        投稿
        <fetch-status-icon :status="status" small />
      </b-button>
    </template>
    <template v-else>
      <b-alert variant="success" show>
        寄稿リクエストが完了しました。委員長もしくは総務局長の承認後に公開されます。
      </b-alert>
      <b-button variant="theme-dark" @click="moreContrib" class="mb-4">
        さらに寄稿する
      </b-button>
      <b-table-simple>
        <b-tbody>
          <b-tr>
            <b-th>
              number
            </b-th>
            <b-td>
              {{ get_revision_id(revision) }}
            </b-td>
          </b-tr>
          <b-tr>
            <b-th>
              id
            </b-th>
            <b-td>
              {{ get_revision_article_id(revision) }}
            </b-td>
          </b-tr>
          <b-tr>
            <b-th>
              title
            </b-th>
            <b-td>
              {{ get_revision_title(revision) }}
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
      <p>
        加筆･訂正などございましたら
        <b-link :to="{ name: 'contact' }">お問い合わせ</b-link>
        より上記の情報を添えてご連絡ください。
      </p>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.edit-area,
div.preview {
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
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import { BlogRevision } from "@/apis/blog/revisions/@types";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";
import Markdown from "@/libs/markdown";
import Breadcrumb from "@/components/Breadcrumb.vue";

@Component({ components: { FetchStatusIcon, Breadcrumb } })
export default class NewRevision extends Vue {
  readonly page_title = "新規寄稿";

  article_title = "";
  ogimage_title = "";
  content = "";
  handle_name: string | null = null;
  ogimage_handle_name: string | null = null;

  status: FetchStatus = "idle";
  fetch_status: FetchStatus = "idle";
  writing = true;
  revision?: BlogRevision;

  readonly noImage = require("@/assets/no-image.svg");

  post() {
    this.status = "pending";

    api(aspida())
      .blog.revisions.contrib.$post({
        data: {
          title: this.article_title,
          content: this.content,
          handle_name: this.handle_name,
        },
      })
      .then((data: BlogRevision) => {
        this.status = "idle";
        this.$bvToast.toast("Revision created: " + data.id, {
          // TODO: toast won't shows (main.scss causes?)
          title: "Create new revision",
          autoHideDelay: 5000,
        });
        this.writing = false;
        this.revision = data;
      })
      .catch(() => {
        this.status = "fail";
      });
  }

  moreContrib() {
    this.article_title = "";
    this.ogimage_title = "";
    this.content = "";
    this.writing = !this.writing;
  }

  get rendered_content() {
    return Markdown.render(this.content);
  }

  get card_text(): string {
    return Markdown.render_plaintext(this.content);
  }

  get card_image() {
    return Markdown.get_first_image(this.content) || this.noImage;
  }

  apply_ogimage_title() {
    this.ogimage_title = this.article_title;
    this.ogimage_handle_name = this.handle_name || "名もなき麻布生";
  }

  get ogimage_url() {
    return `https://api.afes.info/ogimage/preview?title=${this.ogimage_title}&author=${this.ogimage_handle_name}&category=個人･寄稿`;
  }

  get can_post() {
    return this.article_title !== "";
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

  get_revision_title(revision: BlogRevision) {
    return revision.title;
  }
  get_revision_id(revision: BlogRevision) {
    return revision.id;
  }
  get_revision_article_id(revision: BlogRevision) {
    return revision.article_id;
  }
}
</script>
