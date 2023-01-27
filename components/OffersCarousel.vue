<template>
  <div v-loading="loading" class="offers">
    <flickity v-if="offers.length > 0" ref="flickity" :options="flickityOptions" @init="onInit">
      <div v-for="(offer, index) in offers" :key="index" class="carousel-cell urgent_l offer_l" :class="[ ( offer.subscriptions.length && (offer.subscriptions[0]['name'] === 'Srebrne' || offer.subscriptions[0]['name'] === 'Złote')) ? 'featured_l' : '' ]">
        <nuxt-link :to="'/ogloszenia/' + offer.slug" class="offer-link">
          <span class="featured_img_label" v-if="offer.subscriptions.length && (offer.subscriptions[0]['name'] === 'Srebrne' || offer.subscriptions[0]['name'] === 'Złote')">
            <img src="~/assets/Star.svg" style="width: 24px;">
          </span>
          <span v-if="offer.is_promoted" class="promoted-label img-label offer_label">Okazja</span>
          <span v-if="offer.is_urgent" class="promoted-label img-label urgent_label">Pilne</span>
          <div v-if="offer.main_photo" class="img" :style="{backgroundImage: 'url(' + store_settings.assetUrl + '/' + offer.main_photo.file.path_name + ')'}">
          </div>
          <div v-if="offer.main_photo === null" class="img" :style="{backgroundImage: 'url(https://yko.im/mpWr.png)'}">
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
            @refresh="update"
          />
        </div>
      </div>
      <!-- <div v-if="offers.length < 5" class="carousel-cell" style="display: none;"></div> -->
    </flickity>
  </div>
</template>

<script>
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
      store_settings: {},
      isPausedForced: false,
      flickityOptions: {
        prevNextButtons: true,
        pageDots: true,
        draggable: true,
        selectedAttraction: 0.015,
        friction: 0.25,
        // cellAlign: 'right',
        freeScroll: true,
        freeScrollFriction: 0.03,
        autoPlay: false,
        wrapAround: true,
        fade: true
      },
      offers: [],
      loading: true
    }
  },
  computed: {
    isCarouselActive () {
      // return !(this.offers.length < 6)
      return true
    },
    isPaused () {
      if (this.isPausedForced) {
        return true
      }
      return this.$store.state.settings.carouselPause
    }
  },
  async mounted () {
    await this.getOffers()
    // this.$refs.flickity.flickity().x = 0
    if (!this.isCarouselActive) {
      await this.$store.dispatch('settings/setCarouselPause', true)
    }
    this.store_settings = this.$store.state.settings
  },
  methods: {
    onInit () {
      this.update()
      const element = this.$refs.flickity.$el
      if (this.isCarouselActive) {
        element.addEventListener('mouseenter', this.pause, false)
        element.addEventListener('mouseleave', this.play, false)
      }
    },
    play () {
      this.isPausedForced = false
      window.requestAnimationFrame(this.update)
    },
    pause () {
      this.isPausedForced = true
    },
    update () {
      if (this.isPaused || this.$refs.flickity === undefined) {
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
      // const flickity = this.$refs.flickity.flickity()
      // flickity.x -= 1.5
      // flickity.settle(flickity.x)
      // window.requestAnimationFrame(this.update)
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

  .flickity-page-dots {
    .dot {
      width: 4px;
      height: 4px;
    }
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
    margin: 0 10px;
    overflow: hidden;
    &:hover {
      border: 1px solid #f1f1f1!important;
    }

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
        background: #ff19b7;
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .offer-link {
      color: #000000;
      width: 100%;
      height: 100%;
    }
  }
  .carousel-cell.featured_l {
    border: 2px solid #FFF8E2 !important;
    border-radius: 5px;
  }
  .carousel-cell.featured_l:hover {
    border: 2px solid #FFF8E2 !important;
  }
  .carousel-cell span.featured_img_label {
    position: absolute;
    z-index: 1;
    right: 25px;
    top: 25px;
  }
  .carousel-cell span.promoted-label.img-label {
    transform: rotate(-45deg);
    left: -46px;
    top: 60px;
    position: absolute;
    font-weight: 700;
    padding: 5px;
    width: 240px;
    display: inline-block;
    color: #fff;
    text-align: center;
    z-index: 1;
    text-transform: uppercase;
  }
  .carousel-cell span.promoted-label.img-label.urgent_label {
    background: #f91101;
  }
  .carousel-cell span.promoted-label.img-label.offer_label {
    background: #FFC500;
    color: #000;
  }
  .carousel-cell.urgent_l.offer_l .offer_label{
    left: -46px;
    top: 60px;
    width: 240px;
  }
  .carousel-cell.urgent_l.offer_l .urgent_label{
    left: -48px;
    top: 40px;
    width: 200px;
  }
}
</style>
