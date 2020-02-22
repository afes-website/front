import Vue from "vue";
import { Mixin } from "vue-mixin-decorator";
import { Watch } from "vue-property-decorator";

const TITLE_SUFFIX: string = "afes73"; // TODO: should change
@Mixin
export default class TitleMixin extends Vue {
  @Watch("title", { immediate: true })
  onTitleChange(newTitle: any) {
    console.log("changed", newTitle);
    if (typeof newTitle === "string") {
      if (newTitle === "") document.title = TITLE_SUFFIX;
      else document.title = newTitle + " - " + TITLE_SUFFIX;
    }
  }
}
