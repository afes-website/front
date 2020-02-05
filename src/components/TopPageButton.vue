<template>
  <div class="top-page-button" @click="onClick">
    <font-awesome-icon :icon="iconName" class="button-icon fa-fw" />
    <span class="button-text">{{ buttonName }}</span>
  </div>
</template>

<style lang="scss" scoped>
.top-page-button {
  background-color: $site-theme;
  width: calc(50vw - 2rem);
  height: 5rem;
  padding: 1rem;
  margin: 0 0.5rem 1rem 0.5rem;
  border-radius: 20px;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
  position: relative;

  .button-icon {
    position: absolute;
    top: 1rem;
    bottom: 0;
    right: 0;
    left: 1rem;
    color: #fff;
    font-size: 2.5rem;
  }
  .button-text {
    color: #fff;
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
  private iconName?: string = "question";
  @Prop()
  private buttonName?: string = "test";
  @Prop()
  private linkAddress?: string = "#";

  private onClick = () => {
    router.push({ name: this.linkAddress });
  };
}
</script>
