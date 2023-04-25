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
      <OfferDetails
        :offer="offer"
        :attributes="attributes"
      />
      <OfferInfo
        :offer="offer"
        :attributes="attributes"
        @set-favorite="setFavorite"
      />
    </div>
    <OffersCarousel />
    <PreviewBar
      v-if="isPreview"
      :offer-slug="offer.slug"
    />
  </div>
</template>
<script>
import Breadcrumbs from '@/components/offer/Breadcrumbs'
import OfferInfo from '@/components/offer/OfferInfo'
import OfferDetails from '@/components/offer/OfferDetails'
import OffersCarousel from '@/components/OffersCarousel'
import { show, previewShow } from '@/api/offer'
import { csrf } from '@/api/auth'
import { verifyContact } from '@/api/contact'
import PreviewBar from '../components/offer/PreviewBar'

export default {
  name: 'Offer',
  components: {
    Breadcrumbs,
    OfferInfo,
    OfferDetails,
    OffersCarousel,
    PreviewBar
  },
  data: () => ({
    offer: {},
    attributes: [],
    loading: true
  }),
  computed: {
    isPreview () {
      return Object.prototype.hasOwnProperty.call(this.$route.query, 'preview') && this.$route.query.preview
    }
  },
  mounted () {
    if (this.isPreview && !this.$store.state.user.isLogged) {
      this.getOfferPreviewFromApi()
    } else {
      this.getOfferFromApi()
    }
    if (this.$route.query.token) {
      this.verifyToken()
    }
    console.log('offer', this.offer)
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
    async getOfferPreviewFromApi () {
      const result = await previewShow(this.$route.params.slug)
      if (result.data) {
        this.offer = result.data
        this.attributes = this.mapAttributes(result.data.attributes)
      }
      this.loading = false
    },
    mapAttributes (attributes) {
      const mappedAttributes = []
      for (const attr of attributes) {
        if ([2, 5, 6, 7, 8, 13, 20].includes(attr.id)) {
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
      const type = this.offer.type
      const offerType = this.offer.offer_type
      return [{ name: type, link: offerType }, this.offer.title]
    },
    verifyToken () {
      csrf().then(async () => {
        await this.apiCall()
      })
    },
    async apiCall () {
      const result = await verifyContact({ token: this.$route.query.token })
      if (result.status === 204 || result.status === 200) {
        this.$message({
          message: 'Wiadomość została wysłana',
          type: 'success',
          duration: 3000
        })
        this.$router.push(this.$route.path)
      }
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
