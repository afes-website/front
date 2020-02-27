<template>
  <b-modal
    id="modal-1"
    title="Admin Login"
    v-model="value"
    @ok="modal_ok"
    @hidden="modal_cancel"
  >
    <b-form @submit.stop.prevent="login">
      <b-form-group id="input-group-id" label="User ID:" label-for="input-id">
        <b-form-input id="input-id" v-model="id" required></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-password"
        label="Password:"
        label-for="input-password"
      >
        <b-form-input
          id="input-password"
          v-model="password"
          required
          type="password"
          @keypress.enter="submit"
        ></b-form-input>
      </b-form-group>
    </b-form>

    <template v-slot:modal-footer="{ ok }">
      <fetch-status-icon :status="status" />
      <b-button variant="primary" @click="ok">
        Login
      </b-button>
    </template>
  </b-modal>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import aspida from "@aspida/axios";

import Auth from "@/libs/auth";
import EventHub from "@/libs/auth/admin_auth_eventhub";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";

@Component({ components: { FetchStatusIcon } })
export default class AdminLoginModal extends Vue {
  id = "";
  password = "";
  status: FetchStatus = "idle";

  value = false;

  created() {
    EventHub.onOpenModal(() => {
      this.value = true;
    });
  }

  modal_ok(e: Event) {
    e.preventDefault();
    this.login();
  }

  modal_cancel() {
    EventHub.emitLoginFail();
  }

  login() {
    this.status = "pending";
    Auth.AdminAuth.login(aspida(), this.id, this.password)
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
