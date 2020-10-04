<template>
  <div class="exhibition-card">
    <img :src="_imageUrl" :alt="_title" class="thumb-img" />
    <span class="exh-name">{{ _title }}</span>
  </div>
</template>

<style lang="scss" scoped>
.exhibition-card {
  width: 200px;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 0 16px rgba(#000, 0.4);
  background: $theme-dark;
  color: #fff;
  overflow: hidden;

  transition: background-color 0.3s, color 0.2s;
  &:hover {
    background: darken($theme-dark, 10%);
    color: #fff;
  }

  .thumb-img {
    width: 100%;
    object-fit: cover;
  }
  .exh-name {
    display: block;
    padding: 6px;
    // 文字装飾
    font-size: 1.1rem;
    font-weight: 500;
    text-align: center;
    // 省略表示
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ExhibitionCard extends Vue {
  @Prop({ required: true, default: "" })
  readonly title?: string;
  get _title() {
    return this.title || "";
  }

  @Prop({ required: true, default: "" })
  readonly imageUrl?: string;
  get _imageUrl() {
    return this.imageUrl || "";
  }
}
</script>
