<template>
  <b-modal
    id="modal-1"
    title="コンテンツの挿入"
    @ok="modal_ok"
    v-model="_value"
  >
    <b-form>
      <b-form-group
        id="input-group-url"
        label="URL"
        label-for="input-1"
        description="共有用URLを入力してください"
      >
        <b-form-input
          id="input-url"
          v-model="content"
          type="text"
          required
        ></b-form-input>
      </b-form-group>
    </b-form>
    <ul class="type-icons" :class="{ has_selection: type }">
      <li v-for="(icon, i) in icons" :key="i" :class="get_icon_classes(i)">
        <font-awesome-icon :icon="get_icon_icon(i)" class="fa-fw" />
      </li>
    </ul>
    <template v-slot:modal-footer="{ ok }">
      <b-button variant="primary" @click="ok">挿入</b-button>
    </template>
  </b-modal>
</template>

<style lang="scss">
.type-icons {
  height: 2rem;
  display: flex;
  align-items: center;
  padding: 0;
  list-style: none;

  li {
    transition: transform 0.3s ease-out, font-size 0.3s ease-out;
    display: inline-block;
  }

  &.has_selection li {
    // transform: scale(0.5);
    font-size: 0.75em;
    &.selected {
      // transform: scale(1.0);
      font-size: 2em;
    }
    &:not(.selected) {
      opacity: 0.5;
    }
  }

  .tweet,
  .twitter_timeline {
    color: #55acee;
  }
  .instagram {
    color: #262626;
  }
  .youtube {
    color: #ff0000;
  }
  .link {
    color: #888;
  }
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

type EmbedType =
  | "tweet"
  | "twitter_timeline"
  | "youtube"
  | "instagram"
  | "link";
type EmbedInfo = {
  type: EmbedType;
  content: string;
};

const leading_https = /^(https?:)?\/\/(www\.)?/;

function detect_embed_type(content: string): EmbedInfo {
  const strip_content = content.replace(leading_https, "");

  {
    const match = strip_content.match(/^twitter\.com\/(?:\w+)\/status\/(\d+)/);
    if (match)
      return {
        type: "tweet",
        content: match[1],
      };
  }
  {
    const match = strip_content.match(/^twitter\.com\/(\w+)/);
    if (match)
      return {
        type: "twitter_timeline",
        content: match[1],
      };
  }
  {
    const match = strip_content.match(/^instagram\.com\/p\/(\w+)/);
    if (match)
      return {
        type: "instagram",
        content: match[1],
      };
  }
  {
    const match = strip_content.match(
      /^youtube\.com\/watch(?:\/?\?v=|\/)(\w+)/
    );
    if (match)
      return {
        type: "youtube",
        content: match[1],
      };
  }
  {
    const match = strip_content.match(/^youtu.be\/(\w+)/);
    if (match)
      return {
        type: "youtube",
        content: match[1],
      };
  }
  return {
    type: "link",
    content: content,
  };
}

@Component
export default class EmbedModal extends Vue {
  content = "";
  readonly icons = [
    { type: "tweet", icon: ["fab", "twitter"] },
    { type: "twitter_timeline", icon: ["fab", "twitter-square"] },
    { type: "instagram", icon: ["fab", "instagram"] },
    { type: "youtube", icon: ["fab", "youtube"] },
    { type: "link", icon: "link" },
  ];

  @Prop({ default: false })
  value = false;

  get _value() {
    return this.value;
  }

  set _value(val: boolean) {
    this.$emit("input", val);
  }

  get detect_embed(): EmbedInfo | null {
    if (this.content === "") return null;
    return detect_embed_type(this.content);
  }

  get type(): EmbedType | null {
    const ret = this.detect_embed;
    if (ret === null) return null;
    return ret.type;
  }

  get_content() {
    const ret = this.detect_embed;
    if (ret === null) return null;
    if (ret.type === "link") return `[link](${ret.content})`;
    return `{${ret.type} ${ret.content}}`;
  }

  modal_ok(e: Event) {
    e.preventDefault();
    const ret = this.get_content();
    if (ret === null) return;
    this.$emit("created", ret);
    this._value = false;
    this.content = "";
  }

  get_icon_type(idx: number) {
    return this.icons[idx].type;
  }

  get_icon_icon(idx: number) {
    return this.icons[idx].icon;
  }

  is_selected(type: EmbedType) {
    return this.type === type;
  }
  get_icon_classes(idx: number) {
    return [
      { selected: this.icons[idx].type === this.type },
      this.icons[idx].type,
    ];
  }
}
</script>
