<template>
  <div id="home">
    <img id="top-image" src="../assets/back.jpg" alt="中庭" />
    <div id="first-view">
      <div id="buttons">
        <top-page-button
          icon-name="map-marker-alt"
          button-name="アクセス"
          link-address="access"
        />
        <top-page-button
          icon-name="list"
          button-name="展示一覧"
          link-address="exhibition"
          disabled
        />
        <top-page-button
          icon-name="user-tie"
          button-name="ご挨拶"
          link-address="about"
        />
        <top-page-button
          icon-name="book"
          button-name="ブログ"
          link-address="blog"
        />
      </div>
      <h1>第73回 麻布中学校・高等学校 文化祭</h1>
      <p>第73回麻布学園文化祭公式ウェブサイトです。</p>
      <p>当日の展示に関する情報や、日々の活動の様子などを発信しています。</p>
      <div id="lower-right">
        <span id="date">2020/5/1(金)～5/3(日)</span>
        <!-- TODO: logo -->
        <img src="https://placehold.jp/450x125.png" alt="logo" />
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
    width: calc(100vw - 32rem);
    min-width: min(calc(900px - 3rem), 100vw - 20rem);
    padding: 0;
    position: relative;

    h1 {
      margin-bottom: 1.5rem;
      font-weight: 700;
      border: none;
      text-shadow: 0 0.125rem 0.25rem rgba(#000, 0.1);
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      text-shadow: 0 0.125rem 0.25rem rgba(#000, 0.1);
    }

    #buttons {
      display: none;
    }

    #lower-right {
      position: absolute;
      bottom: 4rem;
      right: 0;
      display: flex;
      flex-direction: column;

      #date {
        text-align: right;
        font-weight: 700;
        font-size: 2.6rem;
        margin-bottom: 0.5rem;
        text-shadow: 0 0.125rem 0.25rem rgba(#000, 0.1);
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
      margin-left: calc(((100vw - 100%) / 2) * -1);
      margin-top: -0.8rem;
      width: 100vw;
      height: calc(100vw / 3 * 2);
    }
    #first-view {
      height: unset;
      width: unset;
      #buttons {
        display: flex;
        flex-wrap: wrap;
        $margin: 0.25rem;
        margin: $margin;
        margin-left: -1rem + $margin;
        width: calc(100vw - #{$margin} * 2);
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
