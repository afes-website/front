<template>
  <div id="home">
    <div id="top-image" />
    <div id="first-view">
      <div class="buttons">
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
        <p class="date">2020/5/1(Fri)～5/3(Sun)</p>
        <!-- TODO: logo -->
        <img src="https://placehold.jp/400x100.png" alt="logo" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#home {
  #top-image {
    background-image: url("../assets/top.jpg");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(2px);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -2;

    &::before {
      content: "";
      background-color: rgba(255, 255, 255, 0.65);
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1;
    }
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
    position: unset;
    #top-image {
      display: block;
      background-position: unset;
      background-size: contain;
      filter: none;
      position: unset;
      margin-left: calc(((100vw - 100%) / 2) * -1);
      width: 100vw;
      height: calc(100vw / 3 * 2);

      &::before {
        background-color: rgba(0, 0, 0, 0);
      }
    }
    #first-view {
      height: unset;
      .buttons {
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
