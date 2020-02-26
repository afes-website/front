<template>
  <div id="about" class="box">
    <h1>{{ title }}</h1>
    <p>文化祭実行委員会や各展示からの投稿を集めたブログです。</p>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class CategoryList extends Vue {
  title = "ブログ";
}
</script>
