<template>
  <div v-loading="loading" class="offer-page">
    <Breadcrumbs
      :path-elements="getPathName()"
    />
    <el-alert
      v-if="offer.status !== 'active'"
      title="Ogłoszenie jest nieaktywne. (Widoczne tylko dla Ciebie)"
      type="warning"
      show-icon
      center
    />
    <div class="container">
      <Gallery
        v-if="offer.main_photo"
        :main-photo="offer.main_photo"
        :photos="offer.photos"
      />
      <Map
        v-if="!offer.main_photo"
        :location="offer.location"
      />
      <OfferInfo
        :offer="offer"
        :attributes="attributes"
        @set-favorite="setFavorite"
      />
    </div>
    <OfferDetails
      :offer="offer"
      :attributes="attributes"
    />
    <OffersCarousel />
  </div>
</template>
<script>
import Gallery from '@/components/offer/Gallery'
import Map from '@/components/offer/Map'
import Breadcrumbs from '@/components/offer/Breadcrumbs'
import OfferInfo from '@/components/offer/OfferInfo'
import OfferDetails from '@/components/offer/OfferDetails'
import OffersCarousel from '@/components/OffersCarousel'
import { show } from '@/api/offer'

export default {
  name: 'Offer',
  components: {
    Gallery,
    Breadcrumbs,
    OfferInfo,
    OfferDetails,
    OffersCarousel,
    Map
  },
  data: () => ({
    offer: {},
    attributes: [],
    loading: true
  }),
  mounted () {
    this.getOfferFromApi()
  },
  methods: {
    setFavorite (e) {
      this.offer.is_favorite = e
    },
    async getOfferFromApi () {
      const result = await show(this.$route.params.slug)
      if (result.data) {
        this.offer = result.data
        this.attributes = this.mapAttributes(result.data.attributes)
      }
      this.loading = false
    },
    mapAttributes (attributes) {
      const mappedAttributes = []
      for (const attr of attributes) {
        if ([2, 5, 6, 7, 8, 13].includes(attr.id)) {
          continue
        }
        if (attr.id in mappedAttributes) {
          mappedAttributes[attr.id].result = mappedAttributes[attr.id].result + ', ' + attr.result
        } else {
          mappedAttributes[attr.id] = attr
        }
      }
      return mappedAttributes
    },
    getPathName () {
      return [this.offer.type, this.offer.title]
    }
  }
}
</script>

<style lang="scss">
.offer-page {
  min-height: calc(100vh - 274px);

  .breadcrumbs {
    padding-top: 80px;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
    margin: 0 6vw;
    padding: 40px 0;

    .gallery, .offer-map {
      width: 60%;
      height: 710px;
      min-width: 720px;

      @media only screen and (max-width: 1366px) {
        width: 100%;
        min-width: unset;
      }
    }

    .offer-info {
      width: 40%;
      min-width: 400px;
      @media only screen and (max-width: 1366px) {
        width: 100%;
      }
    }
  }
}
</style>
