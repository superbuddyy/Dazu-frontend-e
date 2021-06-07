<template>
  <div class="search-offers-list">
    <div class="search-offers-container">
      <div v-if="offers.length === 0">
        Brak danych
      </div>
      <div v-for="offer in offers" :key="offer.id" class="offer margin-box">
        <div class="content">
          <nuxt-link :to="'/ogloszenia/' + offer.slug" class="offer">
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
              <div class="type">
                {{ offer.type }}
              </div>
              <div v-if="offer.is_with_bills" class="badge">
                Rachunki wliczone
              </div>
            </div>
          </nuxt-link>
        </div>
        <div class="bottom">
          <div class="location">
            {{ offer.location_name }}
          </div>
          <Favorite
            v-if="$store.state.user.isLogged"
            :offer-slug="offer.slug"
            :is-favorite="offer.is_favorite"
            @add-favorite="setFavorite"
            @remove-favorite="removeFavorite"
          />
        </div>
      </div>
    </div>
    <el-pagination
      background
      class="pagination-section"
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage"
    />
  </div>
</template>

<script>
import Favorite from '@/components/Favorite'
import Money from '@/components/Money'

export default {
  name: 'SearchOffers',
  components: {
    Favorite,
    Money
  },
  props: {
    offers: {
      type: Array,
      default () {
        return []
      }
    },
    total: {
      type: Number,
      default () {
        return 1
      }
    },
    pageSize: {
      type: Number,
      default () {
        return 25
      }
    },
    currentPage: {
      type: Number,
      default () {
        return 1
      }
    }
  },
  data () {
    return {
      //
    }
  },
  methods: {
    changePage (page) {
      this.$router.push({ query: { page } })
      this.$emit('fetch-offers', page)
      window.scrollTo(0, 0)
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
.search-offers-list {
  margin-top: 10px;
  .search-offers-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 20vh;

    .margin-box {
      padding: 10px;
      margin: 10px;
      border: 2px solid #ffffff;
      &:hover {
        border: 2px solid #f1f1f1;
      }
    }

    .offer {
      max-width: 320px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;
      text-decoration: none;
      color: #000000;
      position: relative;

      .bargain {
        position: absolute;
        top: 0;
      }

      .img {
        height: 200px;
        width: 300px;
        background-size: cover;
        background-position: center;
        position: relative;
        overflow: hidden;

        .img-label {
          -webkit-transform:rotate(-45deg);
          -moz-transform:rotate(-45deg);
          transform:rotate(-45deg);
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
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 10px 0 0 0;
        .type, .price {
          font-weight: bold;
          text-transform: uppercase;
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
        .location {
          font-weight: bold;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .pagination-section {
    margin-top: 16px;
    text-align: center;
  }
}
</style>
