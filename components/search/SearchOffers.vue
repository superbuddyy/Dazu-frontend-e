<template>
  <div class="search-offers-list">
    <div class="search-offers-container">
      <div v-if="offers.length === 0">
        No data
      </div>
      <div v-for="offer in offers" :key="offer.id" class="offer margin-box carousel-cell urgent_l offer_l" :class="[ ( offer.subscriptions.length && (offer.subscriptions[0]['name'] === 'Srebrne' || offer.subscriptions[0]['name'] === 'Złote')) ? 'featured_l' : '' ]">
        <div class="content">
          <nuxt-link :to="'/ogloszenia/' + offer.slug" class="offer-link">
            <span class="featured_img_label">
              <el-button v-if="offer.type" class="badge button_offer_type" size="mini">{{offer.type}}</el-button>
            </span>
            <div v-if="offer.main_photo" class="img" :style="{backgroundImage: 'url(' + $store.state.settings.assetUrl + '/' + offer.main_photo.file.path_name + ')'}">
            </div>
            <div v-if="offer.main_photo === null" class="img" :style="{backgroundImage: 'url(https://yko.im/mpWr.png)'}">
            </div>
            <div class="info">
              <div class="price-and-badge">
                <Money
                  :money="offer.price"
                />
                <el-button v-if="offer.is_with_bills" class="badge button_bill_included" size="mini">Bills included</el-button>
                <!-- <span v-if="offer.is_promoted" class="badge">Opportunity</span> -->
                
                <el-button v-if="offer.is_urgent" class="badge button_urgent" size="mini">Urgent</el-button>
              </div>
              <div class="description">
                {{offer.title}}
              </div>
              <div class="location">
                {{ offer.location_name }}
              </div>
            </div>
          </nuxt-link>
          <div class="bottom">
            <div class="user-info">
              <div class="user-img" :style="{backgroundImage: 'url(https://yko.im/mpWr.png)'}"></div>
              <div class="user-name-company">
                <p class="user-name">{{offer.user_name}}</p>
                <p class="user-company">company</p>
              </div>
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
      overflow: hidden;
      &:hover {
        border: 2px solid #f1f1f1;
      }
    }

    .offer {
      max-width: 360px;
      width: 360px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;
      text-decoration: none;
      color: #000000;
      position: relative;
      border: 1px solid #f1f1f1!important;
      &:hover {
        border: 2px solid #f1f1f1!important;
      }
      .bargain {
        position: absolute;
        top: 0;
      }

      .img {
        height: 235px;
        width: 100%;
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
          background: #ff19b7;
        }

      }
      .description {
        margin: 4px 0;
      }
      .info {
        color: #000000;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: left;
        margin: 10px 0 0 0;
        .type, .price-and-badge {
          font-weight: bold;
          text-transform: uppercase;
          display: flex;
        }
      }
      .badge {
        color: white;
        font-weight: 500;
        /* font-family: sans-serif; */
        padding: 4px 8px;
        margin-left: 10px;
      }
      .button_urgent {
        background-color: #F50000;
        
      }
      .button_bill_included {
        background-color: #000000;
      }
      .button_offer_type {
        background-color: #000000;
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        text-align: left;
        width: 100%;
        .user-info {
          display: flex;
          .user-img {
            width: 78px;
            height: 78px;
            background-size: 100% auto;
          }
          .user-name-company {
            display:flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 10px;
            .user-name {
              font-weight: bold;
              font-family: 'Inconsolata';
            }
          }
        }
        .location {
          font-family: 'Inconsolata';
          font-style: normal;
          font-weight: 400;
          font-size: 17px;
          line-height: 21px;
          color: #555555;
        }
      }
    }
  }
  .pagination-section {
    margin-top: 16px;
    text-align: center;
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
    font-family: 'Inconsolata';
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
    left: -56px;
    top: 50px;
    width: 250px;
  }
  .carousel-cell.urgent_l.offer_l .urgent_label{
    left: -50px;
    top: 30px;
    width: 200px;
  }
}
</style>
