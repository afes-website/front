<template>
  <div class="exhibition-card">
    <b-skeleton-img aspect="1:1" />
    <img :src="imageUrl" :alt="title" class="thumb-img" height="1" width="1" />
    <span class="exh-name">{{ title }}</span>
  </div>
</template>

<style lang="scss" scoped>
.exhibition-card {
  width: 200px;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 0 16px rgba(#000, 0.4);
  background: #fff;
  color: #fff;
  overflow: hidden;
  position: relative;

  transition: background-color 0.3s, color 0.2s;
  &:hover {
    background: darken($theme-dark, 10%);
    color: #fff;
  }

  .thumb-img {
    width: 100%;
    height: auto;
    object-fit: cover;
    position: absolute;
    top: 0;
    z-index: 1;
  }
  .exh-name {
    display: block;
    padding: 6px;
    // 文字装飾
    font-size: 1.1rem;
    font-weight: 500;
    text-align: center;
    background: $theme-dark;
    // 省略表示
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media screen and (max-width: 900px) {
      font-size: 0.9rem;
    }
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ExhibitionCard extends Vue {
  @Prop({ required: true })
  readonly title!: string;

  @Prop({ required: true })
  readonly imageUrl!: string;
}
</script>
