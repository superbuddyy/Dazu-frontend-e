<template>
  <div v-loading="loading" class="offers">
    <VueSlickCarousel v-if="offers.length > 0" v-bind="settings">
      <div v-for="offer in offers" :key="offer.id" class="offer">
        <nuxt-link :to="'/ogloszenia/' + offer.slug" class="offer">
          <div class="content">
            <div v-if="offer.main_photo" class="img" :style="{backgroundImage: 'url(' + store_settings.assetUrl + '/' + offer.main_photo.file.path_name + ')'}">
              <span v-if="offer.is_argent" class="argent-label img-label">Urgent</span>
              <span v-if="offer.is_promoted" class="promoted-label img-label">Featured</span>
            </div>
            <div v-if="offer.main_photo === null" class="img" :style="{backgroundImage: 'url(https://yko.im/mpWr.png)'}" />
            <div class="description">
              {{ offer.title }}
            </div>
            <div class="info">
              <div class="price">
                <Money
                  :money="offer.price"
                />
              </div>

              <div v-if="offer.type" class="type">
                {{ offer.type }}
              </div>
              <div v-if="offer.is_with_bills" class="badge">
                Bills included
              </div>
            </div>
          </div>
        </nuxt-link>
        <div class="bottom">
          <div class="location">
            {{ offer.location_name }}
          </div>
          <Favorite
            :offer-slug="offer.slug"
            :is-favorite="offer.is_favorite"
            @add-favorite="setFavorite"
            @remove-favorite="removeFavorite"
          />
        </div>
      </div>
    </VueSlickCarousel>
  </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import { index } from '@/api/offer'
import Favorite from '@/components/Favorite'
import Money from '@/components/Money'

export default {
  name: 'Offers',
  components: {
    Favorite,
    VueSlickCarousel,
    Money
  },
  data () {
    return {
      store_settings: {},
      offers: [],
      loading: true,
      settings: {
        dots: true,
        infinite: true,
        speed: 5000,
        autoplay: true,
        autoplaySpeed: 4000,
        slidesToShow: 5,
        slidesToScroll: 5,
        initialSlide: 0,
        arrows: true,
        responsive: [
          {
            breakpoint: 1600,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 1340,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 970,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 640,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.getOffers()
    this.store_settings = this.$store.state.settings
  },
  methods: {
    async getOffers () {
      const result = await index()
      if (result.status === 200) {
        this.offers = result.data.data
        this.loading = false
      }
    },
    setFavorite (slug) {
      for (const offer in this.offers) {
        if (this.offers[offer].slug === slug) {
          this.offers[offer].is_favorite = true
        }
      }
    },
    removeFavorite (slug) {
      for (const offer in this.offers) {
        if (this.offers[offer].slug === slug) {
          this.offers[offer].is_favorite = false
        }
      }
    }
  }
}
</script>

<style lang="scss">
</style>
