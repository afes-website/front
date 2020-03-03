<template>
  <article id="about" class="box">
    <h1>{{ title }}</h1>
    <div id="pair_picture">
      <img src="../assets/about.jpg" alt="two-shot" />
    </div>
    <section>
      <h2 class="author_name">伊藤碧透</h2>
      <small>第73回 麻布中学校･高等学校文化祭実行委員会 委員長</small>
      <p>
        麻布中学校・高等学校文化祭公式ホームページをご覧頂きありがとうございます。
      </p>
      <p>
        麻布には、様々な生徒がいて、日々想い想いに生活しています。そんな麻布生が、一年に一度、一つになり大きな爆発を起こす、それが麻布の文化祭だと考えています。
      </p>
      <p>
        また、麻布では自主自律の精神に基づいて、生徒自治の名の下に、生徒自らの手で自らのことを決定する自由を行使しています。文化祭もまた同様に、文実を中心として生徒の手によって運営されています。
      </p>
      <p>
        様々な困難に直面することもありますが、それを跳ね飛ばすほどのエネルギーをもち、文化祭に向けた準備を進めています。
      </p>
      <p>
        ユニークな研究や制作物、圧巻のパフォーマンス、様々に彩られた校内、熱狂のステージなど、どんな方でも楽しみ、そして「麻布」という学校の片鱗を感じて頂けるはずです。
      </p>
      <p>
        今一番熱い麻布の文化祭、<del>2020/5/1〜3</del>
        2020/6/12～14、皆様のご来場をお待ちしております。
      </p>
    </section>
    <section>
      <h2 class="author_name">平秀明</h2>
      <small>麻布中学校･高等学校 校長</small>
      <p>
        来る文化祭に向け、実行委員会の生徒諸君をはじめ、展示団体や発表団体の生徒たちは日夜、知恵と力をふり絞って準備をすすめています。
        多くの来校者の皆さまに楽しんでいただき、麻布生の発するエネルギーを感じ取っていただければ幸いです。
        皆さまのお越しを心待ちにしています。
      </p>
    </section>
  </article>
</template>

<style lang="scss" scoped>
#about {
  #pair_picture {
    text-align: center;

    img {
      width: 60%;
    }
  }

  small {
    font-size: 1em;
    font-weight: 500;
    position: relative;
    top: -0.5rem;
    border-bottom: solid 1px $site-theme;
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 900px) {
  #about #pair_picture img {
    width: 100vw;
    margin-left: calc(((100vw - 100%) / 2) * -1);
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class About extends Vue {
  readonly title: string = "学校長・委員長挨拶";
}
</script>
