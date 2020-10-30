<template>
  <div class="exhibition-card">
    <b-skeleton-img aspect="1:1" />
    <img :src="imageUrl" :alt="title" class="thumb-img" height="1" width="1" />
    <span class="room-id" v-if="roomId">{{ roomId }}</span>
    <span class="exh-name">{{ title }}</span>
    <div class="disabled" v-if="isDisabled">
      <span class="preparing">準備中です…</span>
    </div>
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
    .exh-name {
      background: darken($theme-dark, 10%);
      color: #fff;
    }
  }

  .thumb-img {
    width: 100%;
    height: auto;
    object-fit: cover;
    position: absolute;
    top: 0;
    z-index: 1;
  }

  .room-id {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    background-color: rgba(darken($theme-dark, 30%), 0.5);
    color: #fff;
    z-index: 2;
    padding: 1px 5px;
    border-radius: 0 0 4px 0;
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

  .disabled {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(darken($theme-dark, 20%), 0.5);
    z-index: 5;
    cursor: not-allowed;

    .preparing {
      position: absolute;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      font-weight: 700;
      color: #eee;
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

  @Prop({ required: false })
  readonly roomId?: string | null;

  @Prop({ required: false, default: false, type: Boolean })
  readonly isDisabled?: boolean;
}
</script>
