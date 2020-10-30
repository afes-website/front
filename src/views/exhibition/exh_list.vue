<template>
  <div id="exh-list">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <b-tabs v-model="current_type_num" fill justified nav-class="tab-wrapper">
      <b-tab value="normal" title="一般展示"></b-tab>
      <b-tab value="frontier" title="フロンティア展示"></b-tab>
      <b-tab value="stage" title="ステージ展示"></b-tab>
    </b-tabs>
    <div class="exh-list">
      <div
        class="exh-wrapper"
        v-for="exh in current_exhibitions"
        :key="get_exh_id(exh)"
        @click="go_to_exh_show(exh)"
      >
        <exhibition-card
          class="exh-card"
          :title="get_exh_name(exh)"
          :image-url="get_exh_thumbnail_url(exh)"
          :room-id="get_exh_room_id(exh)"
          :is-disabled="is_exh_disabled(exh)"
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

<style lang="scss">
// ==== not scoped ====
#exh-list {
  .tab-wrapper {
    white-space: nowrap;
  }
}
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import api, { Exhibition, ExhibitionType } from "@afes-website/docs";
import aspida from "@aspida/axios";
import ExhibitionCard from "@/components/ExhibitionCard.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

@Component({
  components: { Breadcrumb, ExhibitionCard },
})
export default class ExhList extends Vue {
  readonly page_title = "オンライン展示一覧";
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
    return this.exhibitions
      .filter((exh) => exh.type === this.current_type)
      .sort((a, b) => {
        if (
          [a, b].some((exh) => exh.room_id !== null && !isNaN(+exh.room_id))
        ) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return +b.room_id! - +a.room_id!;
        }
        return 1;
      });
  }

  readonly get_exh_id = (exh: Exhibition) => exh.id;

  readonly get_exh_name = (exh: Exhibition) => exh.name;

  readonly get_exh_thumbnail_url = (exh: Exhibition) =>
    api(aspida())
      .images._id(exh.thumbnail_image_id)
      .$path({ query: { w: 300, h: 300 } });

  readonly get_exh_room_id = (exh: Exhibition): string | undefined =>
    exh.room_id || undefined;

  readonly go_to_exh_show = (exh: Exhibition) => {
    if (!this.is_exh_disabled(exh))
      this.$router.push({
        name: "exhibition_show",
        params: { id: exh.id },
      });
  };

  readonly is_exh_disabled = (exh: Exhibition) => exh.content === null;
}
</script>
