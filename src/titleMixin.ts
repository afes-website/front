import Vue from "vue";
import { Mixin } from "vue-mixin-decorator";
import { Watch } from "vue-property-decorator";

const TITLE_SUFFIX = "第73回麻布学園文化祭";
const TOP_TITLE = "第73回 麻布中学校･高等学校文化祭";
@Mixin
export default class TitleMixin extends Vue {
  @Watch("page_title", { immediate: true })
  onTitleChange(newTitle: unknown) {
    if (typeof newTitle === "string") {
      if (newTitle === "") document.title = TOP_TITLE;
      else document.title = newTitle + " - " + TITLE_SUFFIX;
    }
  }
}
