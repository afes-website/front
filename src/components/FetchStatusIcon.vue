<template>
  <span>
    <b-spinner v-if="status == 'pending'" :small="_small"></b-spinner>
    <font-awesome-icon
      v-else-if="status == 'fail'"
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
  status?: FetchStatus;

  @Prop({ default: false })
  small?: boolean;

  get _small() {
    return !!this.small;
  }
}
</script>
