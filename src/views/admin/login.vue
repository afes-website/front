<template>
  <article id="login">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <b-form @submit="login" class="login-form">
      <b-form-invalid-feedback :force-show="isError">
        <p v-for="(message, i) in errorMessage" :key="i">
          {{ message }}
        </p>
      </b-form-invalid-feedback>
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
        ></b-form-input>
      </b-form-group>
      <b-button
        type="submit"
        variant="theme-dark"
        :disabled="is_disabled"
        class="login-button"
      >
        <span v-show="!isLoading">ログイン</span>
        <b-spinner v-show="isLoading" style="height: 24px; width: 24px" />
      </b-button>
    </b-form>
  </article>
</template>

<style lang="scss" scoped>
#login {
  .login-form {
    max-width: 100%;
    // PC
    @media screen and (min-width: 900.1px) {
      max-width: 400px;
      display: block;
      margin: 0 auto;
    }
  }
  .login-button {
    width: 100%;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { api } from "@afes-website/docs";
import aspida from "@aspida/axios";
import is_axios_error from "@/libs/is_axios_error";

@Component({
  components: {
    Breadcrumb,
  },
})
export default class Login extends Vue {
  readonly page_title = "ログイン";
  id = "";
  password = "";
  isError = false;
  errorMessage: string[] = [];
  isLoading = false;

  login(e?: Event) {
    this.isLoading = true;
    api(aspida())
      .auth.login.$post({
        body: { id: this.id, password: this.password },
      })
      .then((res) => {
        this.$auth.register_user(res.token).then(() => {
          this.$auth.switch_user(this.id);
          this.$router.push({ name: "admin_top" });
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
    if (e) e.preventDefault();
  }

  get is_disabled() {
    return !this.id && !this.password;
  }
}
</script>
