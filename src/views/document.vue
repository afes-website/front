<template>
  <article id="policy" class="box">
    <h1>{{ title }}</h1>
    <p>
      第73回文化祭実行委員会では、会議の議事録や広報を始めとした各種資料をネット上に公開しています。
    </p>
    <section>
      <h2>公開されている資料の一覧</h2>
      <ul>
        <li>
          文実内部向け資料
        </li>
        <li>
          文化祭実行委員会執行委員会本会議関連
        </li>
        <li>
          各分科局の資料関連
        </li>
        <li>
          副局長選出に係る面接の議事録
        </li>
        <li>
          展示(飲食、フロンティア、ステージを含みます)査定関連
        </li>
        <li>
          展示応募関連
        </li>
        <li>
          地下備品倉庫に関する資料
        </li>
        <li>
          各小委員会での資料
        </li>
        <li>
          実務調整会議の資料
        </li>
        <li>
          広報(全校に配布されているものです)
        </li>
      </ul>
      <b-link
        target="_blank"
        title="Afes document"
        href="https://drive.google.com/drive/u/1/folders/17G3eLuEyYXX9av6mrcGmwPIQxFUKoSqv"
      >
        資料はこちらから閲覧できます
      </b-link>
    </section>
  </article>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Document extends Vue {
  readonly title: string = "資料庫";
}
</script>
