<template>
  <div id="article-list" class="box">
    <h1>{{ title }}</h1>
    <div id="articles">
      <div v-for="article in shown_articles" :key="article.id">
        <b-link
          :to="{
            name: 'show_article',
            params: { category: article.category, id: article.id }
          }"
        >
          <b-card
            img-src="https://placehold.jp/30/cccccc/888888/150x150.jpg?text=no%20image"
            img-alt="eye catch"
            img-left
            class="mb-3"
          >
            <!-- TODO:add image -->
            <b-card-title>
              {{ article.title }}
            </b-card-title>
            <b-card-sub-title>
              <span>
                <font-awesome-icon :icon="'user'" class="fa-fw" />
                {{ "author" }}
              </span>
              <span>
                <font-awesome-icon :icon="'clock'" class="fa-fw" />
                {{ getStringTime(article.created_at) }}
              </span>
            </b-card-sub-title>
            <b-card-text v-html="md.render(article.content)" />
          </b-card>
        </b-link>
      </div>
    </div>

    <b-pagination
      id="article-page-nav"
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
      align="center"
    ></b-pagination>
  </div>
</template>

<style lang="scss" scoped>
.card-body {
  height: 150px;
  width: 100%;
  color: #222;
  .card-title {
    margin-top: -8px;
    margin-bottom: 12px;
  }
  .card-subtitle {
    margin-bottom: 5px;
    span {
      margin-right: 0.5em;
    }
  }
  .card-text {
    display: block;
    height: 4.5em;
    position: relative;
    overflow: hidden;
    &::before,
    &::after {
      position: absolute;
      background: #fff;
    }
    &::before {
      content: "…";
      bottom: 0;
      right: 0;
    }
    &::after {
      content: "";
      width: 100%;
      height: 100%;
    }
  }
}
</style>

<style lang="scss">
#article-list {
  #articles {
    .card-text {
      * {
        line-height: 1.5;
        margin: 0;
        padding: 0;
        font-size: 1em;
        height: auto;
        text-decoration: none;
        border: none;
      }
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import { BlogArticle, BlogArticleParameter } from "@/apis/blog/articles/@types";

@Component
export default class ArticleList extends Vue {
  title = "ブログ 記事一覧";
  articles: BlogArticle[] = [];
  client = aspida();
  /* eslint-disable @typescript-eslint/no-var-requires */
  md = require("markdown-it")({ linkify: true })
    .use(require("markdown-it-sanitizer"))
    .use(require("markdown-it-imsize"))
    .use(require("markdown-it-checkbox"))
    .use(require("markdown-it-mark"))
    .use(require("markdown-it-emoji"))
    .use(require("markdown-it-ins"))
    .use(require("markdown-it-container"), "alert-success")
    .use(require("markdown-it-container"), "alert-info")
    .use(require("markdown-it-container"), "alert-warning")
    .use(require("markdown-it-container"), "alert-danger")
    .use(require("markdown-it-sub"))
    .use(require("markdown-it-cjk-breaks"));
  /* eslint-enable */

  perPage = 10;
  currentPage = 1;
  mounted() {
    this.load();
  }
  @Watch("$route")
  route_changed() {
    this.load();
  }
  load() {
    if (this.$route.params.category)
      this.title = this.$route.params.category + " 記事一覧";
    api(this.client)
      .blog.articles.$get({ query: this.filter_query })
      .then(data => {
        this.articles = data;
      });
  }

  getStringTime(laravel_time: string): string {
    const date = new Date(Date.parse(laravel_time));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return year + "/" + month + "/" + day;
  }

  get filter_query(): BlogArticleParameter {
    const ret: BlogArticleParameter = {};
    if (this.$route.params.category) ret.category = this.$route.params.category;
    return ret;
  }

  get rows(): number {
    return this.articles.length;
  }

  get shown_articles(): BlogArticle[] {
    return this.articles.slice(
      (this.currentPage - 1) * this.perPage,
      this.currentPage * this.perPage
    );
  }
}
</script>
