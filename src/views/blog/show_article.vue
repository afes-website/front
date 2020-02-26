<template>
  <article class="box">
    <template v-if="article !== null">
      <h1>{{ title }}</h1>
      <p>Category: {{ article.category }}</p>
      <p>author: article.author</p>
      <hr />
      <p>{{ article.content }}</p>
    </template>
    <template v-else>
      <p>{{ fetch_status }}</p>
    </template>
  </article>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import { BlogArticle } from "@/apis/blog/articles/@types";

@Component
export default class ShowArticle extends Vue {
  title = "";
  article: BlogArticle | null = null;
  client = aspida();
  fetch_status: "idle" | "pending" | "fail" = "idle";

  mounted() {
    this.load();
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
        this.title = data.title;
        this.fetch_status = "idle";
      })
      .catch(() => {
        this.fetch_status = "fail";
      });
  }
}
</script>
