<template>
  <div v-if="offer.links" class="offers-details">
    <div class="gallery">
      <Gallery
        v-if="offer.main_photo"
        :main-photo="offer.main_photo"
        :photos="offer.photos"
      />
      <Map
        v-if="!offer.main_photo"
        :location="offer.location"
      />
    </div>
    <div class="box">
      <iframe
        v-if="offer.links.video && offer.links.video !== 'null'"
        class="link-box"
        :src="detectUrl(offer.links.video)"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
      <iframe
        v-if="offer.links.video_2 && offer.links.video_2 !== 'null'"
        class="link-box"
        :src="detectUrl(offer.links.video_2)"
        allowfullscreen
      />
      <iframe
        v-if="offer.links.walk_video && offer.links.walk_video !== 'null'"
        class="link-box"
        :src="detectUrl(offer.links.walk_video)"
        allowfullscreen
      />
    </div>
  </div>
</template>

<script>
import Map from '@/components/offer/Map'
import Gallery from '@/components/offer/Gallery'

export default {
  name: 'OfferDetails',
  components: {
    Map,
    Gallery
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
  width: 60%;
  flex-direction: column;

  @media only screen and (max-width: 1366px) {
    width: 90%;
    flex-direction: column;
    align-items: center;
  }

  .offer-map {
    height: 600px;
  }

  .box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 24px 10px 0 10px;
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
}
</style>
