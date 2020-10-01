<template>
  <forbidden :is-forbidden="forbidden" :title="page_title" class="box wide-box">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <DraftTable v-model="drafts" />
  </forbidden>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import auth_eventhub from "@/libs/auth/auth_eventhub";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Forbidden from "@/components/Forbidden.vue";
import DraftTable from "@/components/DraftTable.vue";
import api, { Draft } from "@afes-website/docs";
import aspida from "@aspida/axios";

@Component({
  components: {
    Breadcrumb,
    Forbidden,
    DraftTable,
  },
})
export default class DraftList extends Vue {
  page_title = "展示リクエスト一覧";
  forbidden = false;
  drafts: Draft[] = [];

  mounted() {
    this.load();
    auth_eventhub.onUpdateAuth(this.load);
  }

  load() {
    this.$auth
      .attempt_get_JWT(["blogAdmin", "teacher"])
      .then((token) => {
        this.forbidden = false;
        api(aspida())
          .online.drafts.$get({
            headers: { Authorization: "bearer " + token },
          })
          .then((res) => {
            this.drafts.splice(0, this.drafts.length, ...res);
          });
      })
      .catch(() => {
        this.forbidden = true;
      });
  }
}
</script>
