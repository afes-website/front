import { Vue } from "vue-property-decorator";

const UPDATE_AUTH = "UPDATE_AUTH";
//@Component
class EventHub extends Vue {
  emitUpdateAuth() {
    this.$emit(UPDATE_AUTH);
  }
  onUpdateAuth(callback: (...args: unknown[]) => void) {
    this.$on(UPDATE_AUTH, callback);
  }
}

export default new EventHub();
