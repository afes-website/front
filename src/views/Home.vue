<template>
  <div id="home">
    <div id="pc">
      <div id="first-view">
        <div></div>
        <div id="center-box">
          <img id="logo" src="../assets/logo_white.svg" alt="logo" />
        </div>
        <b-link
          v-scroll-to="{
            el: '#main-content',
            duration: 1000,
            easing: 'ease-out',
          }"
        >
          <font-awesome-icon id="down-angle" icon="chevron-down" size="3x" />
        </b-link>
      </div>
    </div>
    <div id="smartphone">
      <div id="top-img-wrapper">
        <img id="top-img" src="../assets/back.jpg" alt="img" />
        <img id="top-logo" src="../assets/logo_white.svg" alt="logo" />
        <div id="top-img-button" @click="linkToExhibitionList">
          <span class="button-text">オンライン展示一覧</span>
          <font-awesome-icon icon="angle-right" class="button-icon" />
        </div>
      </div>
    </div>
    <div id="main-box">
      <div id="main-content">
        <h1>第73回 麻布中学校･高等学校 文化祭</h1>
        <p>第73回 麻布学園文化祭 公式ウェブサイトです。</p>
        <p>
          オンラインでの文化祭企画を2020年11月15日まで公開中です。<br />
          <b-link :to="{ name: 'exhibition_list' }">
            オンライン公開中の展示一覧はこちら
          </b-link>
        </p>
        <p>
          また、第73回麻布学園文化祭は、2020年10月31日と11月1日の2日間の日程を終え、終了しました。<br />
          <b-link to="/blog/news/schedule-declaration">
            日程について詳細はこちら
          </b-link>
        </p>
        <hr />
        <p>
          このウェブサイトは生徒自治団体である文化祭実行委員会が製作したものであり、教職員は関係していません。
          なにかございましたら
          <b-link :to="{ name: 'contact' }">お問い合わせフォーム</b-link>
          よりお問い合わせください。
        </p>
        <h2>更新情報</h2>
        <b-table-simple small hover>
          <b-tbody>
            <b-tr
              v-for="article in shown_articles"
              :key="get_article_id(article)"
              @click="linkToArticle(article)"
            >
              <b-td class="mobile-none">
                <font-awesome-icon :icon="'clock'" class="fa-fw" />
                {{ formatUpdatedDate(article) }}
              </b-td>
              <b-td class="table-nowrap">
                <font-awesome-icon :icon="'folder'" class="fa-fw" />
                {{ getCategoryName(article) }}
              </b-td>
              <b-td class="mobile-none">
                <font-awesome-icon :icon="'user'" class="fa-fw" />
                {{ getAuthorName(article) }}
              </b-td>
              <b-td>
                {{ getArticleTitle(article) }}
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
        <font-awesome-icon icon="angle-right" class="fa-fw" />
        <b-link :to="{ name: 'article_list' }">近況 記事一覧</b-link>
      </div>
    </div>
    <div id="footer">
      <nav>
        <ul>
          <li>
            <b-link :to="{ name: 'contact' }">お問い合わせ</b-link>
          </li>
          <li>
            <b-link :to="{ name: 'policy' }">プライバシーポリシー</b-link>
          </li>
        </ul>
      </nav>
      <small>&copy; 第73回麻布学園文化祭実行委員会 2020</small>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media screen and (min-width: 900.1px) {
  #home {
    #pc {
      width: 100%;

      #first-view {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        height: 100vh;

        #center-box {
          display: flex;
          flex-direction: column;
          align-items: center;

          width: max-content;
          padding: 0.5rem;

          background: rgba($theme-dark, 0.8);

          #logo {
            width: 600px;
            margin-top: 10px;
          }

          #date-warning {
            font-weight: 400;
            font-size: 0.9rem;
            margin: 0 1.5rem;
            color: #fff;
          }
        }

        #down-angle {
          margin-bottom: 1rem;
          color: $theme-dark;
          filter: drop-shadow(2px 2px 1px #fff) drop-shadow(-2px 2px 1px #fff)
            drop-shadow(2px -2px 1px #fff) drop-shadow(-2px -2px 1px #fff);
        }
      }
    }

    #smartphone {
      display: none;
    }

    #main-box {
      width: 100%;
      display: flex;
      justify-content: center;
      position: relative;

      &::after {
        position: absolute;
        content: "";
        left: 0;
        width: calc(100% + 304px);
        background: rgba($theme-dark, 0.8);
        height: 100%;
        z-index: -1;
        transform: translateX(-304px);
      }

      #main-content {
        padding: 2rem 1.5rem 1rem 1.5rem;
        max-width: 1000px;
        z-index: 0;

        * {
          color: #fff;
        }
        h1,
        h2,
        hr {
          border-color: lighten($theme-dark, 20%);
        }
        a {
          color: #fff;
          text-decoration: underline;
        }
        tr {
          cursor: pointer;
        }
      }
    }
    #footer {
      text-align: center;
      padding: 0.5rem 0 1rem 0;
      position: relative;

      &::after {
        position: absolute;
        content: "";
        left: 0;
        top: 0;
        width: calc(100% + 304px);
        background: rgba($theme-dark, 0.8);
        height: 100%;
        z-index: -1;
        transform: translateX(-304px);
      }

      * {
        color: #fff;
      }
      a {
        color: #fff;
        text-decoration: underline;
      }
      & > nav > ul {
        margin: 0.25rem 0;
        padding: 0;
        li {
          list-style-type: none;
          display: inline;

          &:not(:last-of-type)::after {
            content: " ･ ";
          }
        }
      }
      small {
        font-size: 1rem;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 900px) {
  #home {
    #pc {
      display: none;
    }

    #smartphone {
      display: block;
      font-size: 1.1rem;
      margin-bottom: 16px;

      #top-img-wrapper {
        position: relative;
        width: 100vw;
        height: 100vw / 4 * 3;
        margin-left: calc((100vw - 100%) / 2 * -1);
        margin-top: -12.8px;
        background: darken($theme-dark, 10%);

        #top-img {
          height: 100%;
          object-fit: cover;
          position: relative;
          opacity: 75%;
          filter: blur(1px);
        }

        #top-logo {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
        }

        #top-img-button {
          position: absolute;
          top: 85%;
          left: 50%;
          transform: translate(-50%, -50%);
          margin: 0;
          $height: 40px;
          height: $height;
          border-radius: $height / 2;
          line-height: $height;
          padding: 0 $height * 0.4;
          font-size: $height * 0.4;
          border: 1px solid #fff;
          color: #fff;
          transition: background-color 1s;
          white-space: nowrap;

          &:hover {
            background: rgba(#fff, 0.6);
          }

          .button-text {
            font-weight: 500;
          }
          .button-icon {
            margin-left: 16px;
          }
        }
      }
    }

    #main-box {
      #main-content {
        width: 100%;
        padding-bottom: 1rem;

        table {
          .table-nowrap {
            white-space: nowrap;
          }
          .mobile-none {
            display: none;
          }
        }
      }
    }
    #footer {
      text-align: center;
      border-top: 1px solid $theme-dark;
      padding: 0.5rem 0 1rem 0;
      width: 100vw;
      margin-left: calc((100vw - 100%) / 2 * -1);
      margin-bottom: -2rem;

      & > nav > ul {
        margin: 0.25rem 0;
        padding: 0;
        li {
          list-style-type: none;
          display: inline;

          &:not(:last-of-type)::after {
            content: " ･ ";
          }
        }
      }
      small {
        font-size: 1rem;
      }
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import { BlogArticle } from "@afes-website/docs";
import { Categories } from "@afes-website/docs";
import getCategories from "@/libs/categories";
import { getStringDate } from "@/libs/string_date";

import VueScrollTo from "vue-scrollto";
Vue.use(VueScrollTo, {
  container: "#main-wrapper",
});

@Component
export default class Home extends Vue {
  readonly page_title = "";
  articles: BlogArticle[] = [];
  client = aspida();
  categories: Categories = {};

  mounted() {
    getCategories()
      .then((data) => {
        this.categories = data;
      })
      .then(() => {
        this.load();
      });
  }
  load() {
    api(this.client)
      .blog.articles.$get()
      .then((data) => {
        this.articles = data;
        if (!this.$route.params.category) {
          this.articles = this.articles.reduce(
            (v: BlogArticle[], article: BlogArticle) => {
              if (
                !(article.category in this.categories) ||
                this.categories[article.category].visible
              )
                v.push(article);
              return v;
            },
            []
          );
        }
      });
  }

  get shown_articles(): BlogArticle[] {
    let ret_articles = this.articles.concat(); // copy
    ret_articles = ret_articles.sort((a, b) => {
      return a.updated_at < b.updated_at ? 1 : -1; // compare in string
    });
    return ret_articles.slice(0, 10);
  }

  readonly linkToExhibitionList = () => {
    this.$router.push({ name: "exhibition_list" });
  };

  linkToArticle(article: BlogArticle) {
    this.$router.push({
      name: "show_article",
      params: { category: article.category, id: article.id },
    });
  }

  get_article_id(article: BlogArticle) {
    return article.id;
  }

  formatUpdatedDate(article: BlogArticle) {
    return getStringDate(article.updated_at);
  }

  getCategoryName(article: BlogArticle) {
    return this.categories[article.category].name;
  }

  getAuthorName(article: BlogArticle) {
    return article.handle_name || article.author.name;
  }

  getArticleTitle(article: BlogArticle) {
    return article.title;
  }
}
</script>
