<template>
  <div v-if="offer.links" class="offers-details">
    <div class="l-box">
      <iframe
        v-if="offer.links.video && offer.links.video !== 'null'"
        class="link-box"
        :src="detectUrl(offer.links.video)"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
      <iframe
        v-if="offer.links.video_2 && offer.links.video_2 !== 'null'"
        class="link-box"
        :src="detectUrl(offer.links.video_2)"
        frameborder="0"
        allowfullscreen
      />
      <iframe
        v-if="offer.links.walk_video && offer.links.walk_video !== 'null'"
        class="link-box"
        :src="detectUrl(offer.links.walk_video)"
        frameborder="0"
        allowfullscreen
      />
    </div>
    <div class="r-box">
      <Map
        v-if="offer.main_photo"
        :location="offer.location"
      />
    </div>
  </div>
</template>

<script>
import Map from '@/components/offer/Map'

export default {
  name: 'OfferDetails',
  components: {
    Map
  },
  props: {
    offer: {
      type: Object,
      default () {
        return {
          user: {
            name: ''
          }
        }
      }
    },
    attributes: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    detectUrl (link) {
      const url = new URL(link)
      const hostname = url.hostname
      if (hostname === 'youtu.be') {
        return this.videoYT(link)
      } else if (hostname === 'share.spotbrowser.com') {
        return this.spotBrowser(link)
      } else if (hostname === 'my.matterport.com') {
        return this.matterport(url)
      } else if (hostname === 'google.com') {
        return this.googlePlace(link)
      } else if (hostname === 'poly.google.com') {
        return this.googlePlace(link)
      }
    },
    videoYT (videoLink) {
      const parts = videoLink.split('/')
      return 'https://www.youtube.com/embed/' + parts[parts.length - 1]
    },
    spotBrowser (videoLink) {
      const parts = videoLink.split('/')
      return 'https://share.spotbrowser.com/' + parts[parts.length - 1]
    },
    matterport (url) {
      return 'https://my.matterport.com/show?m=' + url.searchParams.get('m')
    },
    googlePlace (link) {
      return link
    }
  }
}
</script>

<style lang="scss">
.offers-details {
  display: flex;
  margin: 0 6vw 20px 6vw;

  @media only screen and (max-width: 1366px) {
    width: 90%;
    flex-direction: column;
    align-items: center;
  }

  .l-box {
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    @media only screen and (max-width: 1366px) {
      width: 100%;
      align-items: center;
    }

    .link-box {
      width: 100%;
      height: 500px;
    }

    iframe {
      margin-bottom: 10px;
    }
  }

  .r-box {
    width: 40%;
    margin: 0 40px;
    @media only screen and (max-width: 1366px) {
      width: 100%;
    }

    .map {
      height: 340px;
    }
  }
}
</style>
