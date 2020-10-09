<template>
  <forbidden :is-forbidden="forbidden" :title="page_title" class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <b-form-group label="展示 id:" v-if="admin_logged_in">
      <b-input v-model="exh_id" :state="exhIdFormState" />
      <b-form-invalid-feedback v-show="exhibitionNotFound">
        該当する展示が見つかりませんでした。
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group>
      <b-button-group>
        <b-button
          @click="reloadLatestDraft"
          :disabled="!exh_id"
          :pressed="draftLatestButtonPressed"
          variant="primary"
        >
          最新 draft を取得
        </b-button>
        <b-button
          @click="reloadExhibition"
          :disabled="!exh_id"
          :pressed="exhibitionButtonPressed"
          variant="primary"
        >
          最新 exhibition を取得
        </b-button>
      </b-button-group>
    </b-form-group>
    <b-form-group label="draft id:" v-if="admin_logged_in">
      <b-input v-model="draft_id" :state="draftIdFormState" />
      <b-form-invalid-feedback v-show="draftNotFound">
        該当する draft が見つかりませんでした。
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group>
      <b-button-group>
        <b-button
          @click="reloadSpecificDraft"
          :disabled="!draft_id"
          :pressed="draftSpecificButtonPressed"
          variant="primary"
        >
          指定の draft を取得
        </b-button>
      </b-button-group>
    </b-form-group>
    <IntegratedMarkdownEditor v-model="content" :old="latest_content" id="ime">
      <template v-slot:beforePreview>
        <h1>{{ _exh_name }}</h1>
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
      <fetch-status-icon :status="status" small />
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

  content = "";
  latest_content = "";
  exh_id: string | null = null;
  exh_name: string | null = null;
  draft_id: number | null = null;
  admin_logged_in = false;

  loadMode: "draft@latest" | "draft@specific" | "exhibition" | null = null;

  draftLatestLoadStatus: FetchStatus = "idle";
  draftSpecificLoadStatus: FetchStatus = "idle";
  exhibitionLoadStatus: FetchStatus = "idle";
  postStatus: FetchStatus = "idle";

  get exhIdFormState(): boolean | null {
    if (
      this.draftLatestLoadStatus === "fail" ||
      this.exhibitionLoadStatus === "fail"
    )
      return false;
    return null;
  }

  get exhibitionNotFound() {
    return (
      this.draftLatestLoadStatus === "fail" ||
      this.exhibitionLoadStatus === "fail"
    );
  }

  get draftIdFormState(): boolean | null {
    if (this.draftSpecificLoadStatus === "fail") return false;
    return null;
  }

  get draftNotFound() {
    return this.draftSpecificLoadStatus === "fail";
  }

  resetAllStatus() {
    this.draftLatestLoadStatus = "idle";
    this.draftSpecificLoadStatus = "idle";
    this.exhibitionLoadStatus = "idle";
  }

  get _exh_name() {
    return this.exh_name || "";
  }

  forbidden = false;

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
    this.exh_name = null;
    this.draft_id = null;

    this.$auth
      .attempt_get_JWT(["blogAdmin", "teacher"])
      .then((token) => {
        this.admin_logged_in = true;
        if (typeof this.$route.query.exh_id === "string") {
          this.exh_id = this.$route.query.exh_id;
          this.reloadExhibitionInfo();
          this.loadLatestDraft(token);
        }
        if (!isNaN(+this.$route.query.draft_id)) {
          this.draft_id = +this.$route.query.draft_id;
          this.reloadExhibitionInfo();
          this.loadSpecificDraft(token, this.draft_id);
        }
      })
      .catch(() => {
        this.$auth
          .attempt_get_JWT("exhibition")
          .then((token) => {
            this.exh_id = this.$auth.get_current_user_id || "";
            this.exh_name = this.$auth.get_current_user?.name || "";
            this.loadLatestDraft(token);
          })
          .catch(() => {
            this.forbidden = true;
          });
      });
  }

  reloadExhibitionInfo() {
    if (this.exh_id) {
      api(aspida())
        .online.exhibition._id(this.exh_id)
        .$get()
        .then((exh) => {
          this.exh_name = exh.name;
        });
    }
  }

  reloadLatestDraft() {
    this.resetAllStatus();
    this.$auth
      .attempt_get_JWT(["exhibition", "blogAdmin", "teacher"])
      .then((token) => {
        this.loadLatestDraft(token);
        this.reloadExhibitionInfo();
      });
  }

  loadLatestDraft(token: string) {
    this.draftLatestLoadStatus = "pending";
    if (this.exh_id !== null) {
      api(aspida())
        .online.drafts.$get({
          headers: { Authorization: "bearer " + token },
          query: { exh_id: this.exh_id },
        })
        .then((drafts) => {
          if (drafts.length) {
            const latestDraft = drafts.slice(-1)[0];
            if (latestDraft.exhibition.id === this.exh_id) {
              const draft = drafts.slice(-1)[0];
              this.content = this.latest_content = draft.content;
              this.loadMode = "draft@latest";
              this.draftLatestLoadStatus = "idle";
            }
          }
        })
        .catch(() => {
          this.draftLatestLoadStatus = "fail";
        });
    } else {
      this.draftLatestLoadStatus = "idle";
    }
  }

  get draftLatestButtonPressed(): boolean {
    return this.loadMode === "draft@latest";
  }

  reloadSpecificDraft() {
    this.resetAllStatus();
    this.$auth
      .attempt_get_JWT(["exhibition", "blogAdmin", "teacher"])
      .then((token) => {
        if (this.draft_id !== null)
          this.loadSpecificDraft(token, this.draft_id);
        this.reloadExhibitionInfo();
      });
  }

  loadSpecificDraft(token: string, draft_id: number) {
    this.draftSpecificLoadStatus = "pending";
    api(aspida())
      .online.drafts._id(draft_id)
      .$get({ headers: { Authorization: "bearer " + token } })
      .then((draft) => {
        this.content = this.latest_content = draft.content;
        this.loadMode = "draft@specific";
        this.exh_id = draft.exhibition.id;
        this.draftSpecificLoadStatus = "idle";
      })
      .catch(() => {
        this.draftSpecificLoadStatus = "fail";
      });
  }

  get draftSpecificButtonPressed(): boolean {
    return this.loadMode === "draft@specific";
  }

  reloadExhibition() {
    this.resetAllStatus();
    this.loadExhibition();
    this.reloadExhibitionInfo();
  }

  loadExhibition() {
    this.exhibitionLoadStatus = "pending";
    if (this.exh_id !== null) {
      api(aspida())
        .online.exhibition._id(this.exh_id)
        .$get()
        .then((exh) => {
          this.content = this.latest_content = exh.content;
          this.loadMode = "exhibition";
          this.exhibitionLoadStatus = "idle";
        })
        .catch(() => {
          this.exhibitionLoadStatus = "fail";
        });
    }
  }

  get exhibitionButtonPressed(): boolean {
    return this.loadMode === "exhibition";
  }

  post() {
    this.postStatus = "pending";

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
            this.postStatus = "idle";
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
            this.postStatus = "fail";
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
