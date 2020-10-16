<template>
  <forbidden :is-forbidden="forbidden" :title="page_title" class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <b-table
      show-empty
      small
      hover
      responsive="lg"
      :items="exh_list"
      :fields="exhFields"
      :filter="exhFilter"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :busy="busy"
    >
      <template v-slot:cell(show)="row">
        <b-button-group size="sm">
          <b-button
            :to="{
              name: 'admin_exh_manage',
              params: { id: get_id(row) },
            }"
            variant="link"
          >
            <font-awesome-icon icon="wrench" class="fa-fw" />
            Manage
          </b-button>
          <b-button
            :to="{
              name: '',
              params: { id: get_id(row) },
            }"
            variant="link"
          >
            <font-awesome-icon :icon="['far', 'file']" class="fa-fw" />
            Preview
          </b-button>
        </b-button-group>
      </template>
      <template v-slot:table-busy>
        <div class="text-center text-theme-dark my-2">
          <b-spinner class="align-middle mr-2"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
    </b-table>
  </forbidden>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import auth_eventhub from "@/libs/auth/auth_eventhub";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Forbidden from "@/components/Forbidden.vue";
import api, { Exhibition } from "@afes-website/docs";
import aspida from "@aspida/axios";
import { getStringTime } from "@/libs/string_date";

@Component({
  components: {
    Breadcrumb,
    Forbidden,
  },
})
export default class ExhList extends Vue {
  page_title = "展示一覧";
  forbidden = false;
  exh_list: Exhibition[] = [];
  busy = false;

  readonly exhFields = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "展示名" },
    {
      key: "updated_at",
      label: "更新日時",
      formatter: this.get_formatted_time,
      sortable: true,
    },
    { key: "show", label: "" },
  ];
  exhFilter = "";
  sortBy = "id";
  sortDesc = false;

  mounted() {
    this.load();
    auth_eventhub.onUpdateAuth(this.load);
  }

  load() {
    this.busy = true;
    this.$auth
      .attempt_get_JWT()
      .then(() => {
        this.forbidden = false;
        api(aspida())
          .online.exhibition.$get()
          .then((res) => {
            this.exh_list.splice(0, this.exh_list.length, ...res);
            this.busy = false;
          });
      })
      .catch(() => {
        this.forbidden = true;
        this.busy = false;
      });
  }

  get_id(row: { item: Exhibition }) {
    return row.item.id;
  }

  get_formatted_time(timestamp: string | undefined) {
    return timestamp ? getStringTime(timestamp) : "-";
  }
}
</script>
