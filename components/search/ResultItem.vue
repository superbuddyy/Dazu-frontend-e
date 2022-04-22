<template>
  <div class="result-item">
    <div class="margin-box urgent_l offer_l custom-offer-box" :class="[ ( offer.subscriptions.length && (offer.subscriptions[0]['name'] === 'Srebrne' || offer.subscriptions[0]['name'] === 'Złote') ) ? 'featured_l' : '' ]">
      <nuxt-link :to="'/ogloszenia/' + offer.slug" class="offer-link" :event="isLinkActive ? 'click' : ''">
        <div class="tags pt-10 pb-10 new_custom-offer-div">
          <el-tag v-if="offer.is_urgent" type="danger" class="promoted-label img-label urgent_label custom-new-span1">
            PILNE
          </el-tag>
          <el-tag v-if="offer.is_promoted" type="warn" class="promoted-label img-label offer_label custom-new-span2" :class="[offer.is_urgent ? '' : 'add-offer-mrg']">
            OKAZJA
          </el-tag>
        </div>
        <span class="featured_img_label custom-new-span3" v-if="offer.subscriptions.length && (offer.subscriptions[0]['name'] === 'Srebrne' || offer.subscriptions[0]['name'] === 'Złote')">
          <img src="~/assets/Star.svg" align="right">
        </span>
        <div v-if="offer.main_photo" class="main-img custom-center-image" :style="{backgroundImage: 'url(' + $store.state.settings.assetUrl + '/' + offer.main_photo.file.path_name + ')'}" />
        <div v-else class="main-img custom-center-image" :style="{backgroundImage: 'url(https://yko.im/mpWr.png)'}" />
        <div class="title mt-10 custom-new-title">
          {{ offer.title }}
        </div>
      </nuxt-link>
      <div class="description mt-10 custom-new-description">
        <div class="col1">
          <div class="price pr-10">
            {{ offer.price | offerPrice }}
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
      <el-tag v-if="offer.is_with_bills" type="info" class="custom-new-span4">
        Rachunki wliczone
      </el-tag>
      <div class="location mt-10">
        {{ offer.location_name }}
      </div>
    </div>
  </div>
</template>

<script>
import Favorite from '~/components/Favorite'
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
    border-radius: 5px;
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
      // display: flex;
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
  .urgent_label {
    background-color: #FF4802;
    color: white;
    font-weight: 500;
    border-radius: 3px !important;
  }

  .offer_label {
    background-color: #FFDC07;
    color: black;
    font-weight: 500;
    border-radius: 3px !important;
  }
  .location{
    font-size: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-tag.el-tag--info {
    background: #000000 !important;
    color: #ffffff !important;
    font-size: 11px;
    border-radius: 8px;
  }
  .featured_l {
    border: 2px solid #FFF8E2 !important;
    border-radius: 5px;
  }
  .featured_l:hover {
    border: 2px solid #FFF8E2 !important;
  }
  .margin-box {
    padding: 10px;
    margin: 10px;
    border: 2px solid #ffffff;
    overflow: hidden;
    &:hover {
      border: 2px solid #f1f1f1;
    }
  }
  span.promoted-label.img-label {
    // position: absolute;
    display: inline-block;
    text-align: center;
    z-index: 1;
    text-transform: uppercase;
    position: absolute;
    height: 30px;
    font-size: 10px;
  }
  .margin-box.custom-offer-box{
    margin: 0 auto;
    padding: 5px;
  }

  .margin-box.custom-offer-box .tags.pt-10.pb-10.new_custom-offer-div{
    padding: 0px;
    display: flex;
    align-items: center;
    margin-left: 3px;
    margin-top: 8px;
    justify-content: space-between;
  }

  span.promoted-label.img-label.urgent_label.el-tag.el-tag--danger.el-tag--light.custom-new-span1{
    padding: 0px 5px;
    line-height: 20px;
    height: 21px;
    font-size: 10px;
    border: 1px solid #FF4802;
    background-color: #FF4802;
    color: #ffff;
    font-weight: 700;
    top: 12px;
  }

  span.promoted-label.img-label.offer_label.el-tag.el-tag--warn.el-tag--light.custom-new-span2{
    padding: 0px 5px;
    line-height: 20px;
    height: 21px;
    font-size: 10px;
    background-color: #FFDC07;
    color: #000;
    font-weight: 700;
    border: 1px solid #FFDC07;
    top: 12px;
  }
  .custom-new-span4{
    padding: 0px 5px;
    line-height: 20px;
    height: 21px;
    font-size: 10px
  }

  span.featured_img_label.custom-new-span3 img{
    width: 20px;
    height: 10px;
    margin-right: 0px;
    margin-top: 0px;
  }

  .main-img.custom-center-image{
    max-width: 100%;
    min-height: 170px;
    max-height: 84px;
    padding: 0;
    position: relative;
    display: inline-block;
    top: -20px;
  }

  .title.mt-10.custom-new-title{
    margin-top: -23px !important;
    margin: 0;
  }

  .description.mt-10.custom-new-description{
    margin-top: 2px;
  }
}
.odd {
  span.promoted-label.img-label.urgent_label.el-tag.el-tag--danger.el-tag--light {
    margin-left: 0px;
    top: 21px;
  }
  span.promoted-label.img-label.offer_label.el-tag.el-tag--warn.el-tag--light {
    margin-left: 43px;
    top: 21px;
  }
  .add-offer-mrg {
    margin-left: 8px !important;
  }
  span.featured_img_label {
    position: relative;
    z-index: 1;
    // margin-right: 8px;
    // top: 21px;
  }
}
.even {
  span.promoted-label.img-label.urgent_label.el-tag.el-tag--danger.el-tag--light {
    // right: 265px;
    top: 21px;
    margin-left: 0px;
  }
  span.promoted-label.img-label.offer_label.el-tag.el-tag--warn.el-tag--light {
    // right: 204px;
    top: 21px;
    margin-left: 43px;
  }
  .add-offer-mrg {
    margin-left: 8px !important;
  }
  span.featured_img_label {
    position: relative;
    z-index: 1;
    // right: 6%;
    // top: 21px;
  }
}
span.offer_label.el-tag.el-tag--warn.el-tag--light{
  height: 29px;
  border-radius: 4px;
  border: 0px solid #fff;
  font-size: 11px;
  vertical-align: middle;
  text-align: center;
}

span.urgent_label.el-tag.el-tag--danger.el-tag--light{
  height: 29px;
  border-radius: 4px;
  border: 0px solid #fff;
  font-size: 11px;
  vertical-align: middle;
  text-align: center;
}
</style>
