<template>
  <b-breadcrumb :items="getItems" />
</template>

<style lang="scss" scoped>
ol {
  background: none;
  padding: 0;
  margin-bottom: 0.5rem;

  .breadcrumb-item + .breadcrumb-item::before {
    content: ">";
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Location } from "vue-router";
import { Categories } from "@afes-website/docs";
import getCategories from "@/libs/categories";

interface Item {
  text: string;
  to: Location;
}

@Component
export default class Breadcrumb extends Vue {
  categories: Categories = {};

  @Prop({ required: true })
  readonly text!: string;

  mounted() {
    getCategories().then((data) => {
      this.categories = data;
    });
  }

  get getItems() {
    const items = this.available_items.reduce((arr, cur) => {
      const path = this.$router.resolve(cur.to).resolved.path;
      if (this.$route.path.startsWith(path) && this.$route.path !== path) {
        arr.push(cur);
      }
      return arr;
    }, [] as Item[]);
    items.push({
      // current
      text: this.text,
      to: { path: this.$route.fullPath },
    });
    return items;
  }

  get available_items() {
    let names: Item[] = [
      // static routes
      { text: "Top", to: { name: "Home" } },
      { text: "近況", to: { name: "article_list" } },
      { text: "展示一覧", to: { name: "exhibition_list" } },
      { text: "管理", to: { name: "admin_top" } },
      { text: "記事一覧", to: { name: "path_list" } },
      { text: "記事リクエスト一覧", to: { name: "revision_list" } },
      { text: "展示一覧", to: { name: "admin_exh_list" } },
      { text: "展示リクエスト一覧", to: { name: "admin_draft_list" } },
    ];
    names = names.concat(
      Object.keys(this.categories).map((category_id) => ({
        text: this.categories[category_id].name,
        to: { name: "article_list", params: { category: category_id } },
      }))
    );
    return names.sort(
      // sort by length
      (a, b) =>
        this.$router.resolve(a.to).resolved.path.length -
        this.$router.resolve(b.to).resolved.path.length
    );
  }
}
</script>
