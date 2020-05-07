<template>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SpecialAnnouncement",
      "name": "第73回麻布学園文化祭 無期限延期のお知らせ",
      "text": "第73回麻布中学校･高等学校文化祭は、新型コロナウイルス感染拡大防止のため、２学期以降への無期限延期とします。最終的な決定は、文実内、あるいは全校によって行います。",
      "newsUpdatesAndGuidelines": "https://afes.info/blog/news/re-reschedule",
      "datePosted": "2020-05-02T19:00+0900",
      "category": "https://www.wikidata.org/wiki/Q81068910",
      "announcementLocation": {
        "@type": "LocalBusiness",
        "name": "第73回麻布中学校･高等学校文化祭",
        "url": "https://afes.info",
        "image": "https://afes.info/apple-touch-icon.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Moto-Azabu 2-3-29",
          "postalCode": "106-0046",
          "addressLocality": "Minato-ku",
          "addressRegion": "Tokyo",
          "addressCountry": "JP"
        }
      }
    }
  </script>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class SpecialAnnouncement extends Vue {}
</script>
