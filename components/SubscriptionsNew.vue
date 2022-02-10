<template>
  <div class="homepage-subscription-list" :class="[ !isDialog ? 'homepage-subscription-list--wdt' : '' ]">
    <div class="container-account-types">
      <div
        v-for="(subscription, index) in items"
        :key="subscription.id"
        :class="[ active_item === subscription.id ? 'active sub-box' : 'sub-box' ]"
      @click="setActiveItem(subscription.id)"
      >
        <el-card :class="[`card-box subscription-box-${index}`]">
          <div class="card-body">
            <div class="subscription-header">
              {{ subscription.name }}
            </div>
            <div class="bottom clearfix">
              <div class="price">
                <span>{{ subscription.price / 100 }} <sup> zł</sup></span>
              </div>
              <b>na {{ subscription.duration / 24 }} dni</b>
              <div class="list subscription-options">
                <div
                  v-if="
                    (subscription.number_of_raises !== 0 && subscription.number_of_raises !== '0')
                      || (subscription.number_of_refreshes !== 0 && subscription.number_of_refreshes !== '0')
                  "
                  class="starred"
                >
                  <div v-if="subscription.number_of_raises !== 0 && subscription.number_of_raises !== '0'" class="list-item">
                    <i class="el-icon-star-on" /> {{ subscription.number_of_raises }}
                    <span v-if='subscription.number_of_raises === 1'>darmowe podbicie</span>
                    <span v-else-if='subscription.number_of_raises > 1 && subscription.number_of_refreshes < 5'>darmowe podbicia</span>
                    <span v-else-if='subscription.number_of_raises >= 5'>darmowych podbić</span>
                  </div>
                  <div v-if="subscription.number_of_refreshes !== 0 && subscription.number_of_refreshes !== '0'" class="list-item">
                    <i class="el-icon-star-on" /> {{ subscription.number_of_refreshes }}
                    <span v-if='subscription.number_of_refreshes === 1'>darmowe odświeżenie</span>
                    <span v-else-if='subscription.number_of_refreshes > 1 && subscription.number_of_refreshes < 5'>darmowe odświeżenia</span>
                    <span v-else-if='subscription.number_of_refreshes >= 5'>darmowych odświeżeń</span>
                  </div>
                  <div class="list-item" v-if="subscription.featured_on_search_results_and_categories === true">
                    <i class="el-icon-star-on" /> wyróżnione w ruchomej galerii w wynikach wyszukiwań i kategoriach
                  </div>
                  <div class="list-item" v-if="subscription.featured_on_homepage === true">
                    <i class="el-icon-star-on" /> wyróżnione w ruchomej galerii na stronie, głównej w wynikach
                    wyszukiwań i kategoriach
                  </div>
                  <div class="list-item" v-if="subscription.bargain_price / 100 === 0">
                    <i class="el-icon-star-on" /> Żółta ramka z napisem "OKAZJA"
                  </div>
                </div>
                <el-row :class="[ subscription.bargain_price === 0 ? 'hidden' : '' ]">
                  <el-col :span="20">
                    <div class="grid-content bg-purple">
                      Dodaj żółtą ramkę z napisem
                      <el-button class="button_bargain" size="mini">OKAZJA</el-button>
                      (za jedyne <strong>{{ subscription.bargain_price / 100 }} zł</strong>)
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="grid-content bg-purple-light subscription-switch-right">
                      <el-switch
                        :class="[ subscription.bargain_price === 0 ? 'hidden is-checked' : '' ]"
                        v-model="form.subscriptions[subscription.id].is_bargain"
                        :value="true"
                        @set-value="form.is_bargain = $event"
                      ></el-switch>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20">
                    <div class="grid-content bg-purple">
                      Dodaj czerwoną ramkę z napisem
                      <el-button class="button_urgent" size="mini">PILNE</el-button>
                      (za jedyne <strong>{{ subscription.urgent_price / 100 }} zł</strong>)
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="grid-content bg-purple-light subscription-switch-right">
                      <el-switch
                        v-model="form.subscriptions[subscription.id].is_urgent"
                        :value="form.is_urgent"
                        @set-value="form.is_urgent = $event"
                      ></el-switch>
                    </div>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <div class="grid-content bg-purple">1 podbicie</div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content bg-purple-light"><strong>{{ subscription.raise_price / 100 }}
                      zł</strong></div>
                  </el-col>
                  <el-col :span="4" :offset="4">
                    <div class="grid-content bg-purple-light subscription-switch-right">
                      <el-switch
                        v-model="form.subscriptions[subscription.id].has_raise_one"
                        :value="form.has_raise_one"
                        @set-value="form.has_raise_one = $event"
                      ></el-switch>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <div class="grid-content bg-purple">3 podbicia</div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content bg-purple-light"><strong>{{ subscription.raise_price_three / 100 }}
                      zł</strong></div>
                  </el-col>
                  <el-col :span="4" :offset="4">
                    <div class="grid-content bg-purple-light subscription-switch-right">
                      <el-switch
                        v-model="form.subscriptions[subscription.id].has_raise_three"
                        :value="form.has_raise_three"
                        @set-value="form.has_raise_three = $event"
                      ></el-switch>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <div class="grid-content bg-purple">10 podbić</div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content bg-purple-light"><strong>{{ subscription.raise_price_ten / 100 }}
                      zł</strong></div>
                  </el-col>
                  <el-col :span="4" :offset="4">
                    <div class="grid-content bg-purple-light subscription-switch-right">
                      <el-switch
                        v-model="form.subscriptions[subscription.id].has_raise_ten"
                        :value="form.has_raise_ten"
                        @set-value="form.has_raise_ten = $event"
                      ></el-switch>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { index } from '@/api/subscriptions'
export default {
  name: 'SubscriptionsNew',
  props: {
    isDialog: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      items: [],
      active_item: null,
      form: { subscriptions: { 1: {}, 2: {}, 3: {}, 4: {} }, is_bargain: false }
    }
  },
  mounted () {
    this.getSubscriptions()
  },
  methods: {
    async getSubscriptions () {
      const result = await index()
      if (this.isDialog) {
        this.items = result.data.filter(sub => sub.id !== 1)
      } else {
        this.items = result.data
      }
    },
    setActiveItem (id) {
      this.active_item = id
      this.$emit('set-active-item', id)
      this.$emit('set-subscription-package', this.form)
      const details = this.items.filter(item => item.id === id)
      this.$emit('selected-details', details[0])
    }
  }
}
</script>

<style lang="scss">
.homepage-subscription-list--wdt {
  width: 88% !important;
}
.homepage-subscription-list {
  margin-top: 20px;

  .el-input__inner {
    color: #000000;
  }

  .el-row {
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
  }

  .el-col-6 {
    min-width: 270px;
  }

  .photos-box {
    display: flex;
    align-items: center;

    .drag-images {
      margin-top: 10px;
    }
  }

  .el-form-item__label {
    font-weight: bold;
  }

  .location-input {
    width: 100%;
  }

  .active {
    color: #ffffff !important;
    border-color: #ceefdd !important;
    background-color: #ff19b7 !important;
  }

  .contact {
    margin-top: 20px;
  }

  .map {
    margin-top: 10px;
    height: 340px;
  }

  .add-btn {
    margin-top: 30px;
    text-align: center;
  }

  .el-upload-list--picture-card {
    .el-upload-list__item-thumbnail {
      width: 100%;
      height: auto;
    }
  }

  .visible-date {
    display: flex;
    flex-direction: column;
  }

  .urgent {
    min-height: 160px;
    padding: 40px 0;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    margin-bottom: 20px;

    .urgent-img {
      width: 137px;
      height: 100px;
    }

    .urgent-text {
      margin: 0 20px;

      span {
        color: red;
        font-weight: bold;
      }
    }
  }

  .container-account-types {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: baseline;
    padding: 10px 0;

    .sub-box {
      margin-bottom: 20px;
      border-radius: 32px;
      margin-right: 10px;
    }

    .active {
      box-shadow: 0 0 0 2pt #ff56c0;
    }

    .el-card {
      border-radius: 32px;
    }

    .el-card__body {
      padding: 10px;

      .list {
        height: 72px;

        .list-item {
          i {
            font-weight: bold;
            color: #ff9b2f;
          }
        }
      }

    }

    .card-box {
      width: 312px;
      height: 400px;
      cursor: pointer;

      .card-body {
        p {
          line-height: 24px;
        }

        .price {
          text-align: center;
          font-weight: bold;
          font-size: 36px;
          color: #FF19B7;
          padding: 10px;

          sup {
            font-size: 12px;
            color: #000000;
          }
        }

        span.upper {
          text-transform: uppercase;
        }

        .bottom {
          text-align: center;
        }
      }
    }
  }

  .button_urgent {
    background-color: #F50000;
    color: white;
    font-weight: 500;
    border-radius: 6px !important;
    /* font-family: sans-serif; */
    padding: 4px;
  }

  .button_bargain {
    background-color: #FFE122;
    color: black;
    font-weight: 500;
    border-radius: 6px !important;
    /* font-family: sans-serif; */
    padding: 4px;
  }

  .subscription-header {
    text-align: center;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 23px;
    letter-spacing: 1px;
  }

  .subscription-options {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 15px;
    text-align: left;
  }

  .subscription-switch-right {
    text-align: right;
  }

  .list-item {
    margin-top: 15px;
    margin-bottom: 20px;
  }

  .subscription-box-0 {
    // height: 380px !important;
    height: unset !important;
    min-height: 550px;
  }

  .subscription-box-1 {
    // height: 420px !important;
    height: unset !important;
    min-height: 550px;
  }

  .subscription-box-2 {
    // height: 490px !important;
    height: unset !important;
    min-height: 550px;
  }

  .subscription-box-3 {
    // height: 490px !important;
    height: unset !important;
    min-height: 550px;
  }
  .starred {
    margin-bottom: 30px;
  }
  .hidden {
    display: none;
  }
}
</style>
