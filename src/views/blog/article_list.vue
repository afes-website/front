<template>
  <article>
    <h1>{{ title }}</h1>
    <div id="articles">
      <div v-for="article in shown_articles" :key="article.id">
        <!-- <img src="https://placehold.jp/256x256.png" /> -->
        <!-- TODO:add image -->
        <h4>
          <b-link>{{ article.title }}</b-link>
        </h4>
        <p>
          {{ article.content }}
        </p>
      </div>
    </div>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
    ></b-pagination>
  </article>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import { BlogArticle, BlogArticleParameter } from "@/apis/blog/articles/@types";

@Component
export default class ArticleList extends Vue {
  title = "ブログ 記事一覧";
  articles: BlogArticle[] = [];
  client = aspida();

  perPage = 10;
  currentPage = 1;
  mounted() {
    api(this.client)
      .blog.articles.$get({ query: this.filter_query })
      .then(data => {
        this.articles = data;
      });
  }

  get filter_query(): BlogArticleParameter {
    return {};
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
