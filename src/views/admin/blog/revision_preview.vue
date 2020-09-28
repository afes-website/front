<template>
  <forbidden :is-forbidden="forbidden" id="show-revision">
    <template v-if="found_revision">
      <breadcrumb :text="page_title" />
      <b-alert show variant="info">
        この投稿はプレビューです。<br />
        <b-badge :variant="status_color">
          {{ status }}
        </b-badge>
        <span>
          <font-awesome-icon icon="file" class="fa-fw" />
          {{ article_id }}
        </span>
      </b-alert>
      <h1>{{ page_title }}</h1>
      <div class="under-title">
        <p>
          <span>
            <font-awesome-icon :icon="'user'" class="fa-fw" />
            {{ author_name }}
          </span>
          <span>
            <font-awesome-icon :icon="'clock'" class="fa-fw" />
            {{ timestamp }}
          </span>
        </p>
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
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import { BlogRevision } from "@afes-website/docs";
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
export default class ShowRevision extends Vue {
  page_title = "";
  revision: BlogRevision | null = null;
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
    this.revision = null;
    this.fetch_status = "pending";

    let token = "";

    try {
      token = await this.$auth.attempt_get_JWT(["blogWriter", "blogAdmin"]);
    } catch {
      this.forbidden = true;
      return;
    }

    api(this.client)
      .blog.revisions._id(Number(this.$route.params.id))
      .$get({ headers: { Authorization: "bearer " + token } })
      .then((data) => {
        this.revision = data;
        this.page_title = data.title;
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
    if (this.revision == null) return null;
    return Markdown.render(this.revision.content);
  }

  get found_revision() {
    return this.revision !== null;
  }

  get status_color() {
    if (this.revision === null) return "";
    switch (this.revision.status) {
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
    return this.revision?.status;
  }

  get article_id() {
    return this.revision?.article_id;
  }

  get author_name() {
    return this.revision?.handle_name || this.revision?.author.name;
  }

  get timestamp() {
    return this.revision === null
      ? null
      : getStringTime(this.revision.timestamp);
  }
}
</script>
