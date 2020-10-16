import Vue from "vue";
import Auth from "@/libs/auth/auth";

declare module "vue/types/vue" {
  interface Vue {
    $auth: Auth;
  }
}
