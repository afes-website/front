<template>
  <div>
    <div class="toolbar">
      <b-button @click="show_image_upload_modal"> 画像を追加 </b-button>
    </div>
    <b-textarea v-model="_value" class="edit-area"></b-textarea>
    <image-upload-modal
      v-model="image_upload_modal_shown"
      @uploaded="image_uploaded"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ImageUploadModal from "@/components/ImageUploadModal.vue";
import { get_image_url } from "@afes-website/docs";

@Component({
  components: {
    ImageUploadModal,
  },
})
export default class MarkdownEditor extends Vue {
  image_upload_modal_shown = false;

  @Prop({ required: true })
  readonly value!: string;

  get _value() {
    return this.value;
  }

  set _value(val: string) {
    this.$emit("input", val);
  }

  image_uploaded(id: string) {
    this._value += `![image alt](${get_image_url(id)})\n`;
  }

  show_image_upload_modal() {
    this.image_upload_modal_shown = true;
  }
}
</script>
