<template>
  <article id="show-article">
    <template v-if="found_article">
      <breadcrumb :text="page_title" />
      <h1>{{ page_title }}</h1>
      <div class="under-title">
        <span>
          <font-awesome-icon :icon="'user'" class="fa-fw" />
          {{ get_author_name(article) }}
        </span>
        <span>
          <font-awesome-icon :icon="'folder'" class="fa-fw" />
          {{ get_category_name(article) }}
        </span>
        <span>
          <font-awesome-icon :icon="'clock'" class="fa-fw" />
          {{ get_updated_at(article) }}
        </span>
        <span>
          <font-awesome-icon :icon="'stopwatch'" class="fa-fw" />
          {{ get_time_to_read(article) }} 分
        </span>
        <b-button-group>
          <b-button
            variant="secondary"
            size="sm"
            v-if="can_edit"
            :to="{ name: 'new_revision', query: { path: article_id } }"
          >
            <font-awesome-icon icon="edit" class="fa-fw" />
            編集
          </b-button>
          <b-button
            variant="secondary"
            size="sm"
            v-if="can_manage"
            :to="{ name: 'manage_path', params: { id: article_id } }"
          >
            <font-awesome-icon icon="wrench" class="fa-fw" />
            管理
          </b-button>
        </b-button-group>
      </div>
      <div class="main-content" v-html="rendered_md" />
      <share-buttons :title="page_title_for_share" />
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
    color: var(--secondary);
    font-weight: 500;

    span {
      margin-right: 0.5em;
    }
  }
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
import { Categories } from "@/apis/blog/categories/@types";
import getCategories from "@/libs/categories";
import Breadcrumb from "@/components/Breadcrumb.vue";
import ShareButtons from "@/components/ShareButtons.vue";
import AdminAuth from "@/libs/auth/admin_auth";
import WriterAuth from "@/libs/auth/writer_auth";
import { getStringTime } from "@/libs/string_date";

@Component({
  components: {
    Breadcrumb,
    ShareButtons,
  },
})
export default class ShowArticle extends Vue {
  page_title = "";
  article: BlogArticle | null = null;
  client = aspida();
  fetch_status: FetchStatus = "idle";
  categories: Categories = {};

  mounted() {
    getCategories()
      .then((data) => {
        this.categories = data;
      })
      .then(() => {
        this.load();
      });
  }
  @Watch("$route")
  route_changed() {
    this.load();
  }

  load() {
    this.article = null;
    this.fetch_status = "pending";
    api(this.client)
      .blog.articles._id(this.$route.params.id)
      .$get()
      .then((data) => {
        this.article = data;
        if (data.category !== this.$route.params.category)
          this.$router.push({
            name: "show_article",
            params: {
              category: data.category,
              id: this.$route.params.id,
            },
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

  get can_edit() {
    const jwt = WriterAuth.getJWT();
    if (jwt === null) return false;
    if (this.article === null) return false;
    return this.article.author.id === jwt.userId;
  }

  get can_manage() {
    return AdminAuth.getJWT() !== null;
  }

  get found_article() {
    return this.article !== null;
  }

  get article_id() {
    if (this.article === null) return null;
    return this.article.id;
  }

  get page_title_for_share() {
    return this.page_title + " - 第73回麻布学園文化祭";
  }

  get_author_name(article: BlogArticle) {
    return article.handle_name || article.author.name;
  }

  get_category_name(article: BlogArticle) {
    return this.categories[article.category].name;
  }

  get_updated_at(article: BlogArticle) {
    return getStringTime(article.updated_at);
  }

  get_time_to_read(article: BlogArticle) {
    return Markdown.time_to_read(article.content);
  }
}
</script>
