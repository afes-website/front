<template>
  <b-button
    class="top-page-button"
    variant="outline-site-theme"
    @click="onClick"
  >
    <font-awesome-icon :icon="iconName" class="button-icon fa-fw" />
    <span class="button-text">
      {{ buttonName }}
    </span>
  </b-button>
</template>

<style lang="scss" scoped>
.top-page-button {
  border-width: 2px;
  border-radius: 0.5rem;
  box-shadow: 0 3px 4px -1px rgba(0, 0, 0, 0.4);

  padding: 0.8rem;
  $margin: 0.25rem;
  margin: $margin;
  height: 5rem;
  width: calc((100vw - #{$margin} * 6) / 2);

  display: flex;
  flex-grow: 1;

  .button-icon {
    font-size: 2.5rem;
  }
  .button-text {
    display: block;
    font-size: 1.5rem;
    flex-grow: 1;
  }
}

@media screen and (max-width: 420px) {
  .top-page-button {
    .button-icon {
      display: none;
    }
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import router from "@/router";

@Component
export default class TopPageButton extends Vue {
  @Prop({ required: true })
  private iconName?: string;
  @Prop({ required: true })
  private buttonName?: string;
  @Prop({ required: true })
  private linkAddress?: string;

  private onClick() {
    router.push({ name: this.linkAddress });
  }
}
</script>
