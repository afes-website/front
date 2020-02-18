<template>
  <article id="access" class="box">
    <h1>{{ title }}</h1>
    <h2>学校所在地</h2>
    <address>
      麻布中学校･高等学校<br />
      〒106-0046 東京都港区元麻布2-3-29
    </address>
    <h2>交通アクセス</h2>
    <ul>
      <li>メトロ日比谷線 広尾駅より 徒歩10分</li>
      <li>メトロ南北線･都営大江戸線 麻布十番駅より 徒歩15分</li>
      <li>メトロ千代田線 乃木坂駅より 徒歩20分</li>
      <li>都営バス 橋86 愛育クリニック前バス停より 徒歩すぐ</li>
    </ul>
    <iframe
      id="access_map"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.9267772138323!2d139.7255326149878!3d35.654175639063254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b748bbcc189%3A0xe0e29b80ae68d0fa!2z6bq75biD5Lit5a2m5qCh44O76auY562J5a2m5qCh!5e0!3m2!1sja!2sjp!4v1580917146328!5m2!1sja!2sjp"
    ></iframe>
  </article>
</template>

<style lang="scss" scoped>
#access {
  #access_map {
    width: 100%;
    height: 30rem;
    frameborder: 0;
    border: 0;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class About extends Vue {
  readonly title: string = "アクセス";
}
</script>
