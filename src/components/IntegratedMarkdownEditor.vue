<template>
  <div class="integrated-md-editor">
    <b-tabs>
      <b-tab title="編集" active>
        <markdown-editor v-model="_value" :no-image="noImage" />
      </b-tab>
      <b-tab title="プレビュー" class="preview">
        <slot name="beforePreview" />
        <markdown-renderer :content="_value" />
        <slot name="afterPreview" />
      </b-tab>
      <b-tab title="現在との差分" v-if="diff_shown">
        <div class="diff-view" v-html="diff_from_latest" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<style lang="scss">
/* ==== !! be careful - NOT scoped !! ==== */

@import "~diff2html/bundles/css/diff2html.min.css";

.integrated-md-editor {
  .preview {
    padding-top: 1rem;
    max-width: 952px;
  }

  .diff-view {
    .d2h-file-list-wrapper {
      display: none;
    }

    .d2h-wrapper {
      .d2h-file-header {
        display: none;
      }

      td {
        padding: 0;
        position: unset;
      }
    }
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import MarkdownEditor from "@/components/MarkdownEditor.vue";
import MarkdownRenderer from "@/components/MarkdownRenderer.vue";
import DiffLib from "difflib";
import * as Diff2Html from "diff2html";

@Component({ components: { MarkdownEditor, MarkdownRenderer } })
export default class IntegratedMarkdownEditor extends Vue {
  @Prop({ required: true })
  value?: string;

  get _value() {
    return this.value || "";
  }
  set _value(_new_val: string) {
    this.$emit("input", _new_val);
  }

  @Prop()
  old?: string;

  get diff_shown() {
    return this.old !== undefined;
  }

  @Prop({ default: false, type: Boolean })
  noImage?: boolean;

  get diff_from_latest(): string {
    if (!this.old) return "";
    const diff = DiffLib.unifiedDiff(
      this.old.split("\n"), // old
      this._value.split("\n"), // new
      {
        fromfile: "Original",
        tofile: "Current",
        lineterm: "",
      }
    ).join("\n");
    return Diff2Html.html(diff, {
      drawFileList: true,
      matching: "lines",
      outputFormat: "side-by-side",
    });
  }
}
</script>
