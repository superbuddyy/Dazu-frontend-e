<template>
  <div>
    <!-- <el-dialog
      title="Ustaw filtry"
      :visible.sync="visible"
      :before-close="close"
      :style="[visible ? { 'max-height': 'unset' } : { 'max-height': '100px' }]"
    > -->
    <div
    :style="[visible ? { 'max-height': 'unset' } : { 'max-height': '100px' }]"
    class="advanced-search"
    >
    <treeselect v-model="search.category" :multiple="true" :options="filters.categories" placeholder="Wybierz" />

      <el-form v-if="Object.keys(filters).length > 0" :label-position="'top'" :model="filters">
    <treeselect v-model="search.category" :multiple="true" :options="filters.categories" placeholder="Wybierz" />
        
        <div class="first-line">
          
          <el-form-item label="Kategoria" prop="category">

          </el-form-item>
          <el-form-item label="Typ" prop="type">
            <el-select v-model="search.typ" clearable>
              <el-option v-for="type in filters.types" :key="type.slug" :label="type.name" :value="type.slug" />
            </el-select>
          </el-form-item>
          <el-form-item label="Lokalizacja" prop="location">
            <el-select v-model="location" class="location-input" filterable remote placeholder="Lokalizacja"
              :remote-method="getLocations" :loading="locationsLoading" :debounce="500" clearable @change="setLocation">
              <el-option v-for="loc in locations" :key="loc.osm_id" :label="loc.display_name"
                :value="loc.lat + '*' + loc.lon + '*' + loc.display_name" />
            </el-select>
          </el-form-item>
        </div>
        <div class="third-line-filters">
          <div class="attribute-filters">
            <div class="price">
              <div class="label">
                Cena
              </div>
              <el-select v-model="search.price.min" placeholder="Minimalna" filterable clearable>
                <el-option v-for="item in filters.price.min" :key="item"
                  :label="item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')" :value="item" />
              </el-select>
              <el-select v-model="search.price.max" placeholder="Maksymalna" filterable clearable>
                <el-option v-for="item in filters.price.max" :key="item"
                  :label="item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')" :value="item" />
              </el-select>
            </div>
            <div class="meters">
              <div class="label">
                Metraż
              </div>
              <el-select v-model="search['metraz'].min" placeholder="Minimalna" filterable clearable>
                <el-option v-for="item in filters.attributes['metraz'].min" :key="item"
                  :label="item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')" :value="item" />
              </el-select>
              <el-select v-model="search['metraz'].max" placeholder="Maksymalna" filterable clearable>
                <el-option v-for="item in filters.attributes['metraz'].max" :key="item"
                  :label="item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')" :value="item" />
              </el-select>
            </div>
            <div v-for="filter in filters.attributes2" :key="filter.id" class="attr-filter">
              <AttributeFilter v-if="!excludedIds.includes(filter.id)" :type="filter.type" :name="filter.name"
                :slug="filter.slug" :options="filter.options" @change="setAttributeValue(filter.slug, $event)" />
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close()">Zamknij</el-button>
        <el-button type="primary" icon="el-icon-right" @click="save()">Szukaj</el-button>
      </span>
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getFilters, getrecentsearch, deleterecentsearch } from '@/api/search'
import { getLocation } from '@/api/osm'
import { buildSearchQuery, fromSearchQueryStringToFromData } from '@/helpers'
import AttributeFilter from '@/components/Filters/AttributeFilter'
import { getCategories } from '@/api/search'


const data = [
  {
    value: '1',
    label: 'Level one 1',
    children: [
      {
        value: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            value: '1-1-1',
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: 'Level one 2',
    children: [
      {
        value: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            value: '2-1-1',
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        value: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            value: '2-2-1',
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    value: '3',
    label: 'Level one 3',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        value: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            value: '3-2-1',
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]


export default {
  name: 'Filters',
  components: {
    Treeselect,
    AttributeFilter
  },
  props: {
    visible: {
      type: Boolean,
      default() {
        return false
      }
    },
    refreshFilters: {
      type: Boolean,
      default() {
        return false
      }
    },
  },
  data() {
    return {
      // excludedIds: [1, 3, 4, 9, 14],
      excludedIds: [1, 2, 3, 4, 5, 9, 14, 21, 22, 23, 24, 25, 26, 27, 28],
      locationsLoading: false,
      locations: [],
      filters: this.getFilters(),
      filterss: {
        categories: [

        ]
      },
      search: {
        category: null
      },
      location: '',
      // filterss: {
      //   categories: [
      //     {
      //       id: 2,
      //       label: 'asdf',
      //       children: [
      //         {
      //           id: 4,
      //           label: 'asdfsaf'
      //         },
      //         {
      //           id: 5,
      //           label: 'asdfsaf'
      //         },
      //         {
      //           id: 6,
      //           label: 'asdfsaf'
      //         },
      //       ]
      //     },
      //     {
      //       id: 7,
      //       label: 'asdf',
      //       children: [
      //         {
      //           id: 8,
      //           label: 'asdfsaf'
      //         },
      //         {
      //           id: 9,
      //           label: 'asdfsaf'
      //         },
      //         {
      //           id: 10,
      //           label: 'asdfsaf'
      //         },
      //       ]
      //     },
      //     {
      //       id: 8,
      //       name: 'asdf',
      //       children: [
      //         {
      //           id: 11,
      //           name: 'asdfsaf'
      //         },
      //         {
      //           id: 12,
      //           name: 'asdfsaf'
      //         },
      //         {
      //           id: 13,
      //           name: 'asdfsaf'
      //         },
      //       ]
      //     },
      //   ]
      // }
    }
  },
  watch: {
    refreshFilters(value) {
      if (value) {
        // this.search = {}
        this.search = fromSearchQueryStringToFromData({})
        this.setLocation(false)
        this.locations = []
        this.location = ''
        this.$emit('refreshed')
      }
    }
  },
  mounted() {
    this.search = fromSearchQueryStringToFromData(this.$route.query)
    if (this.search.location.lat !== null && this.search.location.lon !== null) {
      this.locations = [{
        lat: this.search.location.lat,
        lon: this.search.location.lon,
        display_name: this.search.location.display_name
      }]
      this.setLocation(this.locations[0].lat + '*' + this.locations[0].lon + '*' + this.locations[0].display_name)
    }
  },
  methods: {
    loadOptions({ action, parentNode, callback }) {

    },
    setAttributeValue(slug, value) {
      this.search[slug] = value
    },
    close() {
      this.$emit('close-filters')
    },
    save() {
      this.$emit('save', buildSearchQuery(this.search))
      this.$emit('close-filters')
    },
    async getCategories() {
      const result = await this.getCategories()
      console.log(result)
      if (result.status === 200) {
        console.log(result)
      }
    },
    async getFilters() {
      const result = await getFilters()
      if (result.status === 200) {
        // this.filters = result.data
        result.data.categories = await result.data.categories.map((item) => {
          item.label = item.name
          item.id = item.slug
          if (item.children && item.children.length) {
            item.children.map((child) => {
              child.label = child.name
              child.id = child.slug
              return child
            })
          } else {
            item.children = []
          }
          return item
        })
        this.filters = result.data
      }
    },
    async getLocations(locationName) {
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
    setLocation(e) {
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
    async getRecentSearch() {
      console.log('test')
      const result = await getrecentsearch()
      console.log(result.status)
      console.log(result.data)
      if (result.status === 200) {
        this.locations = result.data
      }
    },
    async deleteRecentSearch() {
      const result = await deleterecentsearch()
      console.log(result.status)
      console.log(result.data)
    }
  }
}
</script>

<style lang="scss">
.advanced-search {
  background-color: rgba(4, 30, 21, .8);
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: 86px 0 20px 0;
  color: #fff;
  padding: 30px;
  transition: 0.5s ease;
  // overflow: hidden;

  @media only screen and (max-width: 1640px) {
    width: 90%;
  }

  @media only screen and (max-width: 1300px) {
    padding: 20px 10px;
  }

  @media only screen and (max-width: 1100px) {
    width: 60vw;
    max-height: unset !important;
  }

  @media only screen and (max-width: 834px) {
    width: 90vw;
  }

  .vue-treeselect {
    width: 23% !important;
  }
.first-line {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 90%;
    margin: 0 auto;
    height: 40%;

    @media only screen and (max-width: 1300px) {
      width: 100%;
    }

    @media only screen and (max-width: 1100px) {
      flex-direction: column;

      .el-cascader,
      .el-select {
        margin-bottom: 5px;
        width: 100%;
      }

      .label {
        margin-bottom: 10px;
        text-transform: uppercase;
      }

      button,
      .advanced-btn {
        width: 100% !important;
        margin-bottom: 10px;
        margin-left: 0;
      }
    }

    @media only screen and (max-width: 834px) {

      .el-cascader,
      .el-select {
        margin-bottom: 10px;
      }
    }
  }

.other-filters {
  display: flex;
  justify-content: space-around;
  align-items: center;

  .el-select {
    width: 90%;
  }
}

.third-line-filters {
  display: flex;
  justify-content: center;
  align-items: center;

  .attribute-filters {
    display: flex;
    flex-wrap: wrap;

    .price,
    .meters,
    .other {
      margin: 4px 15px;
    }
  }
}
}
</style>
