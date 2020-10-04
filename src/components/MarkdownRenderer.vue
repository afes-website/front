<template>
  <div class="markdown-output" v-html="rendered"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Markdown from "@/libs/markdown";
import ImageUploadModal from "@/components/ImageUploadModal.vue";

@Component({
  components: {
    ImageUploadModal,
  },
})
export default class MarkdownRenderer extends Vue {
  @Prop({ required: true })
  readonly content!: string;

  get rendered() {
    return Markdown.render(this.content);
  }
}
</script>
