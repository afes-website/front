<template>
  <article id="show-article" class="box">
    <template v-if="article !== null">
      <breadcrumb :text="page_title" />
      <h1>{{ page_title }}</h1>
      <div class="under-title">
        <span>
          <font-awesome-icon :icon="'user'" class="fa-fw" />
          {{ article.author.name }}
        </span>
        <span>
          <font-awesome-icon :icon="'folder'" class="fa-fw" />
          {{ getCategory(article.category) }}
        </span>
        <span>
          <font-awesome-icon :icon="'clock'" class="fa-fw" />
          {{ getStringTime(article.updated_at) }}
        </span>
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

    span {
      margin-right: 0.5em;
    }
  }
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

<style lang="scss">
article#show-article {
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import { BlogArticle } from "@/apis/blog/articles/@types";
import is_axios_error from "@/libs/is_axios_error";
import FetchStatus from "@/libs/fetch_status";
import Markdown from "@/libs/markdown";
import { getCategory } from "@/libs/categories";
import Breadcrumb from "@/components/Breadcrumb.vue";

@Component({
  components: {
    Breadcrumb
  }
})
export default class ShowArticle extends Vue {
  page_title = "";
  article: BlogArticle | null = null;
  client = aspida();
  fetch_status: FetchStatus = "idle";
  readonly getCategory = getCategory;

  mounted() {
    this.load();
  }
  @Watch("$route")
  route_changed() {
    this.load();
  }

  getStringTime(laravel_time: string): string {
    const date = new Date(Date.parse(laravel_time));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const min =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return year + "/" + month + "/" + day + " " + hour + ":" + min;
  }

  load() {
    this.article = null;
    this.fetch_status = "pending";
    api(this.client)
      .blog.articles._id(this.$route.params.id)
      .$get()
      .then(data => {
        this.article = data;
        if (data.category !== this.$route.params.category)
          this.$router.push({
            name: "show_article",
            params: {
              category: data.category,
              id: this.$route.params.id
            }
          });
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
    if (this.article == null) return null;
    return Markdown.render(this.article.content);
  }
}
</script>
