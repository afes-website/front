<template>
  <article>
    <h1>{{ title }}</h1>
    <div id="articles">
      <div v-for="article in articles" :key="article.id">
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
}
</script>
