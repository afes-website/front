<template>
  <div id="article-list" class="box">
    <h1>{{ page_title }}</h1>
    <div id="articles">
      <b-link
        :to="{
          name: 'show_article',
          params: { category: article.category, id: article.id }
        }"
        class="card-wrap-link"
        v-for="article in shown_articles"
        :key="article.id"
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
              {{ article.author.name }}
            </span>
            <span>
              <font-awesome-icon :icon="'clock'" class="fa-fw" />
              {{ getStringTime(article.created_at) }}
            </span>
          </b-card-sub-title>
          <b-card-text v-html="rendered_md(article.content)" />
        </b-card>
      </b-link>
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
.card-wrap-link {
  height: 150px;
  width: 100%;
  .card {
    height: 150px;
    width: 100%;
    color: #222;

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
      }
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
import Markdown from "@/libs/markdown";
import { getCategory } from "@/libs/categories";
import Token from "markdown-it/lib/token";

@Component
export default class ArticleList extends Vue {
  page_title = "ブログ 記事一覧";
  articles: BlogArticle[] = [];
  client = aspida();

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
      this.page_title = getCategory(this.$route.params.category) + " 記事一覧";
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

  rendered_md(md: string): string {
    const tokens = Markdown.parse(md, {});
    const tokens2txt = (tokens: Token[]) => {
      return tokens
        .map((token: Token): string => {
          if (token.block) {
            if (token.children !== null)
              // children may be null despite the type definition
              return tokens2txt(token.children) + "<br>";
            else return "";
          }
          return token.content;
        })
        .join("");
    };
    return tokens2txt(tokens);
  }
}
</script>
