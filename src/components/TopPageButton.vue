<template>
  <div class="top-page-button" @click="onClick">
    <font-awesome-icon :icon="iconName" class="button-icon fa-fw" />
    <span class="button-text">{{ buttonName }}</span>
  </div>
</template>

<style lang="scss" scoped>
.top-page-button {
  border: solid 2px $site-theme;
  width: calc((100vw - 1.5rem) / 2);
  height: 5rem;
  padding: 0.8rem;
  margin: 0.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 3px 4px -1px rgba(0, 0, 0, 0.4);
  position: relative;

  .button-icon {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    color: $site-theme;
    font-size: 2.5rem;
  }
  .button-text {
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 1.5rem;
    // vertical-align: center;
    color: $site-theme;
    font-size: 1.5rem;
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import router from "@/router";

@Component
export default class TopPageButton extends Vue {
  @Prop()
  private iconName?: string;
  @Prop()
  private buttonName?: string;
  @Prop()
  private linkAddress?: string;

  private onClick = () => {
    router.push({ name: this.linkAddress });
  };
}
</script>
