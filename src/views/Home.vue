<template>
  <div class="home"></div>
</template>

<style lang="scss" scoped>
.home {
  padding: 0 1rem;
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 900px) {
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {}
</script>
