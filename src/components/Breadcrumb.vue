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

interface Item {
  text: string;
  to: {
    name: string | undefined;
    params?: {};
  };
}

interface Names {
  [key: string]: Item;
}

@Component
export default class Breadcrumb extends Vue {
  @Prop({ required: true })
  readonly text!: string;

  get getItems() {
    const items = [];
    items.push(this.names["top"]);

    const paths = this.$route.path.split("/");

    for (const i in paths) {
      if (paths[i]) {
        if (paths[i] in this.names) {
          items.push(this.names[paths[i]]);
        } else {
          items.push({
            text: this.text,
            to: { name: this.$route.name, params: this.$route.params }
          });
        }
      }
    }

    return items;
  }

  readonly names = {
    top: { text: "Top", to: { name: "Home" } },
    blog: { text: "近況", to: { name: "article_list" } },
    news: {
      text: "お知らせ",
      to: { name: "article_list", params: { category: "news" } }
    },
    general: {
      text: "文実全体",
      to: { name: "article_list", params: { category: "general" } }
    },
    workTeam: {
      text: "分科局",
      to: { name: "article_list", params: { category: "workTeam" } }
    },
    exh: {
      text: "展示団体",
      to: { name: "article_list", params: { category: "exh" } }
    },
    contrib: {
      text: "個人･寄稿",
      to: { name: "article_list", params: { category: "contrib" } }
    },
    admin: { text: "管理", to: { name: "admin_top" } },
    revisions: { text: "リクエスト一覧", to: { name: "revision_list" } },
    paths: { text: "記事一覧", to: { name: "path_list" } }
  } as Names;
}
</script>
