<template>
  <b-modal
    id="modal-1"
    title="Writer Change Password"
    v-model="_value"
    @ok="modal_ok"
    @hidden="modal_cancel"
  >
    <b-form @submit.stop.prevent="change_password">
      <b-form-group
        id="input-group-password"
        label="New Password:"
        label-for="input-password"
      >
        <b-form-input
          id="input-password"
          v-model="password"
          required
          type="password"
        ></b-form-input>
      </b-form-group>
    </b-form>

    <template v-slot:modal-footer="{ ok }">
      <fetch-status-icon :status="status" />
      <b-button variant="primary" @click="ok">
        Submit
      </b-button>
    </template>
  </b-modal>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import aspida from "@aspida/axios";

import Auth from "@/libs/auth";
import EventHub from "@/libs/auth/admin_auth_eventhub";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";

@Component({ components: { FetchStatusIcon } })
export default class WriterChangePasswordModal extends Vue {
  password = "";
  status: FetchStatus = "idle";

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
    this.change_password();
  }

  modal_cancel() {
    EventHub.emitLoginFail();
  }

  change_password() {
    this.status = "pending";
    Auth.WriterAuth.change_password(aspida(), this.password)
      .then(() => {
        this.status = "idle";
        this.value = false;
        EventHub.emitLoginSuccess();
      })
      .catch(() => {
        this.status = "fail";
      });
  }
}
</script>
