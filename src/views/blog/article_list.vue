<template>
  <div id="article-list">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <div id="articles">
      <b-link
        :to="{
          name: 'show_article',
          params: {
            category: get_category(article),
            id: get_id(article),
          },
        }"
        class="card-wrap-link"
        v-for="article in shown_articles"
        :key="get_id(article)"
      >
        <b-card :img-src="get_card_image(article)" img-alt="eye catch" img-left>
          <!-- TODO:add image -->
          <b-card-title>
            {{ get_title(article) }}
          </b-card-title>
          <b-card-sub-title>
            <span>
              <font-awesome-icon :icon="'user'" class="fa-fw" />
              {{ get_author_name(article) }}
            </span>
            <span v-if="!isCategorySpecified">
              <font-awesome-icon :icon="'folder'" class="fa-fw" />
              {{ get_category_name(article) }}
            </span>
            <span>
              <font-awesome-icon :icon="'clock'" class="fa-fw" />
              {{ get_updated_at(article) }}
            </span>
            <span>
              <font-awesome-icon :icon="'stopwatch'" class="fa-fw" />
              約 {{ get_time_to_read(article) }} 分
            </span>
          </b-card-sub-title>
          <b-card-text>{{ get_card_text(article) }}</b-card-text>
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
  display: block;
  height: 150px;
  width: 100%;
  margin-bottom: 1rem;
  .card {
    height: 150px;
    width: 100%;
    color: #222;
    .card-img-left {
      max-width: 148px; // 150px(height) - 1px(border) * 2
      min-width: 148px; // tricky solution for image collapsing
      display: block;
      width: auto;
      height: auto;
    }

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
        line-height: 1.5;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 900px) {
  .card-wrap-link .card .card-img-left {
    display: none;
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import { BlogArticle, BlogArticleParameter } from "@afes-website/docs";
import Markdown from "@/libs/markdown";
import { Categories } from "@afes-website/docs";
import getCategories from "@/libs/categories";
import Breadcrumb from "@/components/Breadcrumb.vue";
import FetchStatus from "@/libs/fetch_status";
import { getStringDate } from "@/libs/string_date";

@Component({ components: { Breadcrumb } })
export default class ArticleList extends Vue {
  page_title = "近況 記事一覧";
  articles: BlogArticle[] = [];
  client = aspida();
  categories: Categories = {};
  readonly noImage = require("@/assets/no-image.svg");
  fetch_status: FetchStatus = "idle";

  perPage = 10;

  get currentPage() {
    const query = this.$route.query;
    if ("page" in query) {
      return Number(query.page);
    } else {
      return 1;
    }
  }
  set currentPage(val: number) {
    const query: { [key: string]: string | (string | null)[] } = {};
    Object.assign(query, this.$route.query);
    query["page"] = val.toString();
    this.$router.push({ query });
  }

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
    this.fetch_status = "pending";
    if (this.$route.params.category)
      this.page_title =
        this.categories[this.$route.params.category].name + " 記事一覧";
    else this.page_title = "近況 記事一覧";

    api(this.client)
      .blog.articles.$get({ query: this.filter_query })
      .then((data) => {
        this.articles = data;
        if (!this.$route.params.category) {
          this.articles = this.articles.reduce(
            (v: BlogArticle[], article: BlogArticle) => {
              if (
                !(article.category in this.categories) ||
                this.categories[article.category].visible
              )
                v.push(article);
              return v;
            },
            []
          );
        }
        this.fetch_status = "idle";
      })
      .catch(() => {
        this.fetch_status = "fail";
      });
  }

  get filter_query(): BlogArticleParameter {
    const ret: BlogArticleParameter = {};
    if (this.$route.params.category) ret.category = this.$route.params.category;
    return ret;
  }

  get rows(): number {
    if (this.fetch_status == "pending")
      return Math.max(this.articles.length, this.currentPage);
    return this.articles.length;
  }

  get sorted_articles(): BlogArticle[] {
    let ret_articles = this.articles.concat(); // copy
    ret_articles = ret_articles.sort((a, b) => {
      return a.updated_at < b.updated_at ? 1 : -1; // compare in string
    });
    return ret_articles;
  }

  get shown_articles(): BlogArticle[] {
    return this.sorted_articles.slice(
      (this.currentPage - 1) * this.perPage,
      this.currentPage * this.perPage
    );
  }

  get isCategorySpecified(): boolean {
    return !!this.$route.params.category;
  }

  get_card_text(article: BlogArticle): string {
    return Markdown.render_plaintext(article.content);
  }

  get_card_image(article: BlogArticle) {
    return Markdown.get_first_image(article.content) || this.noImage;
  }

  get_id(article: BlogArticle) {
    return article.id;
  }

  get_category(article: BlogArticle) {
    return article.category;
  }

  get_title(article: BlogArticle) {
    return article.title;
  }

  get_author_name(article: BlogArticle) {
    return article.handle_name || article.author.name;
  }

  get_category_name(article: BlogArticle) {
    return this.categories[article.category].name;
  }

  get_updated_at(article: BlogArticle) {
    return getStringDate(article.updated_at);
  }

  get_time_to_read(article: BlogArticle) {
    return Markdown.time_to_read(article.content);
  }
}
</script>
