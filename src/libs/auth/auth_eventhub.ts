import { Vue } from "vue-property-decorator";

const UPDATE_AUTH = "UPDATE_AUTH";
const TOKEN_EXPIRED = "TOKEN_EXPIRED";
//@Component
class EventHub extends Vue {
  emitUpdateAuth() {
    this.$emit(UPDATE_AUTH);
  }
  onUpdateAuth(callback: (...args: unknown[]) => void) {
    this.$on(UPDATE_AUTH, callback);
  }

  emitTokenExpired() {
    this.$emit(TOKEN_EXPIRED);
  }
  onTokenExpired(callback: (...args: unknown[]) => void) {
    this.$on(TOKEN_EXPIRED, callback);
  }
}

export default new EventHub();
