<template>
  <div id="share-buttons">
    <div class="share-btn twitter">
      <b-link
        :href="
          `https://twitter.com/share?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashTag}&related=${account}`
        "
        rel="nofollow"
        target="_blank"
      >
        <font-awesome-icon :icon="['fab', 'twitter']" size="2x" class="fa-fw" />
      </b-link>
    </div>
    <div class="share-btn line">
      <b-link
        :href="`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`"
        rel="nofollow"
        target="_blank"
      >
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style="vertical-align: -0.2em"
        >
          <path
            fill="currentColor"
            d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
          />
        </svg>
      </b-link>
    </div>
    <div class="share-btn facebook">
      <b-link
        :href="`http://www.facebook.com/share.php?u=${encodedUrl}`"
        rel="nofollow"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'facebook-f']"
          size="2x"
          class="fa-fw"
        />
      </b-link>
    </div>
    <div class="share-btn pocket">
      <b-link
        :href="
          `http://getpocket.com/edit?url=${encodedUrl}&title=${encodedTitle}`
        "
        rel="nofollow"
        target="_blank"
      >
        <font-awesome-icon
          :icon="['fab', 'get-pocket']"
          size="2x"
          class="fa-fw"
        />
      </b-link>
    </div>
    <div class="share-btn hatebu">
      <b-link
        :href="
          `http://b.hatena.ne.jp/add?mode=confirm&url=${encodedUrl}&title=${encodedTitle}`
        "
        rel="nofollow"
        target="_blank"
      >
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style="vertical-align: -0.2em"
        >
          <path
            fill="currentColor"
            d="M20.47 0C22.42 0 24 1.58 24 3.53v16.94c0 1.95-1.58 3.53-3.53 3.53H3.53C1.58 24 0 22.42 0 20.47V3.53C0 1.58 1.58 0 3.53 0h16.94zm-3.705 14.47c-.78 0-1.41.63-1.41 1.41s.63 1.414 1.41 1.414 1.41-.645 1.41-1.425-.63-1.41-1.41-1.41zM8.61 17.247c1.2 0 2.056-.042 2.58-.12.526-.084.976-.222 1.32-.412.45-.232.78-.564 1.02-.99s.36-.915.36-1.48c0-.78-.21-1.403-.63-1.87-.42-.48-.99-.734-1.74-.794.66-.18 1.156-.45 1.456-.81.315-.344.465-.824.465-1.424 0-.48-.103-.885-.3-1.26-.21-.36-.493-.645-.883-.87-.345-.195-.735-.315-1.215-.405-.464-.074-1.29-.12-2.474-.12H5.654v10.486H8.61zm.736-4.185c.705 0 1.185.088 1.44.262.27.18.39.495.39.93 0 .405-.135.69-.42.855-.27.18-.765.254-1.44.254H8.31v-2.297h1.05zm8.656.706v-7.06h-2.46v7.06H18zM8.925 9.08c.71 0 1.185.08 1.432.24.245.16.367.435.367.83 0 .38-.13.646-.39.804-.265.154-.747.232-1.452.232h-.57V9.08h.615z"
          />
        </svg>
      </b-link>
    </div>
    <div class="share-btn share" v-if="canUseWebShare">
      <b-link @click="webShare">
        <font-awesome-icon icon="share-alt" size="2x" class="fa-fw" />
      </b-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#share-buttons {
  display: table;
  width: 100%;
  table-layout: fixed;
  background: #fff;
  margin: 1rem 0 0.5rem 0;
  .share-btn {
    display: table-cell;
    opacity: 0.95;
    a {
      display: block;
      padding: 0.5em 0 0.5em;
      text-align: center;
      color: #fff;
      opacity: 1;
      svg {
        height: 22px;
      }
    }

    &:hover {
      opacity: 0.8;
    }
  }
}

.twitter {
  background: #55acee;
}
.line {
  background: #08ba59;
}
.facebook {
  background: #3b5998;
}
.pocket {
  background: #d35a5b;
}
.hatebu {
  background: #00a4de;
}
.share {
  background: #aaa;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

type ShareData = {
  title?: string;
  text?: string;
  url?: string;
};

interface Navigator {
  share?: (data?: ShareData) => Promise<void>;
}

@Component
export default class ShareButtons extends Vue {
  @Prop({ required: true })
  private title!: string;

  readonly hashTag = "73AFes";
  readonly account = "@73_AFes";

  get encodedUrl() {
    return encodeURI("https://afes.info" + this.$route.path);
  }
  get encodedTitle() {
    return encodeURI(this.title);
  }

  private webShare() {
    const navigator_ = navigator as Navigator;
    if (navigator_.share) {
      navigator_.share({
        text: this.title,
        url: "https://afes.info" + this.$route.fullPath
      });
    } else {
      alert("お使いのブラウザは Web Share API に対応していません.");
    }
  }

  get canUseWebShare(): boolean {
    const navigator_ = navigator as Navigator;
    return !!navigator_.share;
  }
}
</script>
