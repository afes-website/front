<template>
  <forbidden :is-forbidden="forbidden" :title="page_title" id="show-revision">
    <template v-if="found_draft">
      <breadcrumb :text="page_title" />
      <b-alert show variant="info">
        これは下書きのプレビューです。<br />
        <b-badge :variant="status_color">
          {{ status }}
        </b-badge>
        <span>
          <font-awesome-icon icon="file" class="fa-fw" />
          {{ draft_id }}
        </span>
      </b-alert>
      <h1>{{ page_title }}</h1>
      <div class="under-title">
        <span>
          <font-awesome-icon :icon="'clock'" class="fa-fw" />
          {{ timestamp }}
        </span>
        <b-button-group>
          <b-button
            variant="secondary"
            size="sm"
            :to="{ name: 'admin_draft_manage', params: { id: draft_id } }"
          >
            <font-awesome-icon icon="wrench" class="fa-fw" />
            Draft 管理ページ
          </b-button>
          <b-button
            variant="secondary"
            size="sm"
            :to="{ name: 'admin_exh_manage', params: { id: exhibition_id } }"
          >
            <font-awesome-icon icon="wrench" class="fa-fw" />
            Exhibition 管理ページ
          </b-button>
        </b-button-group>
      </div>
      <div class="main-content" v-html="rendered_md" />
    </template>
    <template v-else>
      <p>{{ fetch_status }}</p>
    </template>
  </forbidden>
</template>

<style lang="scss" scoped>
#show-revision {
  max-width: 952px;
  .under-title {
    margin-top: -14px;
    margin-bottom: 16px;
    text-align: right;
    color: var(--secondary);
    font-weight: 500;

    p {
      margin-bottom: 0;
    }
  }
}
span {
  margin-right: 0.5em;
  white-space: nowrap;
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import api, { Draft } from "@afes-website/docs";
import aspida from "@aspida/axios";
import is_axios_error from "@/libs/is_axios_error";
import FetchStatus from "@/libs/fetch_status";
import Markdown from "@/libs/markdown";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { getStringTime } from "@/libs/string_date";
import Forbidden from "@/components/Forbidden.vue";
import auth_eventhub from "@/libs/auth/auth_eventhub";

@Component({
  components: {
    Breadcrumb,
    Forbidden,
  },
})
export default class DraftPreview extends Vue {
  page_title = "";
  draft: Draft | null = null;
  client = aspida();
  fetch_status: FetchStatus = "idle";
  forbidden = false;

  mounted() {
    this.load();
    auth_eventhub.onUpdateAuth(this.load);
  }
  @Watch("$route")
  route_changed() {
    this.load();
  }

  async load() {
    this.forbidden = false;
    this.draft = null;
    this.fetch_status = "pending";

    let token = "";

    try {
      token = await this.$auth.attempt_get_JWT(["exhibition", "blogAdmin"]);
    } catch {
      this.forbidden = true;
      return;
    }

    api(this.client)
      .online.drafts._id(Number(this.$route.params.id))
      .$get({ headers: { Authorization: "bearer " + token } })
      .then((data) => {
        this.draft = data;
        this.page_title = data.exhibition.name;
        this.fetch_status = "idle";
      })
      .catch((e: unknown) => {
        if (is_axios_error(e)) {
          if (e.response && e.response.status == 404) this.$emit("not_found");
          if (e.response && e.response.status == 403) this.forbidden = true;
        }
        this.fetch_status = "fail";
      });
  }

  get rendered_md(): string | null {
    if (this.draft == null) return null;
    return Markdown.render(this.draft.content);
  }

  get found_draft() {
    return this.draft !== null;
  }

  get draft_id() {
    return this.draft?.id;
  }

  get exhibition_id() {
    return this.draft?.exhibition.id;
  }

  get status_color() {
    if (this.draft === null) return "";
    switch (this.draft.status) {
      case "accepted":
        return "success";
      case "rejected":
        return "secondary";
      case "waiting":
        return "";
    }
    return "";
  }

  get status() {
    return this.draft?.status;
  }

  get timestamp() {
    return this.draft === null ? null : getStringTime(this.draft.created_at);
  }
}
</script>
