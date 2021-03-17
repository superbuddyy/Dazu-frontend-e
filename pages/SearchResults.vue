<template>
  <div class="search-results">
    <OffersCarousel />
    <div class="container">
      <div class="controls">
        <div class="left">
          <el-select v-model="filter">
            <el-option
              label="Cena rosnąca"
              :value="1"
            />
            <el-option
              label="Cena malejąco"
              :value="2"
            />
          </el-select>
        </div>
        <div class="right">
          <el-button type="primary" @click="openSaveFilters">
            Zapisz wyszukiwanie
          </el-button>
          <el-button type="plane" @click="mapVisible = true">
            Mapa <i class="el-icon-location-information" />
          </el-button>
          <el-button type="info" @click="filtersVisible = true">
            Filtry <i class="el-icon-setting" />
          </el-button>
        </div>
      </div>
      <SearchOffers
        v-loading="loading"
        :offers="offers"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @fetch-offers="searchOffers"
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
      <Filters
        :visible="filtersVisible"
        @close-filters="filtersVisible = false"
        @save="saveFilters"
      />
    </div>
    <SaveFilters
      :visible="saveFiltersVisible"
      @close="saveFiltersVisible = false"
    />
  </div>
</template>
<script>
import OffersCarousel from '@/components/OffersCarousel'
import SearchOffers from '@/components/search/SearchOffers'
import Filters from '@/components/search/Filters'
import SaveFilters from '@/components/search/SaveFilters'
import MapSearch from '@/components/search/MapSearch'
import { search } from '@/api/search'

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
    filter: 'Cena rosnąca'
  }),
  watch: {
    '$route.query.phrase' () {
      this.searchOffers(1, this.$route.query)
    }
  },
  mounted () {
    this.searchOffers(1, this.$route.query)
  },
  methods: {
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
      const mappedQuery = Object.keys(query).map(key => key + '=' + query[key]).join('&')
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
      const mappedQuery = Object.keys(query).map(key => key + '=' + query[key]).join('&')
      const result = await search(mappedQuery)
      if (result.status === 200) {
        this.offers = result.data.data
        this.total = result.data.total
        this.pageSize = result.data.per_page
        this.currentPage = result.data.current_page
        this.lastPage = result.data.last_page
        this.loading = false
      }
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
      }
    }
  }
}
</style>
