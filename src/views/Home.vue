<template>
  <div id="home">
    <img id="top-image" src="@/assets/top.jpg" alt="中庭" />
    <div id="first-view">
      <div class="buttons">
        <top-page-button
          :icon-name="'map-marker-alt'"
          :button-name="'アクセス'"
          :link-address="'access'"
        />
        <top-page-button
          :icon-name="'list'"
          :button-name="'展示一覧'"
          :link-address="'exhibition'"
        />
        <top-page-button
          :icon-name="['far', 'map']"
          :button-name="'校内地図'"
          :link-address="'map'"
        />
        <top-page-button
          :icon-name="['far', 'clock']"
          :button-name="'ステージ'"
          :link-address="'timetable'"
        />
      </div>
      <h1>第73回 麻布中学校・高等学校 文化祭</h1>
      <p>第73回麻布学園文化祭公式ウェブサイトです。</p>
      <p>当日の展示に関する情報や、日々の活動の様子などを発信しています。</p>
      <div id="lower-right">
        <p class="date">2020/5/1(Fri)～5/3(Sun)</p>
        <img src="https://placehold.jp/400x100.png" alt="logo" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#home {
  #top-image {
    display: none;
  }
  #first-view {
    height: calc(100vh - 2rem);
    padding: 0;
    padding-bottom: 2rem;

    h1 {
      font-size: 2rem;
      font-weight: 400;
      margin-bottom: 1.5rem;
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .buttons {
      display: none;
    }
    #lower-right {
      position: absolute;
      bottom: 4rem;
      right: 4rem;
      .date {
        text-align: right;
        font-size: 2.3rem;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 900px) {
  #home {
    #top-image {
      display: block;
      position: relative;
      left: -1rem;
      width: 100vw;
    }
    #first-view {
      height: unset;
      .buttons {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        left: -1rem;
        width: calc(100vw - 0.5rem);
        margin: 0.25rem;
      }

      h1,
      #lower-right {
        display: none;
      }
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TopPageButton from "@/components/TopPageButton.vue";

@Component({
  components: {
    TopPageButton
  }
})
export default class Home extends Vue {}
</script>
