<template>
  <b-modal
    id="modal-1"
    title="Uploading image"
    @ok="modal_ok"
    v-model="_value"
    centered
  >
    <b-form>
      <b-form-group id="input-group-file" label="file:" label-for="input-file">
        <b-form-file
          v-model="file"
          :state="!!file"
          placeholder="画像ファイルを選択"
        ></b-form-file>
      </b-form-group>
    </b-form>

    <template v-slot:modal-footer="{ ok }">
      <fetch-status-icon :status="status" />
      <b-button variant="primary" @click="ok"> Submit </b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import aspida from "@aspida/axios";
import api from "@afes-website/docs";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";

@Component({ components: { FetchStatusIcon } })
export default class ImageUploadModal extends Vue {
  status: FetchStatus = "idle";
  client = aspida();

  file: File | null = null;

  @Prop({ default: false })
  value = false;

  get _value() {
    return this.value;
  }

  set _value(val: boolean) {
    this.$emit("input", val);
  }

  modal_ok(e: Event) {
    e.preventDefault();
    this.status = "pending";
    if (!this.file) throw "file not selected";
    this.$auth.attempt_get_JWT("blogWriter").then((token) => {
      api(this.client)
        .images.$post({
          body: {
            content: this.file as File,
          },
          headers: {
            Authorization: "bearer " + token,
          },
        })
        .then((data: { id: string }) => {
          this.status = "idle";
          this._value = false;
          this.$emit("uploaded", data.id);
        })
        .catch(() => {
          this.status = "fail";
        });
    });
  }
}
</script>
