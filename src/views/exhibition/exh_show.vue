<template>
  <div id="exh-show">
    <breadcrumb :text="page_title" />
    <h1>{{ page_title }}</h1>
    <div class="under-title">
      <span>
        <font-awesome-icon :icon="'clock'" class="fa-fw" />
        {{ timestamp }}
      </span>
    </div>
    <div class="main-content" v-html="rendered_md" />
    <b-alert show variant="primary" class="mt-1">
      展示大賞の投票へのご協力をお願いします<br />
      <b-link href="https://forms.gle/hdqAidpNvnbjRj7s7">投票フォーム</b-link>
    </b-alert>
    <share-buttons :title="page_title_for_share" />
  </div>
</template>

<style lang="scss" scoped>
#exh-show {
  .under-title {
    margin-top: -14px;
    margin-bottom: 16px;
    text-align: right;
    color: var(--secondary);
    font-weight: 500;

    p {
      margin-bottom: 0;
    }
  }
}

span {
  margin-right: 0.5em;
  white-space: nowrap;
}
</style>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import api, { Exhibition } from "@afes-website/docs";
import aspida from "@aspida/axios";
import is_axios_error from "@/libs/is_axios_error";
import FetchStatus from "@/libs/fetch_status";
import Markdown from "@/libs/markdown";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { getStringTime } from "@/libs/string_date";
import ShareButtons from "@/components/ShareButtons.vue";

@Component({
  components: {
    Breadcrumb,
    ShareButtons,
  },
})
export default class ExhShow extends Vue {
  exhibition: Exhibition | null = null;
  fetch_status: FetchStatus = "idle";
  page_title = "";

  mounted() {
    this.load();
  }

  @Watch("$route")
  route_changed() {
    this.load();
  }

  load() {
    this.exhibition = null;
    this.fetch_status = "pending";

    api(aspida())
      .online.exhibition._id(this.$route.params.id)
      .$get()
      .then((exh) => {
        this.exhibition = exh;
        if (this.exhibition.content === null) {
          this.$emit("not_found");
          this.fetch_status = "fail";
        } else {
          this.page_title = this.exhibition.name;
          this.fetch_status = "idle";
        }
      })
      .catch((e) => {
        if (is_axios_error(e))
          if (e.response && e.response.status == 404) this.$emit("not_found");
        this.fetch_status = "fail";
      });
  }

  get page_title_for_share() {
    return this.page_title + " - 第73回麻布学園文化祭";
  }

  get rendered_md(): string | null {
    if (this.exhibition === null || this.exhibition.content === null)
      return null;
    return Markdown.render(this.exhibition.content);
  }

  get timestamp() {
    return this.exhibition === null
      ? null
      : getStringTime(this.exhibition.updated_at);
  }
}
</script>
