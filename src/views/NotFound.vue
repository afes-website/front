<template>
  <div class="box">
    <h1>{{ page_title }}</h1>
    <section>
      <p>404 Not Found<!-- TODO: consider message --></p>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class NotFound extends Vue {
  readonly page_title = "404 Not Found"; // TODO: consider title
}
</script>
