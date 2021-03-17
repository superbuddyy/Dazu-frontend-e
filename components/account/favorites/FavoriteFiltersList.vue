<template>
  <div class="favorite-filters">
    <div v-for="searchFilter in filters" :key="searchFilter.id" class="filters-list">
      <div class="filter">
        <div class="check">
          <el-checkbox :value="getCheckedIndex(searchFilter.id) !== -1" @change="addToChecked(searchFilter.id)" />
        </div>
        <div class="filters-container">
          <div class="filters-values">
            <div v-for="(filter, index) in searchFilter.filters" :key="index" class="f-value">
              <span>{{ showFilterValue(index, filter) }}</span>
            </div>
          </div>
          <el-checkbox :value="searchFilter.notification">
            Chcę otrzymywać powiadomienia email
          </el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { index } from '@/api/filters'
import { fromSearchQueryStringToFromData } from '@/helpers'

export default {
  name: 'FavoriteFiltersList',
  data () {
    return {
      filters: [],
      checked: []
    }
  },
  mounted () {
    this.getFavoriteFilters()
  },
  methods: {
    showFilterValue (key, value) {
      switch (key) {
        case 'category':
          return 'Kategoria: ' + value
        case 'typ':
          return 'Typ: ' + value
        case 'na-raty':
          return 'Na raty: ' + value
      }
    },
    transformedFilters (filters) {
      return fromSearchQueryStringToFromData(JSON.parse(filters))
    },
    getCheckedIndex (id) {
      return this.checked.indexOf(id)
    },
    addToChecked (id) {
      const index = this.getCheckedIndex(id)
      if (index === -1) {
        this.checked.push(id)
      } else {
        this.checked.splice(this.checked.indexOf(id), 1)
      }
    },
    async getFavoriteFilters () {
      const result = await index()
      if (result.status === 200) {
        this.filters = result.data.data.map((f) => {
          f.filters = this.transformedFilters(f.filters)
          return f
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .favorite-filters {
    width: 80%;
    .filters-list {
      display: flex;
      justify-content: center;
      flex-direction: column;
      .filter {
        padding: 10px;
        border: 1px solid #000000;
        display: flex;
        justify-content: center;
        align-items: center;

        .check {
          width: 10%;
          text-align: center;
        }

        .filters-values {
          width: 90%;
          display: flex;
          flex-wrap: wrap;
          .f-value {
            background: #f5f5f5;
            padding: 4px 6px;
            border-radius: 6px;
            margin: 4px;
            font-size: 14px;
            font-weight: bold;
            span {
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
</style>
