<template>
  <div id="contact" class="box">
    <h1>{{ page_title }}</h1>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Contact extends Vue {
  readonly page_title = "お問い合わせ";
}
</script>
