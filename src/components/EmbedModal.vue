<template>
  <b-modal
    id="modal-1"
    title="埋め込みコンテンツの挿入"
    @show="init"
    @ok="modal_ok"
    v-model="_value"
    centered
  >
    <b-form>
      <b-form-group
        id="input-group-url"
        label="URL"
        label-for="input-1"
        description="共有用URLを入力してください。埋め込みタグには対応していません。"
      >
        <b-form-input id="input-url" v-model="content" type="text" required />
      </b-form-group>
    </b-form>
    <ul class="type-list" :class="{ has_selection: type }">
      <li
        v-for="(example, i) in embedExamples"
        :key="i"
        :class="get_icon_classes(example)"
      >
        <div class="type-content">
          <font-awesome-icon
            :icon="get_example_icon(example)"
            class="fa-fw mr-1"
          />
          <span>{{ get_example_name(example) }}</span>
          <br />
          <ul class="example-url-wrapper">
            <li v-for="url in get_example_example(example)" :key="url">
              <code class="example-url">{{ url }}</code>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <template v-slot:modal-footer="{ ok }">
      <b-button variant="primary" @click="ok">挿入</b-button>
    </template>
  </b-modal>
</template>

<style lang="scss" scoped>
$twitter: #55acee;
$instagram: #262626;
$instagram-gradient: linear-gradient(-135deg, #1400c8, #b900b4, #f50000);
$youtube: #ff0000;
$link: #777777;

.type-list {
  font-size: 1rem;
  list-style: none;
  padding: 0;
  position: relative;

  li {
    transition: padding 0.3s ease-in, color 0.3s;
    padding: 5px 10px;
    position: relative;

    .example-url-wrapper {
      margin: 0;
      padding: 0;

      @media screen and (max-width: 900px) {
        display: none;
      }

      li {
        display: block;
        list-style: none;
        padding: 0;
      }
    }
  }

  // 非選択時
  .tweet {
    color: $twitter;
  }
  .instagram {
    color: $instagram;
  }
  .youtube {
    color: $youtube;
  }
  .link {
    color: $link;
  }

  & > li::before {
    content: "";
    width: 100%;
    height: 100%;
    border-radius: 8px;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s ease-in;
  }

  .tweet::before {
    background: $twitter;
  }
  .instagram::before {
    background: $instagram-gradient;
  }
  .youtube::before {
    background: $youtube;
  }
  .link::before {
    background: $link;
  }

  &.has_selection > li {
    .type-content {
      position: relative;
    }

    &.selected {
      color: #fff;
      padding: 10px 10px;
      font-weight: 500;

      &::before {
        opacity: 1;
      }
    }
    &:not(.selected) {
      opacity: 0.4;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faLink, IconDefinition } from "@fortawesome/free-solid-svg-icons";

type EmbedType = "tweet" | "youtube" | "instagram" | "link";
type EmbedInfo = {
  type: EmbedType;
  content: string;
};
type EmbedExample = {
  type: EmbedType;
  icon: IconDefinition;
  name: string;
  example: string[];
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
    const match = strip_content.match(/^youtu\.be\/(\w+)/);
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
  readonly embedExamples: ReadonlyArray<EmbedExample> = [
    {
      type: "tweet",
      icon: faTwitter,
      name: "Twitter tweet",
      example: ["https://twitter.com/73_Afes/status/1311653798381674499"],
    },
    {
      type: "instagram",
      icon: faInstagram,
      name: "Instagram post",
      example: ["https://www.instagram.com/p/B9LVH_Oh1rW/"],
    },
    {
      type: "youtube",
      icon: faYoutube,
      name: "YouTube video & live",
      example: [
        "https://www.youtube.com/watch?v=hy6B_EPE50s",
        "https://youtu.be/hy6B_EPE50s",
      ],
    },
    {
      type: "link",
      icon: faLink,
      name: "その他 URL（リンクとして挿入）",
      example: ["https://afes.info", "https://github.com/afes-website/front/"],
    },
  ];

  @Prop({ default: false })
  value = false;

  get _value() {
    return this.value;
  }

  set _value(val: boolean) {
    this.$emit("input", val);
  }

  init() {
    this.content = "";
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
    return `\n{${ret.type} ${ret.content}}\n`;
  }

  modal_ok(e: Event) {
    e.preventDefault();
    const ret = this.get_content();
    if (ret === null) return;
    this.$emit("created", ret);
    this._value = false;
    this.content = "";
  }

  get_example_icon(example: EmbedExample) {
    return example.icon;
  }
  get_example_name(example: EmbedExample) {
    return example.name;
  }
  get_example_example(example: EmbedExample) {
    return example.example;
  }

  is_selected(example: EmbedType) {
    return this.type === example;
  }
  get_icon_classes(example: EmbedExample) {
    return [{ selected: example.type === this.type }, example.type];
  }
}
</script>
