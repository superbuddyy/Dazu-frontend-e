<template>
  <div class="subscriptions-dialog">
    <el-dialog
      v-loading="loading"
      title="Please select an option to promote your ad"
      :visible.sync="visible"
      :before-close="close"
    >
      <div class="subscriptions">
        <SubscriptionsNew
          :isDialog="isDialogNew"
          @set-active-item="setActiveItem"
          @set-subscription-package="setSubscriptionPackage"
        />
        <!-- <div v-for="item in subscriptions" :key="item.id" class="subscription-box" @click="selectSubscription(item.id)">
          <el-card
            :class="[ selectedItem === item.id ? 'active card-box' : 'card-box' ]"
          >
            <div class="card-body">
              <span>{{ item.name }}</span>
              <div class="bottom clearfix">
                <div class="price">
                  <span>{{ item.price / 100 }} <sup>zł</sup></span>
                </div>
                <b>na {{ item.duration / 24 }} dni</b>
              </div>
              <div class="list">
                <div v-for="descItem in item.description.split(';')" :key="descItem" class="list-item">
                  <i class="el-icon-arrow-down" />
                  {{ descItem }}
                </div>
              </div>
            </div>
          </el-card>
        </div> -->
      </div>
      <div v-if="selectedItem !== null" class="payments">
        <p>Choose payment method</p>
        <div class="gateways">
<!--          <el-button :class="[ gateway === 'paypal' ? 'active' : '' ]" @click="setGateway('paypal')">-->
<!--            <div class="paypal">-->
<!--              <img src="~/assets/paypal.svg" alt="">-->
<!--              PayPal-->
<!--            </div>-->
<!--          </el-button>-->
          <!-- <el-button :class="[ gateway === 'tpay' ? 'active' : '' ]" @click="setGateway('tpay')">
            <div class="tpay">
              <img src="https://tpay.com/img/banners/tpay_logo_blue.svg" alt="">
              Tpay
            </div>
          </el-button> -->
          <el-button :class="[ gateway === 'stripe' ? 'active' : '' ]" @click="setGateway('stripe')">
            <div class="stripe">
              <img src="~/assets/stripe.svg" alt="" width="50">
              Stripe
            </div>
          </el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-back" @click="close()">Close</el-button>
        <el-button type="primary" icon="el-icon-sold-out" @click="pay()">Order and Pay</el-button>
      </span>
    </el-dialog>
    <stripe-checkout
      ref="checkoutRef"
      mode="payment"
      :pk="publishableKey"
      :line-items="lineItems"
      :success-url="successURL"
      :cancel-url="cancelURL"
      @loading="v => loading = v"
    />
  </div>
</template>

<script>
import { buy, index } from '@/api/subscriptions'
import SubscriptionsNew from '@/components/SubscriptionsNew'
import { StripeCheckout } from '@vue-stripe/vue-stripe'

export default {
  name: 'SubscriptionsDialog',
  components: {
    SubscriptionsNew,
    StripeCheckout
  },
  props: {
    visible: {
      type: Boolean,
      default () {
        return false
      }
    },
    offerSlug: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data: () => ({
    loading: false,
    subscriptions: [],
    selectedItem: null,
    gateway: null,
    paymentDialog: true,
    form: {},
    isDialogNew: true,

    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    loading: false,
    lineItems: [
      {
        price: 'price_1NGeMAEspc22iNrV6HZCKtyd', // The id of the one-time price you created in your Stripe dashboard
        quantity: 1,
      },
    ],
    successURL: process.env.FRONT_URL + '?payment-status=success',
    cancelURL: process.env.FRONT_URL + '?payment-status=fail'
  }),
  mounted () {
    // this.getSubscriptions()
  },
  methods: {
    close () {
      this.$emit('close-dialog')
    },
    async getSubscriptions () {
      const result = await index()
      this.subscriptions = result.data.filter(sub => sub.id !== 1)
    },
    selectSubscription (id) {
      this.selectedItem = id
    },
    setActiveItem (id) {
      this.selectedItem = id
    },
    setSubscriptionPackage (form) {
      this.form = form
    },
    setGateway (gateway) {
      this.gateway = gateway
    },
    async pay () {
      if (this.selectedItem === null) {
        this.$message({
          message: 'Please select an option to promote your ad',
          type: 'error',
          duration: 3000
        })
        return
      }
      if (this.gateway === null) {
        this.$message({
          message: 'Choose payment method',
          type: 'error',
          duration: 3000
        })
        return
      }

      this.$refs.checkoutRef.redirectToCheckout();

      // this.loading = true
      // const formInput = this.form.subscriptions[this.selectedItem] ? { subscriptions: this.form.subscriptions[this.selectedItem], gateway: this.gateway } : { gateway: this.gateway }
      // const result = await buy(this.selectedItem, this.offerSlug, formInput)
      // if (result.status === 200) {
      //   window.location.href = result.data  
      //   this.loading = false
      //   this.close()
      // } else {
      //   window.location.href = result.data.url
      // }
    }
  }
}
</script>

<style lang="scss">
  .subscriptions-dialog  {

    @media only screen and (max-width: 1366px) {
      width: 90%;
    }

    .subscriptions {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      margin-top: 10px;
      .subscription-box {
        min-width: 230px;
        margin-bottom: 10px;

        .active {
          box-shadow: inset 0 0 0 2pt #ff19b7;
        }

        .card-box {
          cursor: pointer;
          .card-body {
            .list {
              height: 74px;
              margin: 26px 0;
              .list-item {
                padding: 2px 20px;
                i {
                  font-weight: bold;
                  font-family: 'Inconsolata';
                  color: #ff19b7;
                }
              }
            }

            .select-button {
              //margin-top: 20px;
              width: 100%;
            }
            .price {
              text-align: center;
              font-weight: bold;
              font-size: 36px;
              color: #ff19b7;
              padding: 20px;
              sup {
                font-size: 12px;
                color: #000000;
              }
            }
            span {
              text-transform: uppercase;
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
      }
    }
    .payments {
      display: flex;
      flex-direction: column;
      p {
        font-size: 18px;
        text-align: center;
        padding: 16px 0;
      }
      .gateways {
        display: flex;
        justify-content: center;
        .active {
          box-shadow: inset 0 0 0pt 2pt #ff19b7;
        }
        .paypal, .tpay, .stripe {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .el-dialog {
      width: 75% !important;
    }
  }
  .stripe {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
