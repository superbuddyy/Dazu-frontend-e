<template>
  <div v-loading="loading" class="offers">
    <flickity v-if="offers.length > 0" ref="flickity" :options="flickityOptions" @init="onInit">
      <div v-for="(offer, index) in offers" :key="index" class="carousel-cell offer">
        <nuxt-link :to="'/ogloszenia/' + offer.slug" class="offer-link">
          <div v-if="offer.main_photo" class="img" :style="{backgroundImage: 'url(' + $store.state.settings.assetUrl + '/' + offer.main_photo.file.path_name + ')'}">
            <span v-if="offer.is_argent" class="argent-label img-label">Pilne</span>
            <span v-if="offer.is_promoted" class="promoted-label img-label">Wyróżnione</span>
          </div>
          <div v-if="offer.main_photo === null" class="img" :style="{backgroundImage: 'url(https://yko.im/mpWr.png)'}">
            <span v-if="offer.is_argent" class="argent-label img-label">Pilne</span>
            <span v-if="offer.is_promoted" class="promoted-label img-label">Wyróżnione</span>
          </div>
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
              Rachunki wliczone
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
    </flickity>
  </div>
</template>

<script>
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import { index } from '@/api/offer'
import Favorite from '@/components/Favorite'
import Money from '@/components/Money'

export default {
  name: 'OffersCarousel',
  components: {
    Favorite,
    Money
  },
  data () {
    return {
      isPaused: true,
      flickityOptions: {
        prevNextButtons: true,
        pageDots: true,
        draggable: true,
        selectedAttraction: 0.015,
        friction: 0.25,
        cellAlign: 'left',
        wrapAround: true
      },
      offers: [],
      loading: true
    }
  },
  mounted () {
    this.getOffers()
  },
  methods: {
    onInit () {
      this.update()
      const element = this.$refs.flickity.$el
      element.addEventListener('mouseenter', this.pause, false)
      element.addEventListener('mouseleave', this.play, false)
    },
    play () {
      this.isPaused = true
      window.requestAnimationFrame(this.update)
    },
    pause () {
      this.isPaused = true
    },
    update () {
      if (this.isPaused) {
        return
      }
      const tickerSpeed = 0.8
      const flickity = this.$refs.flickity.flickity()
      if (flickity.slides) {
        flickity.x = (flickity.x - tickerSpeed) % flickity.slideableWidth
        flickity.selectedIndex = flickity.dragEndRestingSelect()
        flickity.updateSelectedSlide()
        flickity.settle(flickity.x)
      }
      window.requestAnimationFrame(this.update)
    },
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
.offers {
  height: 340px;
  margin: 80px 6vw 80px 6vw;

  .flickity-page-dots .dot {
    width: 4px;
    height: 4px;
  }

  .carousel-cell {
    height: 320px;
    width: 300px;
    padding: 14px;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-decoration: none !important;
    color: unset;
    border: 0 !important;
    outline: 0 !important;

    .bargain {
      position: absolute;
      top: 0;
    }

    .img {
      height: 200px;
      width: 100%;
      background-size: cover;
      background-position: center;
      position: relative;
      overflow: hidden;

      .img-label {
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        transform: rotate(-45deg);
        left: -50px;
        top: 30px;
        position: absolute;
        font-weight: bold;
        padding: 10px;
        width: 200px;
        display: inline-block;
        color: #fff;
        text-align: center;
      }

      .argent-label {
        background: red;
      }

      .promoted-label {
        background: #009E79;
      }
    }

    .description {
      margin: 4px 0;
    }

    .info {
      color: #000000;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 10px 0 0 0;

      .type, .price {
        font-weight: bold;
        text-transform: uppercase;
      }

      .type {
        font-size: 13px;
      }

      .badge {
        text-align: center;
        border-radius: 14px;
        background: #f5f5f5;
        padding: 4px 6px;
        font-size: 13px;
        text-transform: lowercase;
      }
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      text-align: left;
      width: 100%;
      .location {
        font-weight: bold;
        font-size: 13px;
      }
    }

    .offer-link {
      color: #000000;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
