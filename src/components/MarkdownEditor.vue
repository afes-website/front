<template>
  <div>
    <div class="toolbar">
      <b-button-group size="">
        <b-button
          variant="outline-secondary"
          @click="show_image_upload_modal"
          v-if="!_noImage"
        >
          <font-awesome-icon icon="image" class="fa-fw" />
          画像を追加
        </b-button>
        <b-button variant="outline-secondary" @click="show_embed_modal">
          <font-awesome-icon icon="anchor" class="fa-fw" />
          コンテンツの埋め込み
        </b-button>
      </b-button-group>
    </div>
    <b-textarea v-model="_value" class="edit-area"></b-textarea>
    <image-upload-modal
      v-model="image_upload_modal_shown"
      @uploaded="image_uploaded"
    />
    <embed-modal v-model="embed_modal_shown" @created="embed_created" />
  </div>
</template>
<style lang="scss" scoped>
.toolbar {
  margin: 10px 0;
}
.edit-area {
  height: 700px;
  overflow: scroll;
  border: 1px solid #ced4da;
  border-radius: 4px;
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ImageUploadModal from "@/components/ImageUploadModal.vue";
import EmbedModal from "@/components/EmbedModal.vue";
import { get_image_url } from "@afes-website/docs";

@Component({
  components: {
    ImageUploadModal,
    EmbedModal,
  },
})
export default class MarkdownEditor extends Vue {
  image_upload_modal_shown = false;
  embed_modal_shown = false;

  @Prop({ required: true })
  readonly value!: string;

  get _value() {
    return this.value;
  }

  set _value(val: string) {
    this.$emit("input", val);
  }

  @Prop()
  noImage?: boolean;

  get _noImage() {
    return this.noImage || this.noImage === "";
  }

  image_uploaded(id: string) {
    this._value += `![image alt](${get_image_url(id)})\n`;
  }

  embed_created(content: string) {
    this._value += content;
  }

  show_image_upload_modal() {
    this.image_upload_modal_shown = true;
  }

  show_embed_modal() {
    this.embed_modal_shown = true;
  }
}
</script>
