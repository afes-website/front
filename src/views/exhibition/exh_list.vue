<template>
  <div id="exh-list">
    <h1>オンライン展示一覧</h1>
    <b-tabs v-model="current_type_num" fill justified>
      <b-tab value="normal" title="一般展示"></b-tab>
      <b-tab value="frontier" title="フロンティア展示"></b-tab>
      <b-tab value="stage" title="ステージ展示"></b-tab>
    </b-tabs>
    <div class="exh-list">
      <div
        class="exh-wrapper"
        v-for="exh in current_exhibitions"
        :key="get_exh_id(exh)"
      >
        <exhibition-card
          class="exh-card"
          :title="get_exh_name(exh)"
          :image-url="get_exh_thumbnail_url(exh)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#exh-list {
  .exh-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 16px;

    .exh-wrapper {
      padding: 16px;

      @media screen and (max-width: 900px) {
        width: 50%;
        padding: 4px;

        .exh-card {
          width: 100%;
        }
      }
    }
  }
}
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import api, { Exhibition, ExhibitionType } from "@afes-website/docs";
import aspida from "@aspida/axios";
import ExhibitionCard from "@/components/ExhibitionCard.vue";

@Component({
  components: { ExhibitionCard },
})
export default class ExhList extends Vue {
  current_type_num = 0;
  exhibitions: Exhibition[] = [];

  get current_type(): ExhibitionType {
    switch (this.current_type_num) {
      case 0:
        return "normal";
      case 1:
        return "frontier";
      case 2:
        return "stage";
      default:
        return "normal";
    }
  }

  mounted() {
    this.loadExhibitions();
  }

  loadExhibitions() {
    api(aspida())
      .online.exhibition.$get()
      .then((exhibitions) => {
        this.exhibitions = exhibitions;
      });
  }

  get current_exhibitions() {
    return this.exhibitions.filter((exh) => exh.type === this.current_type);
  }

  readonly get_exh_id = (exh: Exhibition) => exh.id;

  readonly get_exh_name = (exh: Exhibition) => exh.name;

  readonly get_exh_thumbnail_url = (exh: Exhibition) =>
    api(aspida())
      .images._id(exh.thumbnail_image_id)
      .$path({ query: { w: 300, h: 300 } });
}
</script>
