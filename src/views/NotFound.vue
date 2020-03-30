<template>
  <div>
    <h1>{{ page_title }}</h1>
    <section>
      <img src="@/assets/404.svg" alt="404" />
      <p class="404-large">
        お探しのページ <code>{{ $route.path }}</code> は見つかりませんでした。
      </p>
      <p v-if="$route.path.substr(0, 5) === '/blog'">
        URLが間違っているか、記事が削除されている可能性があります。URLを再度お確かめください。
      </p>
      <p v-else>
        URLが間違っている可能性があります。URLを再度お確かめください。
      </p>
      <p>
        リンク切れ報告や、その他不明な点がございましたら
        <b-link :to="{ name: 'contact' }">お問い合わせ</b-link>
        または
        <b-link href="mailto:contact@afes.info">
          <font-awesome-icon icon="envelope" class="fa-fw" />contact@afes.info
        </b-link>
        までお問い合わせください。
      </p>
    </section>
  </div>
</template>

<style lang="scss" scoped>
img {
  display: block;
  width: 60%;
  margin: 0 auto 1rem auto;
}

@media screen and (max-width: 900px) {
  img {
    width: 100%;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class NotFound extends Vue {
  readonly page_title = "404 Not Found";
}
</script>
