<template>
  <article id="about" class="box">
    <h1>{{ title }}</h1>
    <div id="pair_picture">
      <img src="https://placehold.jp/1800x1200.png" />
    </div>
    <section>
      <h2 class="author_name">平秀明</h2>
      <small>麻布中学校高等学校委校長</small>
      <p>これは本文です。</p>
      <p>これは本文です。</p>
    </section>
    <section>
      <h2 class="author_name">伊藤碧透</h2>
      <small>第73回麻布学園文化祭実行委員会委員長</small>
      <p>これは本文です。</p>
      <p>これは本文です。</p>
    </section>
  </article>
</template>

<style lang="scss" scoped>
#about {
  #pair_picture {
    text-align: center;

    img {
      width: 60%;
    }
  }

  small {
    font-size: 1em;
    font-weight: 500;
    position: relative;
    top: -0.5rem;
    border-bottom: solid 1px $site-theme;
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 900px) {
  #about #pair_picture img {
    width: 100vw;
    margin-left: calc(((100vw - 100%) / 2) * -1);
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class About extends Vue {
  readonly title: string = "学校長・委員長挨拶";
}
</script>
