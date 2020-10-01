<template>
  <div v-if="isForbidden" class="forbidden">
    <h1 class="forbidden-title">{{ page_title }}</h1>
    <section>
      <div class="hand-paper">
        <font-awesome-icon icon="hand-paper" />
      </div>
      <p>YOU DO NOT HAVE PERMISSION TO ACCESS THIS PAGE.</p>
      <p>
        現在ログインしているアカウントではこのページを閲覧できません。
        ログインしているアカウントを確認してください。
      </p>
      <p>
        不明な点がありましたら
        <b-link :to="{ name: 'contact' }">お問い合わせ</b-link>
        または
        <b-link href="mailto:contact@afes.info">
          <font-awesome-icon icon="envelope" class="fa-fw" />contact@afes.info
        </b-link>
        までお問い合わせください。
      </p>
    </section>
  </div>
  <div v-else>
    <slot />
  </div>
</template>

<style lang="scss">
.forbidden {
  text-align: center;
  .hand-paper {
    $size: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: $size;
    height: $size;
    background: $theme-dark;
    border-radius: $size / 2;
    margin: 0 auto;
    margin-bottom: 16px;
    svg {
      font-size: $size * 0.7;
      color: #fff;
      margin-right: $size * 0.05;
    }
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Forbidden extends Vue {
  readonly forbidden_title = "403 Forbidden";

  @Prop({ required: true, default: false })
  isForbidden = false;

  @Prop({ required: true, default: "" })
  title?: string;

  get page_title(): string {
    return this.isForbidden ? this.forbidden_title : this.title || "";
  }
}
</script>
