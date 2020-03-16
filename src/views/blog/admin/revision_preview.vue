<template>
  <article id="show-revision" class="box">
    <template v-if="revision !== null">
      <breadcrumb :text="page_title" />
      <b-alert show variant="info">
        この投稿はプレビューです。<br />
        <b-badge
          :variant="
            revision.status === 'accepted'
              ? 'success'
              : revision.status === 'waiting'
              ? 'secondary'
              : 'danger'
          "
        >
          {{ revision.status }}
        </b-badge>
        <span>
          <font-awesome-icon icon="file" class="fa-fw" />
          {{ revision.article_id }}
        </span>
      </b-alert>
      <h1>{{ page_title }}</h1>
      <div class="under-title">
        <p>
          <span>
            <font-awesome-icon :icon="'user'" class="fa-fw" />
            {{ revision.user_id }}
          </span>
          <span>
            <font-awesome-icon :icon="'clock'" class="fa-fw" />
            {{ getStringTime(revision.timestamp) }}
          </span>
        </p>
      </div>
      <div class="main-content" v-html="rendered_md" />
    </template>
    <template v-else>
      <p>{{ fetch_status }}</p>
    </template>
  </article>
</template>

<style lang="scss" scoped>
article {
  .under-title {
    margin-top: -14px;
    margin-bottom: 16px;
    text-align: right;
    color: #6c757d;
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

<style lang="scss">
article#show-article {
  .main-content {
    @import "~bootstrap";
    h2 {
      margin: 2rem 0 1rem 0;
    }

    img {
      width: 100%;
    }

    .alert-success,
    .alert-info,
    .alert-warning,
    .alert-danger {
      @extend .alert;
      p {
        margin: 0;
      }
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import { BlogRevision } from "@/apis/blog/revisions/@types";
import is_axios_error from "@/libs/is_axios_error";
import FetchStatus from "@/libs/fetch_status";
import Markdown from "@/libs/markdown";
import AdminAuth from "@/libs/auth/admin_auth";
import WriterAuth from "@/libs/auth/writer_auth";
import { AdminAuthToken, WriterAuthToken } from "../../../apis/@types";
import Breadcrumb from "@/components/Breadcrumb.vue";

@Component({
  components: {
    Breadcrumb
  }
})
export default class ShowRevision extends Vue {
  page_title = "";
  revision: BlogRevision | null = null;
  client = aspida();
  fetch_status: FetchStatus = "idle";

  mounted() {
    this.load();
  }
  @Watch("$route")
  route_changed() {
    this.load();
  }

  load() {
    this.revision = null;
    this.fetch_status = "pending";
    new Promise<AdminAuthToken | WriterAuthToken>((s, r) => {
      const admin_token = AdminAuth.getJWT();
      if (admin_token !== null) s({ "X-ADMIN-TOKEN": admin_token.content });
      const writer_token = WriterAuth.getJWT();
      if (writer_token !== null)
        s({ "X-BLOG-WRITER-TOKEN": writer_token.content });
      r("not logged in");
    })
      .then(header => {
        return api(this.client)
          .blog.revisions._id(Number(this.$route.params.id))
          .$get({ headers: header });
      })
      .then(data => {
        this.revision = data;
        this.page_title = data.title;
        this.fetch_status = "idle";
      })
      .catch((e: unknown) => {
        if (is_axios_error(e)) {
          if (e.response && e.response.status == 404) this.$emit("not_found");
        }
        this.fetch_status = "fail";
      });
  }

  get rendered_md(): string | null {
    if (this.revision == null) return null;
    return Markdown.render(this.revision.content);
  }

  getStringTime(laravel_time: string): string {
    if (!laravel_time) return "";
    const date = new Date(Date.parse(laravel_time));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const min =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return year + "/" + month + "/" + day + " " + hour + ":" + min;
  }
}
</script>
