<template>
  <div class="search-results">
    <OffersCarousel />
    <div class="container">
      <div class="controls">
        <div class="left">
          <el-select v-model="filter" @change="sortResults($event)">
            <el-option
              label="Latest"
              :value="1"
            />
            <el-option
              label="The oldest"
              :value="2"
            />
            <el-option
              label="Ascending price"
              :value="3"
            />
            <el-option
              label="Price descending"
              :value="4"
            />
          </el-select>
        </div>
        <div class="right">
          <el-button type="primary" @click="openSaveFilters">
            Save the search
          </el-button>
          <el-button type="plane" @click="mapVisible = true">
            Map <i class="el-icon-location-information" />
          </el-button>
          <el-button type="plain" @click="filtersVisible = true" class="filters-btn">
            <div v-if="filtersExists" class="filters-exists" /> Filtry <img src="~/assets/filter-icon.svg" alt="">
          </el-button>
          <el-button type="plain" @click="resetFilters">
            Clear filters
          </el-button>
        </div>
      </div>
      <SearchOffers
        v-loading="loading"
        :offers="offers"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @fetch-offers="searchOffers($event, $route.query)"
      />
      <MapSearch
        v-if="mapVisible"
        :offers="offers"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        :last-page="lastPage"
        :loading-more="loadingMore"
        @close-map="mapVisible = !mapVisible"
        @load-more="loadMore"
        @fetch-offers="saveFilters"
      />
      <!-- <Filters
        :visible="filtersVisible"
        :refresh-filters="refreshFilters"
        @refreshed="refreshFilters = false"
        @close-filters="filtersVisible = false"
        @save="saveFilters"
      /> -->
    </div>
    <SaveFilters
      :visible="saveFiltersVisible"
      @close="saveFiltersVisible = false"
    />
    <div v-if="filtersVisible" class="search-popup">
      <div class="popup-container">
        <div class="close-btn" @click="filtersVisible = false">
          <i class="el-icon-circle-close" />
        </div>
        <AdvancedSearch1
          :only-advanced="true"
          @close="filtersVisible = false"
          @save="saveFilters"
        />
      </div>
    </div>
  </div>
</template>
<script>
import OffersCarousel from '@/components/OffersCarousel'
import SearchOffers from '@/components/search/SearchOffers'
import AdvancedSearch1 from '@/components/home_page/AdvancedSearch1'
import Filters from '@/components/search/Filters'
import SaveFilters from '@/components/search/SaveFilters'
import MapSearch from '@/components/search/MapSearch'
import { search, postrecentsearch } from '@/api/search'

export default {
  name: 'SearchResults',
  components: {
    SearchOffers,
    OffersCarousel,
    Filters,
    SaveFilters,
    MapSearch
  },
  data: () => ({
    saveFiltersVisible: false,
    loadingMore: false,
    mapVisible: false,
    offers: [],
    total: 1,
    pageSize: 10,
    currentPage: 1,
    loading: true,
    filtersVisible: false,
    filter: 1,
    refreshFilters: false,
    sorting: {
      1: { order_by: 'created_at', order: 'DESC' },
      2: { order_by: 'created_at', order: 'ASC' },
      3: { order_by: 'price', order: 'ASC' },
      4: { order_by: 'price', order: 'DESC' }
    },
  }),
  computed: {
    filtersExists () {
      const query = this.$route.query
      if (Object.keys(query).length > 0 && query.page === undefined) {
        return true
      } else if (Object.keys(query).length > 0 && query.page !== undefined) {
        return false
      } else {
        return false
      }
    }
  },
  watch: {
    '$route.query.phrase' () {
      this.searchOffers(1, this.$route.query)
    },
    // '$route.query' () {
    //   this.searchOffers(1, this.$route.query)
    // }
  },
  mounted () {
    this.filter = 1
    const queryWithSearch = Object.assign(this.$data.sorting[this.filter], this.$route.query)
    this.searchOffers(1, queryWithSearch)
    // this.getFilters()

  },
  methods: {
    sortResults () {
      const queryWithSearch = Object.assign(this.$data.sorting[this.filter], this.$route.query)
      this.searchOffers(1, queryWithSearch)
    },
    resetFilters () {
      // this.$router.replace('/szukaj')
      // this.filter = 1
      // const queryWithSearch = Object.assign(this.$data.sorting[this.filter], this.$route.query)
      // this.searchOffers(1, queryWithSearch)
      // this.refreshFilters = true

      this.filter = 1
      this.$router.replace('/szukaj')
      this.$data.sorting[this.filter] = { order_by: 'created_at', order: 'DESC' }
      const queryWithSearch = Object.assign(this.$data.sorting[this.filter], '')
      this.searchOffers(1, queryWithSearch)
      this.refreshFilters = true
    },
    openSaveFilters () {
      if (!this.$store.state.user.isLogged) {
        this.$store.dispatch('user/setLoginFirst', true)
      } else {
        this.saveFiltersVisible = true
      }
    },
    async loadMore (query) {
      this.loadingMore = true
      await this.$router.push({ query })
      const mappedQuery = Object.keys(query).map(key => key + '=' + decodeURIComponent(query[key])).join('&')
      const result = await search(mappedQuery)
      if (result.status === 200) {
        for (const offer of result.data.data) {
          this.offers.push(offer)
        }
        this.total = result.data.total
        this.pageSize = result.data.per_page
        this.currentPage = result.data.current_page
        this.lastPage = result.data.last_page
      }
      this.loadingMore = false
    },
    saveFilters (query) {
      this.$router.push({ query })
      this.searchOffers(1, query)
    },
    async searchOffers (page, query) {
      this.loading = true
      this.$route.query.page = page
      const mappedQuery = Object.keys(query).map(key => key + '=' + decodeURIComponent(query[key])).join('&')
      if (query['location[lat]'] && query['location[lon]'] && query['location[display_name]']) {
        if (this.$store.state.user.isLogged) {
          this.postRecentSearch(query['location[display_name]'], query['location[lat]'], query['location[lon]'])
        } else {
          this.postLocalRecentSearch(query['location[display_name]'], query['location[lat]'], query['location[lon]'])
        }
      }
      const result = await search(mappedQuery)
      if (result.status === 200) {
        this.offers = result.data.data
        this.total = result.data.total
        this.pageSize = result.data.per_page
        this.currentPage = result.data.current_page
        this.lastPage = result.data.last_page
        this.loading = false
      }
    },
    async postRecentSearch (displayName, lat, lon) {
      const obj = {
        display_name: decodeURIComponent(displayName),
        lat: decodeURIComponent(lat),
        lon: decodeURIComponent(lon)
      }
      const result = await postrecentsearch(obj)
      console.log(result.status)
      console.log(result.data)
    },
    postLocalRecentSearch (displayName, lat, lon) {
      const obj = {
        display_name: decodeURIComponent(displayName),
        lat: decodeURIComponent(lat),
        lon: decodeURIComponent(lon)
      }
      const localData = localStorage.getItem('recent_search') ? JSON.parse(localStorage.getItem('recent_search')) : []
      const f = localData.find(f => f.display_name === displayName && f.lat === lat && f.lon === lon)
      console.log(f)
      if (!f) {
        localData.push(obj)
      }
      if (localData.length > 5) {
        localData.splice(0, 1)
      }
      localStorage.setItem('recent_search', JSON.stringify(localData))
    }
  }
}
</script>

<style lang="scss">
.search-results {
  padding-top: 40px;
  .container {
    margin: 0 6vw 40px 6vw;
    .controls {
      display: flex;
      @media only screen and (max-width: 834px) {
        flex-direction: column;
        align-items: center;

        .left {
          margin-bottom: 10px;
        }
      }
      .left, .right {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        .filters-btn {
          width: 100px;
          padding: 12px 10px;
          span {
            display: flex;
            justify-content: space-around;
            align-items: center;

            .filters-exists {
              width: 6px;
              height: 6px;
              background: #00ff85;
              border-radius: 50%
            }
          }
        }
      }
    }
  }

  .search-popup {
  background: rgb(0 0 0 / 75%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 3;

  .popup-container {
    position: relative;
    width: 82%;

    @media only screen and (max-width: 1100px) {
      width: 90%;
    }

    .close-btn {
      position: absolute;
      color: white;
      top: 34px;
      right: -15px;
      font-size: 40px;
      cursor: pointer;

      @media only screen and (max-width: 840px) {
        top: -20px;
      }
    }

    .advanced-search {
      width: 100%;
    }
  }
}
}
</style>
