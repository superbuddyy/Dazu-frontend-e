<template>
  <div class="map-search">
    <el-form
      v-if="Object.keys(search).length > 0"
      ref="form"
      :model="search"
      label-position="top"
      class="filters"
      @submit.prevent=""
    >
      <div class="basic">
        <div class="logo" @click="$router.push('/')">
          Dazu
        </div>
        <el-form-item label="Location" class="location">
          <el-select
            v-model="location"
            class="location-input"
            filterable
            remote
            placeholder="Location"
            :remote-method="getLocations"
            :loading="locationsLoading"
            :debounce="500"
            clearable
            @change="setLocation"
          >
            <el-option
              v-for="loc in locations"
              :key="loc.osm_id"
              :label="loc.display_name"
              :value="loc.lat + '*' + loc.lon + '*' + loc.display_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Category"
          class="category"
        >
          <!-- <el-cascader
            v-model="search.category"
            :options="filters.categories"
            :props="{ expandTrigger: 'hover', label: 'name', value: 'slug', children: 'children', checkStrictly: true }"
            popper-class="category-dropdown"
          /> -->
          <treeselect
            v-model="search.category"
            :multiple="true"
            :options="filters.categories"
            placeholder="Choose"
          />
          <!-- :always-open="true" -->
        </el-form-item>
        <el-form-item
          label="Typ"
          class="type"
        >
          <el-select v-model="search.typ" clearable>
            <el-option v-for="type in filters.types" :key="type.slug" :label="type.name" :value="type.slug" />
          </el-select>
        </el-form-item>
        <div class="search">
          <el-button @click="resetFilters">Clear filters</el-button>
          <el-button type="primary" @click="searchResults()">
            Search
          </el-button>
          <el-button
            v-if="!advancedSearch"
            type="blank"
            icon="el-icon-caret-bottom"
            @click="toggleAdvanced()"
          >
            More
          </el-button>
          <el-button
            v-if="advancedSearch"
            type="blank"
            icon="el-icon-caret-top"
            @click="toggleAdvanced()"
          >
            Collapse
          </el-button>
        </div>
      </div>
      <transition name="fade" mode="out-in">
        <div v-show="advancedSearch" class="advanced">
          <div class="third-line-filters">
            <div class="attribute-filters">
              <div class="price">
                <div class="label">
                  Price
                </div>
                <el-select v-model="search.price.min" placeholder="Minimal" filterable clearable>
                  <el-option
                    v-for="item in filters.price.min"
                    :key="item"
                    :label="item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')"
                    :value="item"
                  />
                </el-select>
                <el-select v-model="search.price.max" placeholder="Maximal" filterable clearable>
                  <el-option
                    v-for="item in filters.price.max"
                    :key="item"
                    :label="item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')"
                    :value="item"
                  />
                </el-select>
              </div>
              <div class="meters">
                <div class="label">
                  Sq.m
                </div>
                <el-select v-model="search['meter'].min" placeholder="Minimal" filterable clearable>
                  <el-option
                    v-for="item in filters.attributes['meter'].min"
                    :key="item"
                    :label="item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')"
                    :value="item"
                  />
                </el-select>
                <el-select v-model="search['meter'].max" placeholder="Maximal" filterable clearable>
                  <el-option
                    v-for="item in filters.attributes['meter'].max"
                    :key="item"
                    :label="item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')"
                    :value="item"
                  />
                </el-select>
              </div>
              <div v-for="filter in filters.attributes2" :key="filter.id" class="attr-filter">
                <AttributeFilter
                  v-if="!excludedIds.includes(filter.id)"
                  :type="filter.type"
                  :name="filter.name"
                  :slug="filter.slug"
                  :options="filter.options"
                  @change="setAttributeValue(filter.slug, $event)"
                />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </el-form>
    <div class="map-box">
      <l-map ref="map" :zoom="zoom" :center="center" class="map" :options="{zoomControl: false}">
        <l-tile-layer :url="mapStyle" />
        <l-control-zoom position="bottomleft" />
        <l-marker
          v-for="offer in offers"
          :key="offer.id"
          :ref="`marker-${offer.id}`"
          :lat-lng="[offer.lat, offer.lon]"
        >
          <l-popup class="map-popup">
            <!-- @click.native="openOffer(offer.slug)"> -->
            <div class="l-popup-content">
              <!-- <div class="title">
                {{ offer.title }}
              </div>
              <Money
                :money="offer.price"
              /> -->
              <ResultItem
                :item="offer"
                :is-link-activer="false"
              />
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
    <div v-if="!offersVisible" class="show-offers" @click="offersVisible = !offersVisible">
      <i class="el-icon-s-unfold" />
    </div>
    <div v-if="offers && offersVisible" v-infinite-scroll="loadOffers" infinite-scroll-delay="500" class="map-offers">
      <div class="close" @click="closeOffers">
        <span>
          Close
          <i class="el-icon-close" />
        </span>
      </div>
      <div
        v-for="offer in offers"
        :key="offer.id"
        @click="setCenter(offer.lat, offer.lon, offer.id)"
      >
        <div :class="[ active === offer.id ? 'map-offer active' : 'map-offer' ]">
          <div v-if="offer.main_photo" class="img" :style="{backgroundImage: 'url(' + $store.state.settings.assetUrl + '/' + offer.main_photo.file.path_name + ')'}" />
          <div v-if="offer.main_photo === null" class="img" :style="{backgroundImage: 'url(https://yko.im/mpWr.png)'}" />
          <img v-if="offer.bargain" src="~/assets/offer.svg" alt="" class="bargain">
          <div class="info">
            <div class="description">
              {{ offer.title }}
            </div>
            <div class="details">
              <div class="price">
                <Money
                  :money="offer.price"
                />
              </div>
              <div class="tags">
                <el-tag v-if="offer.is_promoted" type="warn" class="offer_label">
                  OPPORTUNITY
                </el-tag>
                <el-tag v-if="offer.is_urgent" type="danger" class="urgent_label">
                  URGENT
                </el-tag>
              </div>
              <div class="type">
                {{ offer.type }}
              </div>
            </div>
          </div>
          <div class="favorite">
            <Favorite
              :offer-slug="offer.slug"
              :is-favorite="offer.is_favorite"
              @add-favorite="setFavorite"
              @remove-favorite="removeFavorite"
            />
            <nuxt-link :to="'/ogloszenia/' + offer.slug">
              <el-button type="primary">
                Look
              </el-button>
            </nuxt-link>
          </div>
        </div>
      </div>
      <p v-if="loadingMore" class="loading-more">
        Landing...
      </p>
    </div>
    <div class="map-buttons">
      <el-button type="primary" @click="openSaveFilters">
        Save the search
      </el-button>
      <el-button @click="closeMap">
        Exit map view
      </el-button>
    </div>
    <SaveFilters
      :visible="saveFiltersVisible"
      :show-bg="false"
      @close="saveFiltersVisible = false"
    />
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getLocation } from '@/api/osm'
import { getFilters } from '@/api/search'
import Favorite from '@/components/Favorite'
import SaveFilters from '@/components/search/SaveFilters'
import { buildSearchQuery, fromSearchQueryStringToFromData } from '@/helpers'
import AttributeFilter from '@/components/Filters/AttributeFilter'
import { setSearchDefaultData } from '../../helpers'
import ResultItem from '~/components/search/ResultItem'
export default {
  name: 'MapSearch',
  components: {
    Treeselect,
    Favorite,
    SaveFilters,
    AttributeFilter,
    ResultItem
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
    },
    lastPage: {
      type: Number,
      default () {
        return 99
      }
    },
    loadingMore: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      lastOpen: null,
      excludedIds: [1, 2, 3, 4, 14, 19, 22, 23, 46, 47, 48, 55, 21, 5, 26, 27, 28 ,24, 25],
      saveFiltersVisible: false,
      active: '',
      advancedSearch: false,
      offersVisible: true,
      firstLoad: false,
      zoom: 7,
      center: [51.9189046, 19.1343786],
      search: setSearchDefaultData(),
      locations: [],
      location: '',
      locationsLoading: false,
      filters: {
        price: {
          min: [],
          max: []
        },
        attributes: {
          meter: {
            min: [],
            max: []
          }
        }
      }
    }
  },
  computed: {
    mapStyle () {
      return this.$config.mapStyle
    },
    priceMaxFilters () {
      if (this.search.price.min === null) {
        return this.$store.state.storage.filters.price.max
      }
      return this.filters.price.max.filter(price => price >= this.search.price.min)
    },
    priceMinFilters () {
      if (this.search.price.max === null) {
        return this.$store.state.storage.filters.price.min
      }
      return this.filters.price.min.filter(price => price <= this.search.price.max)
    },
    meterMaxFilters () {
      if (this.search.meter.min === null) {
        return this.$store.state.storage.filters.attributes.meter.max
      }
      return this.filters.attributes.meter.max.filter(size => size >= this.search.meter.min)
    },
    meterMinFilters () {
      if (this.search.meter.max === null) {
        return this.$store.state.storage.filters.attributes.meter.min
      }
      return this.filters.attributes.meter.min.filter(size => size <= this.search.meter.max)
    }
  },
  watch: {
    offers (value) {
      if (value.length > 0 && this.firstLoad === true) {
        this.firstLoad = true
        this.$refs.map.mapObject.fitBounds(value.map((m) => { return [m.lat, m.lon] }))
      }
    }
  },
  mounted () {
    this.getFilters()
    this.search = fromSearchQueryStringToFromData(this.$route.query)
    if (this.search.location.lat !== null && this.search.location.lon !== null) {
      this.locations = [{ lat: this.search.location.lat, lon: this.search.location.lon, display_name: this.search.location.display_name }]
      this.setLocation(this.locations[0].lat + '*' + this.locations[0].lon + '*' + this.locations[0].display_name)
    }
  },
  methods: {
    openOffer (offerSlug) {
      this.$router.push('ogloszenia/' + offerSlug)
    },
    resetFilters () {
      this.$router.replace({ query: null })
      this.search = {}
      this.search = setSearchDefaultData()
      this.location = ''
      this.searchResults()
    },
    setAttributeValue (slug, value) {
      this.search[slug] = value
    },
    openSaveFilters () {
      if (!this.$store.state.user.isLogged) {
        this.$store.dispatch('user/setLoginFirst', true)
      } else {
        this.saveFiltersVisible = true
      }
    },
    closeOffers () {
      this.offersVisible = false
    },
    toggleAdvanced () {
      this.advancedSearch = !this.advancedSearch
    },
    searchResults () {
      this.$emit('fetch-offers', buildSearchQuery(this.search))
      this.advancedSearch = false
    },
    loadOffers () {
      if (this.currentPage < this.lastPage) {
        const query = this.$route.query
        query.page = this.currentPage + 1
        this.$emit('load-more', query)
      }
    },
    closeMap () {
      this.$emit('close-map')
    },
    setCenter (lat, lon, id) {
      this.active = id
      if (this.$refs.map) {
        this.$refs.map.mapObject.setView([lat, lon], 16)
        if (this.lastOpen) {
          this.lastOpen.closePopup()
        }
        const popupId = `marker-${id}`
        this.$refs[popupId][0].mapObject.openPopup()
        this.lastOpen = this.$refs[popupId][0].mapObject
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
    },
    async getLocations (locationName) {
      if (locationName !== '') {
        this.locationsLoading = true
        const locations = await getLocation(locationName)
        if (locations.data) {
          this.locationsLoading = false
          this.locations = locations.data.filter((item) => {
            return item.display_name.toLowerCase()
          })
        }
      } else {
        this.locations = []
      }
    },
    setLocation (e) {
      this.search.location = {}
      this.location = e
      if (e) {
        const coords = e.split('*')
        this.search.location.lat = coords[0]
        this.search.location.lon = coords[1]
        this.search.location.display_name = coords[2]
      } else {
        this.search.location.lat = null
        this.search.location.lon = null
        this.search.location.display_name = null
      }
    },
    async getFilters () {
      const result = await getFilters()
      if (result.status === 200) {
        result.data.categories = await result.data.categories.map((item) => {
          const itemObj = {}
          itemObj.label = item.name
          itemObj.id = item.slug
          if (item.children && item.children.length) {
            itemObj.children = item.children.map((child) => {
              const childObj = {}
              childObj.label = child.name
              childObj.id = child.slug
              return childObj
            })
          } else {
            itemObj.children = []
          }
          return itemObj
        })
        await this.$store.dispatch('storage/setFilters', result.data)
        this.filters = result.data
        console.log(this.filters)
      }
    }
  }
}
</script>

<style lang="scss">
.map-search {
  position: fixed;
  height: 100vh;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 99;

  .filters {
    display: flex;
    flex-direction: column;
    color: #ffffff;
    padding: 20px;
    align-items: center;
    justify-content: space-around;
    background: #041e15;
    position: fixed;
    width: 100%;
    z-index: 9999;

    .basic {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
    }
    .category {
      width: 20%;
    }

    .third-line-filters {
    height: 20%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    .price,
    .meters,
    .other {
      margin: 4px 15px;
    }

    @media only screen and (max-width: 1100px) {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      width: 100%;
      margin: 0 auto;
    }

    .attribute-filters {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      @media only screen and (max-width: 560px) {

        .attr-filter,
        .price,
        .meters,
        .other {
          width: 100%;

          .el-select {
            width: 100%;
          }
        }
      }
    }

    .el-checkbox {
      color: #ffffff;
    }
  }

    .advanced {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      margin: 20px 0 0 0;

      .advanced-line {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
      }
    }

    .logo {
      font-weight: bold;
      font-size: 2em;
      color: #ff19b7;
      cursor: pointer;
      text-align: left;
    }

    label {
      line-height: 20px;
      padding: 0;
      color: #ffffff;
    }

    .input-box {
      display: flex;

      .el-input {
        width: 90%;
      }
    }

    .search {
      display: flex;
      align-items: center;

      span {
        font-size: 16px;
        margin-top: 6px;
      }
      button {
        margin-top: 20px;
      }
    }

    .el-form-item {
      margin-bottom: 0;
    }
  }

  .map-box {
    background: #ffffff;
    width: 100%;
    height: calc(100vh - 102px);
    margin-top: 102px;

    .map {
      width: 100%;
      height: calc(100vh - 102px);
    }

    .map-popup {
      min-width: 100px;
      cursor: pointer;
    }

    .l-popup-content {
      .title, .price {
        text-align: left;
      }
    }
  }

  .show-offers {
    z-index: 999;
    background: #ffffff;
    position: absolute;
    top: 122px;
    left: 0;
    font-size: 30px;
    padding: 10px;
    border: 1px solid #000000;
    cursor: pointer;
  }

  .map-offers {
    overflow-y: scroll;
    z-index: 999;
    width: 25%;
    min-width: 475px;
    height: 600px;
    background: #ffffff;
    position: absolute;
    top: 122px;
    left: 0;

    .close {
      text-align: right;
      padding: 10px;
      font-size: 14px;
      border-bottom: 1px solid #f5f5f5;
      span {
        cursor: pointer;
        i {
          margin-left: 6px;
        }
      }
    }

    .loading-more {
      text-align: center;
      padding: 10px;
    }

    a {
      text-decoration: none;
      color: #000000;
    }

    .active {
      background: #E4E4E4;
    }

    .map-offer {
      position: relative;
      display: flex;
      height: 90px;
      min-height: 126px;
      cursor: pointer;
      font-size: 14px;
      padding: 10px;

      &:hover {
        background: #E4E4E4;
      }

      .details {
        display: flex;
        justify-content: space-around;
        .urgent_label {
          background: #FF4800 !important;
          color: #fff !important;
          // border-radius: 20px;
        }
        .offer_label {
          background: #FFE000 !important;
          color: #000 !important;
          // border-radius: 20px;
        }
      }

      .bargain {
        position: absolute;
        width: 70px;
        height: 70px;
        top: 0;
        left: 0;
      }

      .img {
        width: 90px;
        height: 70px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }

      .info {
        display: flex;
        flex-direction: column;
        width: calc(100% - 120px - 20px);
        padding: 10px;
        justify-content: space-between;
        .price {
          flex: 1;
        }
        .type {
          flex: 1;
          text-align: center;
        }
      }

      .favorite {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        button {
          padding: 6px 10px;
          font-size: 14px;
        }
      }
    }
  }

  .map-buttons {
    z-index: 999;
    position: absolute;
    top: 122px;
    right: 10px;
    display: flex;
  }
}
</style>
