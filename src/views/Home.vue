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
          link-address="article_list"
        />
      </div>
      <h1>第73回 麻布中学校・高等学校 文化祭</h1>
      <p>第73回麻布学園文化祭公式ウェブサイトです。</p>
      <p>当日の展示に関する情報や、日々の活動の様子などを発信しています。</p>
      <b-alert
        show
        variant="danger"
        class="top-page-alert mt-3"
        style="line-height: 1.8;"
      >
        新型コロナウイルス感染症の流行を考慮し、開催を<b>2020年6月12-14日に延期</b>いたします。<br />
        なお、状況によりさらなる変更の可能性があります。予めご了承ください。
        <b-link to="/blog/news/covid-19-reschedule" class="alert-link">
          詳細はこちら
        </b-link>
      </b-alert>
      <div id="lower-right">
        <img src="../assets/logo.svg" alt="logo" />
        <p class="covid-19-warning">
          ＊ 新型コロナウイルスの流行に伴い、日程が変更となる場合があります。
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#home {
  padding: 1.5rem 0 0.5rem 0;
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

    .top-page-alert {
      width: fit-content;
    }

    #lower-right {
      position: absolute;
      bottom: 4rem;
      right: 0;
      display: flex;
      flex-direction: column;

      img {
        width: 640px;
      }
      .covid-19-warning {
        text-align: center;
        line-height: 1.1;
        font-size: 1.1rem;
        margin: -0.8rem 0 0 0;
        font-weight: 700;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 900px) {
  #home {
    padding: 0;
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
    TopPageButton,
  },
})
export default class Home extends Vue {
  readonly page_title = "";
}
</script>
