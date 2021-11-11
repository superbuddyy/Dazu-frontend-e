<template>
  <div v-loading="loading" class="offers">
    <flickity v-if="offers.length > 0" ref="flickity" :options="flickityOptions" @init="onInit">
      <div v-for="(offer, index) in offers" :key="index" class="carousel-cell urgent_l offer_l" :class="[ ( offer.subscriptions.length && offer.subscriptions[0]['featured_on_homepage'] === true ) ? 'featured_l' : '' ]">
        <nuxt-link :to="'/ogloszenia/' + offer.slug" class="offer-link">
          <span class="featured_img_label" v-if="offer.subscriptions.length && offer.subscriptions[0]['featured_on_homepage'] === true">
            <img src="~/assets/Star.svg" style="width: 24px;">
          </span>
          <span v-if="offer.is_promoted" class="promoted-label img-label offer_label">Oferta</span>
          <span v-if="offer.is_urgent" class="promoted-label img-label urgent_label">Pilne</span>
          <div v-if="offer.main_photo" class="img" :style="{backgroundImage: 'url(' + $store.state.settings.assetUrl + '/' + offer.main_photo.file.path_name + ')'}">
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
      isPausedForced: false,
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
  computed: {
    isCarouselActive () {
      return !(this.offers.length < 6)
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
    if (!this.isCarouselActive) {
      await this.$store.dispatch('settings/setCarouselPause', true)
    }
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
    },
    async getOffers () {
      const data = [
        {
          id: '48303540-414d-11ec-93d0-f3897da02aec',
          title: 'one',
          slug: 'one',
          description: '',
          price: 5000,
          old_price: 5000,
          status: 'active',
          lat: '223',
          lon: '222',
          location_name: 'Madurai, Madurai District, Tamil Nadu, India',
          note: null,
          links: [],
          refresh_count: 0,
          raise_count: 0,
          raise_at: null,
          created_at: '2021-11-09 12:00',
          created_by: null,
          updated_at: '2021-11-09T11:09:52.000000Z',
          updated_by: null,
          deleted_at: null,
          expire_time: '2021-11-16T11:07:52.000000Z',
          visible_from_date: null,
          category_id: 9,
          user_id: '3ee10690-3229-11ec-8a9b-31cbd9b1aa48',
          has_raise_one: 1,
          has_raise_three: 1,
          has_raise_ten: 1,
          is_bargain: true,
          is_urgent: false,
          subscriptions: [
            {
              id: 2,
              name: 'Standard',
              description: 'none',
              price: 299,
              duration: 168,
              number_of_refreshes: 2,
              refresh_price: 299,
              number_of_raises: 0,
              raise_price: 200,
              created_at: '2021-09-01T00:14:57.000000Z',
              updated_at: '2021-10-04T19:05:14.000000Z',
              config: {
                is_bargain: true,
                is_urgent: true,
                is_promoted: true,
                free_rises: 1,
                free_bumps: 1,
                bump_prices: [
                  '2.99',
                  '3.99',
                  '9.99'
                ]
              },
              bargain_price: 499,
              urgent_price: 499,
              raise_price_three: 399,
              raise_price_ten: 999,
              featured_on_homepage: false,
              featured_on_search_results_and_categories: true,
              pivot: {
                offer_id: '48303540-414d-11ec-93d0-f3897da02aec',
                subscription_id: 2,
                end_date: '2021-11-16 12:07:52'
              }
            }
          ],
          main_photo: null,
          photos: [],
          is_favorite: false,
          is_expired: false,
          type: '',
          is_with_bills: false,
          is_argent: true,
          refresh_price: 0,
          raise_price: 200,
          is_promoted: true,
          user_name: 'tls'
        },
        {
          id: '6f9ddd90-414a-11ec-840b-1320696cd6b9',
          title: 'my first test',
          slug: 'my-first-test',
          description: '<p>hello test</p>',
          price: 50000,
          old_price: 50000,
          status: 'active',
          lat: '223',
          lon: '222',
          location_name: 'Madurai, Madurai District, Tamil Nadu, India',
          note: null,
          links: {
            video: 'undefined',
            video_2: 'undefined',
            walk_video: 'undefined'
          },
          refresh_count: 0,
          raise_count: 0,
          raise_at: null,
          created_at: '2021-11-09 11:00',
          created_by: null,
          updated_at: '2021-11-09T10:55:27.000000Z',
          updated_by: null,
          deleted_at: null,
          expire_time: '2021-11-16T10:47:29.000000Z',
          visible_from_date: null,
          category_id: 9,
          user_id: '3ee10690-3229-11ec-8a9b-31cbd9b1aa48',
          has_raise_one: 1,
          has_raise_three: 1,
          has_raise_ten: 1,
          is_bargain: true,
          is_urgent: true,
          subscriptions: [
            {
              id: 2,
              name: 'Standard',
              description: 'none',
              price: 299,
              duration: 168,
              number_of_refreshes: 2,
              refresh_price: 299,
              number_of_raises: 0,
              raise_price: 200,
              created_at: '2021-09-01T00:14:57.000000Z',
              updated_at: '2021-10-04T19:05:14.000000Z',
              config: {
                is_bargain: true,
                is_urgent: true,
                is_promoted: true,
                free_rises: 1,
                free_bumps: 1,
                bump_prices: [
                  '2.99',
                  '3.99',
                  '9.99'
                ]
              },
              bargain_price: 499,
              urgent_price: 499,
              raise_price_three: 399,
              raise_price_ten: 999,
              featured_on_homepage: true,
              featured_on_search_results_and_categories: true,
              pivot: {
                offer_id: '6f9ddd90-414a-11ec-840b-1320696cd6b9',
                subscription_id: 2,
                end_date: '2021-11-16 11:55:27'
              }
            }
          ],
          main_photo: null,
          photos: [],
          is_favorite: false,
          is_expired: false,
          type: '',
          is_with_bills: false,
          is_argent: false,
          refresh_price: 0,
          raise_price: 200,
          is_promoted: false,
          user_name: 'tls'
        },
        {
          id: '529e15c0-3adb-11ec-9a15-851017ca5d65',
          title: 'test',
          slug: 'test',
          description: '',
          price: 6000,
          old_price: 6000,
          status: 'active',
          lat: '223',
          lon: '222',
          location_name: 'Madurai, Madurai District, Tamil Nadu, India',
          note: null,
          links: [],
          refresh_count: 2,
          raise_count: 0,
          raise_at: null,
          created_at: '2021-11-01 07:00',
          created_by: null,
          updated_at: '2021-11-09T10:58:24.000000Z',
          updated_by: null,
          deleted_at: null,
          expire_time: '2021-11-16T10:30:16.000000Z',
          visible_from_date: null,
          category_id: 12,
          user_id: '3ee10690-3229-11ec-8a9b-31cbd9b1aa48',
          has_raise_one: 1,
          has_raise_three: 1,
          has_raise_ten: 1,
          is_bargain: true,
          is_urgent: true,
          subscriptions: [
            {
              id: 2,
              name: 'Standard',
              description: 'none',
              price: 299,
              duration: 168,
              number_of_refreshes: 2,
              refresh_price: 299,
              number_of_raises: 0,
              raise_price: 200,
              created_at: '2021-09-01T00:14:57.000000Z',
              updated_at: '2021-10-04T19:05:14.000000Z',
              config: {
                is_bargain: true,
                is_urgent: true,
                is_promoted: true,
                free_rises: 1,
                free_bumps: 1,
                bump_prices: [
                  '2.99',
                  '3.99',
                  '9.99'
                ]
              },
              bargain_price: 499,
              urgent_price: 499,
              raise_price_three: 399,
              raise_price_ten: 999,
              featured_on_homepage: true,
              featured_on_search_results_and_categories: true,
              pivot: {
                offer_id: '529e15c0-3adb-11ec-9a15-851017ca5d65',
                subscription_id: 2,
                end_date: '2021-11-16 11:33:12'
              }
            }
          ],
          main_photo: {
            file: {
              original_name: 'O6x1EADD4E2ml0fM.jpeg',
              path_name: 'offers/O6x1EADD4E2ml0fM.jpeg',
              url: 'https://api.dazu.pl/storage/offers/O6x1EADD4E2ml0fM.jpeg'
            },
            path: null,
            description: '',
            created_at: '2021-11-01T06:17:00.000000Z',
            updated_at: '2021-11-01T06:17:00.000000Z',
            offer_id: '529e15c0-3adb-11ec-9a15-851017ca5d65'
          },
          photos: [
            {
              id: 33,
              position: 1,
              file: {
                original_name: 'O6x1EADD4E2ml0fM.jpeg',
                path_name: 'offers/O6x1EADD4E2ml0fM.jpeg',
                url: 'https://api.dazu.pl/storage/offers/O6x1EADD4E2ml0fM.jpeg'
              },
              path: null,
              description: '',
              created_at: '2021-11-01T06:17:00.000000Z',
              updated_at: '2021-11-01T06:17:00.000000Z',
              offer_id: '529e15c0-3adb-11ec-9a15-851017ca5d65'
            }
          ],
          is_favorite: false,
          is_expired: false,
          type: '',
          is_with_bills: false,
          is_argent: false,
          refresh_price: 299,
          raise_price: 200,
          is_promoted: true,
          user_name: 'tls'
        }
      ]
      const result = await index()
      if (result.status === 200) {
        this.offers = result.data.data
        this.loading = false
      }
      this.offers = data
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
    border: 2px solid #FFC500!important;
    border-radius: 5px;
  }
  .carousel-cell.featured_l:hover {
    border: 2px solid #FFC500!important;
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
