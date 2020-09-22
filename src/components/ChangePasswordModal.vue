<template>
  <b-modal id="modal-1" title="Change Password" v-model="_value" @ok="modal_ok">
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
      <b-button variant="primary" @click="ok"> Submit </b-button>
    </template>
  </b-modal>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import aspida from "@aspida/axios";
import FetchStatus from "@/libs/fetch_status";
import FetchStatusIcon from "@/components/FetchStatusIcon.vue";
import { api } from "@afes-website/docs";

@Component({ components: { FetchStatusIcon } })
export default class ChangePasswordModal extends Vue {
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

  change_password() {
    this.status = "pending";
    if (this.$auth.get_current_user)
      api(aspida())
        .auth.change_password.$post({
          body: { password: this.password },
          headers: {
            Authorization: "bearer " + this.$auth.get_current_user.token,
          },
        })
        .then(() => {
          this.status = "idle";
          this._value = false;
          this.$bvToast.toast("パスワードを変更しました。", {
            title: "Change Password",
            autoHideDelay: 5000,
          });
        })
        .catch(() => {
          this.status = "fail";
        });
  }
}
</script>
