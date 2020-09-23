<template>
  <b-modal id="reLoginModal" title="再ログイン" v-model="modal_shown" centered>
    <template v-slot:default="ok">
      <p>
        ログインの有効期限が切れました。再度ログインするにはパスワードを入力してください。
      </p>
      <b-form @submit="re_login(ok)">
        <b-form-invalid-feedback :force-show="isError">
          <p v-for="(message, i) in errorMessage" :key="i">
            {{ message }}
          </p>
        </b-form-invalid-feedback>
        <b-form-group id="input-group-id" label="User ID:" label-for="input-id">
          <b-form-input id="input-id" v-model="id" required disabled />
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
          />
        </b-form-group>
      </b-form>
    </template>
    <template v-slot:modal-footer="{ ok, cancel }">
      <b-button variant="secondary" @click="cancel()">キャンセル</b-button>
      <b-button
        type="submit"
        variant="theme-dark"
        :disabled="is_disabled"
        class="login-button"
        @click="re_login(ok)"
      >
        <span v-show="!isLoading">ログイン</span>
        <b-spinner v-show="isLoading" style="height: 24px; width: 24px" />
      </b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import is_axios_error from "@/libs/is_axios_error";
import auth_eventhub from "@/libs/auth/auth_eventhub";

@Component
export default class ReLoginModal extends Vue {
  id = "";
  password = "";

  isError = false;
  errorMessage: string[] = [];
  isLoading = false;

  modal_shown = false;

  mounted() {
    auth_eventhub.onTokenExpired(this.show_modal);
  }

  show_modal() {
    this.id = this.$auth.get_current_user_id || "";
    this.modal_shown = true;
  }

  re_login(ok: () => void) {
    this.isLoading = true;
    api(aspida())
      .auth.login.$post({
        body: { id: this.id, password: this.password },
      })
      .then((res) => {
        this.$auth.register_user(res.token).then(() => {
          this.$auth.switch_user(this.id);
          this.password = "";
          ok();
        });
      })
      .catch((e) => {
        this.isError = true;
        if (e.response?.status === 401)
          this.errorMessage = ["ID またはパスワードが間違っています。"];
        else
          this.errorMessage = [
            "不明なエラーです。もう一度お試しください。",
            `Message: ${
              (is_axios_error(e) && e.response?.data.message) || e.message
            }`,
          ];
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  get is_disabled() {
    return !this.password;
  }
}
</script>
