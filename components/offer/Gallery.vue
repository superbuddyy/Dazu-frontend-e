<template>
  <div :class="[fullScreen ? 'gallery full-screen' : 'gallery' ]">
    <div v-if="fullScreen" class="close" @click="fullScreen = false">
      <i class="el-icon-circle-close" />
    </div>
    <VueSlickCarousel
      ref="main"
      :as-nav-for="$refs.subGallery"
      :focus-on-select="true"
      :arrows="true"
      :autoplay="false"
      @beforeChange="syncSliders"
    >
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="main-img"
        :style="{backgroundImage: 'url(' + $store.state.settings.assetUrl + '/' + photo.path_name + ')'}"
        @click="fullScreen = true"
      >
        <h1 v-if="isExpired" class="exp-flag">NIEAKTUALNE</h1>
      </div>
    </VueSlickCarousel>
    <VueSlickCarousel
      ref="subGallery"
      :as-nav-for="$refs.main"
      :slides-to-show="5"
      :focus-on-select="true"
      class="sub-gallery"
      @beforeChange="syncSliders"
    >
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="min-img"
        :style="{backgroundImage: 'url(' + $store.state.settings.assetUrl + '/' + photo.path_name + ')'}"
      />
    </VueSlickCarousel>
  </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  name: 'Gallery',
  components: {
    VueSlickCarousel
  },
  props: {
    mainPhoto: {
      type: Object,
      default () {
        return {
          file: ''
        }
      }
    },
    photos: {
      type: Array,
      default () {
        return [
          { file: '' }
        ]
      }
    },
    projectPlans: {
      type: Array,
      default () {
        return [
          { file: '' }
        ]
      }
    },
    isExpired: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      fullScreen: false,
      settings: {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 0,
        arrows: true
      }
    }
  },
  mounted () {
    if (this.projectPlans) {
      this.photos = this.photos.concat(this.projectPlans)
    }
  },
  methods: {
    zoomImage (path) {
      this.fullImagePath = path
    },
    close () {
      this.fullImagePath = null
    },
    syncSliders (currentPosition, nextPosition) {
      this.$refs.subGallery.next()
      this.$refs.main.next()
    }
  }
}
</script>

<style lang="scss">
.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  width: 100%!important;
  height: 100vh!important;
  background: rgb(0 0 0 / 90%);
  padding: 20px 0;

  .close {
    position: absolute;
    top: 6px;
    right: 10px;
    color: white;
    font-size: 30px;
    cursor: pointer;
    z-index: 9999;
  }
  .main-img {
    height: 96vh !important;
    background-size: contain!important;
  }

  .sub-gallery {
    display: none;
  }

}

.gallery {
  .slick-arrow {
    background: #000000d9;
    z-index: 2;
    height: 40px;
    width: 24px;
  }

  .slick-prev {
    left: 0;
  }

  .slick-next {
    right: 0;
  }

  .main-img {
    height: 600px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    outline: 0;
  }

  .min-img {
    height: 100px;
    width:33.33333%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    outline: 0;
  }
  .exp-flag {
    color: #f1f1f1;
    text-align: center;
    position: relative;
    top: 50%;
  }
}
</style>
