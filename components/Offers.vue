<template>
  <div v-loading="loading" class="offers">
    <VueSlickCarousel v-if="offers.length > 0" v-bind="settings">
      <div v-for="offer in offers" :key="offer.id" class="offer">
        <nuxt-link :to="'/ogloszenia/' + offer.slug" class="offer">
          <div class="content">
            <div v-if="offer.main_photo" class="img" :style="{backgroundImage: 'url(' + $store.state.settings.assetUrl + '/' + offer.main_photo.file.path_name + ')'}">
              <span v-if="offer.is_argent" class="argent-label img-label">Pilne</span>
              <span v-if="offer.is_promoted" class="promoted-label img-label">Wyróżnione</span>
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
                Rachunki wliczone
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
//.offers {
//  margin: 80px 6vw 80px 6vw;
//  min-height: 290px;
//
//  .slick-slide {
//    display: flex!important;
//    justify-content: center;
//  }
//
//  .slick-prev {
//    left: -25px;
//  }
//
//  .slick-next {
//    right: -25px;
//  }
//
//  .slick-arrow {
//    z-index: 99;
//    &:before {
//      color: #041e15;
//      font-size: 34px;
//    }
//  }
//  .is-active {
//    button {
//      background: #009E79;
//    }
//  }
//  .offers-carousel {
//    margin: 0 6vw;
//    height: 420px;
//  }
//
//  .offer {
//    max-width: 300px;
//    display: flex;
//    flex-direction: column;
//    justify-content: center;
//    align-items: center;
//    text-decoration: none!important;
//    color: unset;
//    border: 0!important;
//    outline: 0!important;
//
//    .bargain {
//      position: absolute;
//      top: 0;
//    }
//
//    .img {
//      height: 200px;
//      width: 280px;
//      background-size: cover;
//      position: relative;
//      overflow: hidden;
//
//      .img-label {
//        -webkit-transform:rotate(-45deg);
//        -moz-transform:rotate(-45deg);
//        transform:rotate(-45deg);
//        left: -50px;
//        top: 30px;
//        position: absolute;
//        font-weight: bold;
//        padding: 10px;
//        width: 200px;
//        display: inline-block;
//        color: #fff;
//        text-align: center;
//      }
//
//      .argent-label {
//        background: red;
//      }
//
//      .promoted-label {
//        background: #009E79;
//      }
//    }
//    .description {
//      margin: 4px 0;
//    }
//    .info {
//      display: flex;
//      justify-content: space-around;
//      align-items: center;
//      margin: 10px 0 0 0;
//      .type, .price {
//        font-weight: bold;
//        text-transform: uppercase;
//      }
//      .type {
//        font-size: 13px;
//      }
//      .badge {
//        text-align: center;
//        border-radius: 14px;
//        background: #f5f5f5;
//        padding: 4px 6px;
//        font-size: 13px;
//        text-transform: lowercase;
//      }
//    }
//    .bottom {
//      display: flex;
//      justify-content: space-between;
//      align-items: center;
//      margin-top: 10px;
//      .location {
//        font-weight: bold;
//        font-size: 13px;
//      }
//    }
//  }
//}
</style>
