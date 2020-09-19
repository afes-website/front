import Vue from "vue";
import Auth from "@/libs/auth";

declare module "vue/types/vue" {
  interface Vue {
    $auth: Auth;
  }
}
