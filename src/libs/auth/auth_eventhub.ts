// import Vue from "vue";

// export const ModalEvent = new Vue();

import { Vue } from "vue-property-decorator";

const OPEN_MODAL = "openModal";
const LOGIN_SUCCESS = "loginSuccess";
const LOGIN_FAIL = "loginFail";
//@Component
class EventHub extends Vue {
  emitOpenModal() {
    this.$emit(OPEN_MODAL);
  }
  onOpenModal(callback: (...args: unknown[]) => void) {
    this.$on(OPEN_MODAL, callback);
  }
  emitLoginSuccess() {
    this.$emit(LOGIN_SUCCESS);
  }
  onLoginSuccess(callback: (...args: unknown[]) => void) {
    this.$on(LOGIN_SUCCESS, callback);
  }
  emitLoginFail() {
    this.$emit(LOGIN_FAIL);
  }
  onLoginFail(callback: (...args: unknown[]) => void) {
    this.$on(LOGIN_FAIL, callback);
  }
}

export default new EventHub();
