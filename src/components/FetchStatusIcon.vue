<template>
  <span>
    <b-spinner v-if="is_pending" :small="_small"></b-spinner>
    <font-awesome-icon
      v-else-if="is_fail"
      icon="exclamation-circle"
      class="button-icon fa-fw"
    />
  </span>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import FetchStatus from "@/libs/fetch_status";

@Component
export default class FetchStatusIcon extends Vue {
  @Prop({ required: true })
  status!: FetchStatus;

  @Prop({ default: false })
  small?: boolean;

  get _small() {
    return !!this.small;
  }

  get is_pending() {
    return this.status == "pending";
  }
  get is_fail() {
    return this.status == "fail";
  }
}
</script>
