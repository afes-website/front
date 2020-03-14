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

interface Item {
  text: string;
  to: Location;
}

@Component
export default class Breadcrumb extends Vue {
  @Prop({ required: true })
  readonly text!: string;

  get getItems() {
    const items = this.names.reduce((arr, cur) => {
      const path = this.$router.resolve(cur.to).resolved.path;
      if (this.$route.path.startsWith(path) && this.$route.path !== path) {
        arr.push(cur);
      }
      return arr;
    }, [] as Item[]);
    items.push({
      // current
      text: this.text,
      to: { name: this.$route.name, params: this.$route.params }
    });
    return items;
  }

  readonly names: Item[] = [
    { text: "Top", to: { name: "Home" } },
    { text: "近況", to: { name: "article_list" } },
    {
      text: "お知らせ",
      to: { name: "article_list", params: { category: "news" } }
    },
    {
      text: "文実全体",
      to: { name: "article_list", params: { category: "general" } }
    },
    {
      text: "分科局",
      to: { name: "article_list", params: { category: "workTeam" } }
    },
    {
      text: "展示団体",
      to: { name: "article_list", params: { category: "exh" } }
    },
    {
      text: "個人･寄稿",
      to: { name: "article_list", params: { category: "contrib" } }
    },
    { text: "管理", to: { name: "admin_top" } },
    { text: "リクエスト一覧", to: { name: "revision_list" } },
    { text: "記事一覧", to: { name: "path_list" } }
  ];
}
</script>
