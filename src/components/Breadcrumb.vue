<template>
  <b-breadcrumb :items="items" />
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

interface Item {
  text: string;
  href: string;
}

interface Titles {
  [key: string]: string;
}

@Component
export default class Breadcrumb extends Vue {
  private items: Item[] = [];

  @Prop({ required: true })
  readonly text!: string;

  private prepareItems() {
    this.items = [];
    this.items.push({ text: "Top", href: "/" });

    const paths = this.$route.path.split("/");
    let path = "";

    for (const i in paths) {
      if (paths[i]) {
        let text = "";
        text = this.titles[paths[i]] || this.text;
        path += "/" + paths[i];
        this.items.push({ text: text, href: path });
      }
    }
  }

  mounted() {
    this.prepareItems();
  }
  @Watch("$route")
  route_changed() {
    this.prepareItems();
  }

  readonly titles = {
    blog: "近況",
    news: "お知らせ",
    general: "文実全体",
    workTeam: "分科局",
    exh: "展示団体",
    contrib: "個人･寄稿",
    admin: "管理",
    revisions: "リクエスト一覧",
    paths: "記事一覧"
  } as Titles;
}
</script>
