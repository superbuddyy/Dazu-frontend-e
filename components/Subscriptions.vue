<template>
  <div class="subscriptions-container">
    <div
      v-for="item in items"
      :key="item.id"
      :class="[ active_item === item.id ? 'active sub-box' : 'sub-box' ]"
      @click="setActiveItem(item.id)"
    >
      <el-card class="card-box">
        <div class="card-body">
          <div class="subscription-header">{{ item.name }}</div>
          <div class="bottom clearfix">
            <div class="price">
              <span>{{ item.price / 100 }} <sup>zloty</sup></span>
            </div>
            <b>already {{ item.duration / 24 }} days</b>
          </div>
          <div class="list">
            <div class="list-item" v-if="item.number_of_raises !== 0">
              <i class="el-icon-star-on" /> {{ item.number_of_raises}} darmowe podbicia
            </div>
            <div class="list-item">
              <i class="el-icon-star-on" /> {{ item.number_of_refreshes}} darmowe odświeżenia
            </div>
            <div class="list-item" v-if="item.featured_on_search_results_and_categories === true && item.featured_on_homepage === false">
              <i class="el-icon-star-on" /> wyróżnione w ruchomej galerii w wynikach wyszukiwań i kategoriach
            </div>
            <div class="list-item" v-if="item.featured_on_homepage === true">
              <i class="el-icon-star-on" /> wyróżnione w ruchomej galerii na stronie głównej w wynikach wyszukiwań i kategoriach
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { index } from '@/api/subscriptions'
export default {
  name: 'Subscriptions',
  data () {
    return {
      items: [],
      active_item: null
    }
  },
  mounted () {
    this.getSubscriptions()
  },
  methods: {
    async getSubscriptions () {
      const result = await index()
      this.items = result.data
    },
    setActiveItem (id) {
      this.active_item = id
      this.$emit('set-active-item', id)

      const details = this.items.filter(item => item.id === id)
      this.$emit('selected-details', details[0])
    }
  }
}
</script>

<style lang="scss">
.subscriptions-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
  width: 80%;
  padding: 0 4vw;

  .active {
    box-shadow: 0 0 0 2pt #ff19b7;
  }

  .sub-box {
    margin-bottom: 20px;
  }

  .card-box {
    width: 300px;
    min-height: 340px;
    cursor: pointer;

    .el-card__body {
      padding: 12px;
    }
    .card-body {
      .list {
        height: 72px;
        margin: 26px 0;
        .list-item {
          padding: 2px 20px;
          i {
            font-weight: bold;
            color: #ff19b7;
          }
        }
      }

      .select-button {
        width: 100%;
      }

      .price {
        text-align: center;
        font-weight: bold;
        font-size: 50px;
        color: #ff19b7;
        padding: 20px;
        sup {
          font-size: 12px;
          color: #000000;
        }
      }
      span {
        text-transform: uppercase;
        text-align: left;
      }
      .bottom {
        text-align: center;
      }
      .active-text {
        text-transform: uppercase;
        text-align: center;
        color: #ff19b7;
        margin: 10px 0 0 0;
      }
    }
  }
  .subscription-header {
    text-align: center;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 23px;
    letter-spacing: 1px;
  }
}
</style>
