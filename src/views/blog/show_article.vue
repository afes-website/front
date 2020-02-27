<template>
  <article class="box">
    <template v-if="article !== null">
      <h1>{{ title }}</h1>
      <div class="under-title">
        <span>
          <font-awesome-icon :icon="'user'" class="fa-fw" />
          {{ "author" }}
        </span>
        <span>
          <font-awesome-icon :icon="'folder'" class="fa-fw" />
          {{ article.category }}
        </span>
        <span>
          <font-awesome-icon :icon="'clock'" class="fa-fw" />
          {{ getStringTime(article.created_at) }}
        </span>
      </div>
      <p>{{ article.content }}</p>
    </template>
    <template v-else>
      <p>{{ fetch_status }}</p>
    </template>
  </article>
</template>

<style lang="scss" scoped>
article {
  .under-title {
    margin-top: -16px;
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

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import api from "@/apis/$api";
import aspida from "@aspida/axios";
import { BlogArticle } from "@/apis/blog/articles/@types";
import is_axios_error from "@/libs/is_axios_error";

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

  getStringTime(laravel_time: string): string {
    const date = new Date(Date.parse(laravel_time));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
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
        this.title = data.title;
        this.fetch_status = "idle";
      })
      .catch((e: unknown) => {
        if (is_axios_error(e)) {
          //if (e.response && e.response.status == 404) console.log("404");
        }
        this.fetch_status = "fail";
      });
  }
}
</script>
