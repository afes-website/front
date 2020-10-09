<template>
  <forbidden :is-forbidden="forbidden" :title="page_title" class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <b-form-group label="展示 id:" v-if="admin_logged_in">
      <b-input v-model="exh_id" :state="exh_id_state" />
      <b-form-invalid-feedback v-show="exh_not_found">
        該当する展示が見つかりませんでした。
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group>
      <b-button-group>
        <b-button
          @click="hookLatestDraft"
          :disabled="!exh_id"
          :pressed="draft_latest_btn_pressed"
          variant="primary"
        >
          最新 draft を取得
          <b-spinner
            v-show="is_loading_draft_latest"
            style="height: 24px; width: 24px"
          />
        </b-button>
        <b-button
          @click="hookExhibition"
          :disabled="!exh_id"
          :pressed="exh_btn_pressed"
          variant="primary"
        >
          最新 exhibition を取得
          <b-spinner
            v-show="is_loading_exhibition"
            style="height: 24px; width: 24px"
          />
        </b-button>
      </b-button-group>
    </b-form-group>
    <b-form-group label="draft id:" v-if="admin_logged_in">
      <b-input v-model="draft_id" :state="draft_id_state" />
      <b-form-invalid-feedback v-show="draft_not_found">
        該当する draft が見つかりませんでした。
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group>
      <b-button-group>
        <b-button
          @click="hookSpecificDraft"
          :disabled="!draft_id"
          :pressed="draft_specific_btn_pressed"
          variant="primary"
        >
          指定の draft を取得
          <b-spinner
            v-show="is_loading_draft_specific"
            style="height: 24px; width: 24px"
          />
        </b-button>
      </b-button-group>
    </b-form-group>
    <IntegratedMarkdownEditor v-model="content" :old="latest_content" id="ime">
      <template v-slot:beforePreview>
        <h1>{{ exh_name }}</h1>
        <div class="under-title">
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
      </template>
    </IntegratedMarkdownEditor>
    <b-button
      @click="post"
      variant="theme-dark"
      class="mt-3 mb-2"
      :disabled="!can_post"
    >
      post
      <fetch-status-icon :status="post_status" small />
    </b-button>
  </forbidden>
</template>

<style lang="scss">
/* ==== !! be careful - NOT scoped !! ==== */

#ime {
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
import { Component, Vue, Watch } from "vue-property-decorator";
import api, { Draft } from "@afes-website/docs";
import aspida from "@aspida/axios";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";
import Markdown from "@/libs/markdown";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Forbidden from "@/components/Forbidden.vue";
import auth_eventhub from "@/libs/auth/auth_eventhub";
import IntegratedMarkdownEditor from "@/components/IntegratedMarkdownEditor.vue";

@Component({
  components: {
    IntegratedMarkdownEditor,
    FetchStatusIcon,
    Breadcrumb,
    Forbidden,
  },
})
export default class DraftPost extends Vue {
  readonly page_title = "展示更新リクエスト";
  forbidden = false;

  /* ==== input data ==== */

  content = "";
  latest_content = "";
  exh_id: string | null = null;
  _exh_name: string | null = null;
  draft_id: number | null = null;
  admin_logged_in = false;

  get exh_name() {
    return this._exh_name || "";
  }

  /* ==== load ==== */

  mounted() {
    this.load();
    auth_eventhub.onUpdateAuth(this.load);
  }

  @Watch("$route")
  on_route_changed() {
    this.mounted();
  }

  load() {
    this.forbidden = false;
    this.admin_logged_in = false;
    this.content = this.latest_content = "";
    this.exh_id = null;
    this._exh_name = null;
    this.draft_id = null;
    this.resetAllStatus();

    this.$auth
      .attempt_get_JWT(["blogAdmin", "teacher"])
      .then((token) => {
        this.admin_logged_in = true;
        if (typeof this.$route.query.exh_id === "string") {
          this.exh_id = this.$route.query.exh_id;
          this.loadExhibitionName();
          this.loadLatestDraft(token);
        }
        if (!isNaN(+this.$route.query.draft_id)) {
          this.draft_id = +this.$route.query.draft_id;
          this.loadExhibitionName();
          this.loadSpecificDraft(token, this.draft_id);
        }
      })
      .catch(() => {
        this.$auth
          .attempt_get_JWT("exhibition")
          .then((token) => {
            this.exh_id = this.$auth.get_current_user_id || "";
            this._exh_name = this.$auth.get_current_user?.name || "";
            this.loadLatestDraft(token);
          })
          .catch(() => {
            this.forbidden = true;
          });
      });
  }

  // exh_name の取得
  loadExhibitionName() {
    if (this.exh_id) {
      api(aspida())
        .online.exhibition._id(this.exh_id)
        .$get()
        .then((exh) => {
          this._exh_name = exh.name;
        });
    }
  }

  hookExhibition() {
    this.resetAllStatus();
    this.loadExhibition();
    this.loadExhibitionName();
  }

  loadExhibition() {
    this.exhibition_load_status = "pending";
    if (this.exh_id !== null) {
      api(aspida())
        .online.exhibition._id(this.exh_id)
        .$get()
        .then((exh) => {
          this.content = this.latest_content = exh.content || "";
          this.load_mode = "exhibition";
          this.exhibition_load_status = "idle";
        })
        .catch(() => {
          this.exhibition_load_status = "fail";
        });
    }
  }

  hookLatestDraft() {
    this.resetAllStatus();
    this.$auth
      .attempt_get_JWT(["exhibition", "blogAdmin", "teacher"])
      .then((token) => {
        this.loadLatestDraft(token);
        this.loadExhibitionName();
      });
  }

  loadLatestDraft(token: string) {
    this.draft_latest_status = "pending";
    if (this.exh_id !== null) {
      api(aspida())
        .online.drafts.$get({
          headers: { Authorization: "bearer " + token },
          query: { exh_id: this.exh_id },
        })
        .then((drafts) => {
          if (drafts.length) {
            const draft = drafts.slice(-1)[0];
            this.content = this.latest_content = draft.content;
            this.load_mode = "draft@latest";
            this.draft_latest_status = "idle";
          } else this.draft_specific_load_status = "fail";
        })
        .catch(() => {
          this.draft_latest_status = "fail";
        });
    } else {
      this.draft_latest_status = "idle";
    }
  }

  hookSpecificDraft() {
    this.resetAllStatus();
    this.$auth
      .attempt_get_JWT(["exhibition", "blogAdmin", "teacher"])
      .then((token) => {
        if (this.draft_id !== null)
          this.loadSpecificDraft(token, this.draft_id);
        this.loadExhibitionName();
      });
  }

  loadSpecificDraft(token: string, draft_id: number) {
    this.draft_specific_load_status = "pending";
    api(aspida())
      .online.drafts._id(draft_id)
      .$get({ headers: { Authorization: "bearer " + token } })
      .then((draft) => {
        this.content = this.latest_content = draft.content;
        this.load_mode = "draft@specific";
        this.exh_id = draft.exhibition.id;
        this.draft_specific_load_status = "idle";
      })
      .catch(() => {
        this.draft_specific_load_status = "fail";
      });
  }

  /* ==== status data ==== */

  load_mode: "draft@latest" | "draft@specific" | "exhibition" | null = null;

  draft_latest_status: FetchStatus = "idle";
  draft_specific_load_status: FetchStatus = "idle";
  exhibition_load_status: FetchStatus = "idle";
  post_status: FetchStatus = "idle";

  /* == exh_id == */

  get exh_id_state(): boolean | null {
    if (
      this.draft_latest_status === "fail" ||
      this.exhibition_load_status === "fail"
    )
      return false;
    return null;
  }

  get exh_not_found(): boolean {
    return (
      this.draft_latest_status === "fail" ||
      this.exhibition_load_status === "fail"
    );
  }

  get is_loading_draft_latest(): boolean {
    return this.draft_latest_status === "pending";
  }

  get is_loading_exhibition(): boolean {
    return this.exhibition_load_status === "pending";
  }

  get draft_latest_btn_pressed(): boolean {
    return this.load_mode === "draft@latest";
  }

  get exh_btn_pressed(): boolean {
    return this.load_mode === "exhibition";
  }

  /* == draft_id == */

  get draft_id_state(): boolean | null {
    if (this.draft_specific_load_status === "fail") return false;
    return null;
  }

  get draft_not_found(): boolean {
    return this.draft_specific_load_status === "fail";
  }

  get is_loading_draft_specific(): boolean {
    return this.draft_specific_load_status === "pending";
  }

  get draft_specific_btn_pressed(): boolean {
    return this.load_mode === "draft@specific";
  }

  resetAllStatus() {
    this.draft_latest_status = "idle";
    this.draft_specific_load_status = "idle";
    this.exhibition_load_status = "idle";
  }

  /* ==== other ==== */

  post() {
    this.post_status = "pending";

    if (this.exh_id !== null)
      this.$auth.attempt_get_JWT("exhibition").then((token) => {
        api(aspida())
          .online.drafts.$post({
            body: {
              content: this.content,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              exh_id: this.exh_id!,
            },
            headers: {
              Authorization: "bearer " + token,
            },
          })
          .then((data: Draft) => {
            this.post_status = "idle";
            this.$bvToast.toast("Exhibition Draft Created: " + data.id, {
              title: "Create new draft",
              autoHideDelay: 5000,
            });
            this.$router.push({
              name: "admin_exh_manage",
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              params: { id: this.exh_id! },
            });
          })
          .catch(() => {
            this.post_status = "fail";
          });
      });
  }

  get can_post() {
    return this.content !== this.latest_content && this.content !== "";
  }

  get time_to_read() {
    return Markdown.time_to_read(this.content);
  }
}
</script>
