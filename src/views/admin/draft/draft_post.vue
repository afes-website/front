<template>
  <forbidden :is-forbidden="forbidden" :title="page_title" class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
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

  get _exh_name() {
    return this.exh_name || "";
  }

  status: FetchStatus = "idle";
  fetch_status: FetchStatus = "idle";

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
    this.$auth
      .attempt_get_JWT("exhibition")
      .then(() => {
        this.exh_id = this.$auth.get_current_user_id || "";
        this.exh_name = this.$auth.get_current_user?.name || "";
        this.loadLatestContent();
      })
      .catch(() => {
        this.forbidden = true;
      });
  }

  loadLatestContent() {
    if (this.exh_id) {
      api(aspida())
        .online.exhibition._id(this.exh_id)
        .$get()
        .then((res) => {
          this.content = this.latest_content = res.content;
        });
    }
  }

  post() {
    this.status = "pending";

    this.$auth.attempt_get_JWT("exhibition").then((token) => {
      api(aspida())
        .online.drafts.$post({
          body: {
            content: this.content,
            exh_id: this.$auth.get_current_user_id || "",
          },
          headers: {
            Authorization: "bearer " + token,
          },
        })
        .then((data: Draft) => {
          this.status = "idle";
          this.$bvToast.toast("Exhibition Draft Created: " + data.id, {
            // TODO: toast won't shows (main.scss causes?)
            title: "Create new draft",
            autoHideDelay: 5000,
          });
          this.$router.push({
            name: "admin_exh_manage",
            params: { id: this.$auth.get_current_user_id || "" },
          });
        })
        .catch(() => {
          this.status = "fail";
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
