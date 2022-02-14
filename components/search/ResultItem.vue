<template>
  <div class="result-item">
    <nuxt-link :to="'/ogloszenia/' + offer.slug" class="offer-link" :event="isLinkActive ? 'click' : ''" target="_blank">
      <div v-if="offer.main_photo" class="main-img" :style="{backgroundImage: 'url(' + $store.state.settings.assetUrl + '/' + offer.main_photo.file.path_name + ')'}" />
      <div v-else class="main-img" :style="{backgroundImage: 'url(https://yko.im/mpWr.png)'}" />
      <div class="title mt-10">
        {{ offer.title }}
      </div>
    </nuxt-link>
    <div class="description mt-10">
      <div class="col1">
        <div class="price pr-10">
          {{ offer.price | offerPrice }}
        </div>
        <div v-if="offer.is_with_bills" class="badge">
          rachunki wliczone
        </div>
      </div>
      <div class="col2">
        <Favorite
          :offer-slug="offer.slug"
          :is-favorite="offer.is_favorite"
          @add-favorite="setFavorite"
          @remove-favorite="removeFavorite"
        />
      </div>
    </div>
    <div class="location mt-10">
      {{ offer.location_name }}
    </div>
  </div>
</template>

<script>
import Favorite from '@/components/Favorite'
export default {
  name: 'ResultItem',
  components: { Favorite },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    isLinkActive: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    offer () {
      return this.item
    }
  },
  methods: {
    setFavorite () {
      this.offer.is_favorite = true
    },
    removeFavorite () {
      this.offer.is_favorite = false
    }
  }
}
</script>

<style lang="scss">
.result-item {
  padding: 5px;
  .main-img {
    width: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    outline: 0;
    height: 0;
    padding-top: 66.66%;
    border-radius: 14px;
  }
  .title {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .description{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .col1 {
      display: flex;
      flex-direction: row;
      align-items: center;
      .price {
        font-size: 12px;
        font-weight: bold;
      }
      .badge {
        height: 10px;
        width: 60px;
        text-align: center;
        border-radius: 14px;
        background: #000000;
        color: #ffffff;
        padding-top: 1px;
        font-size: 6px;
        text-transform: lowercase;
      }
    }
    .col2 {
      .fav {
      }
    }
  }
  .location{
    font-size: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
