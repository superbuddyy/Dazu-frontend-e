<template>
  <div class="bg">
    <div class="payment">
      <div class="content">
        <h1>Opłać ogłoszenie</h1>
        <h4>{{ offerTitle }}</h4>
        <el-table
          :data="details"
          style="width: 100%"
          class="items-table"
        >
          <el-table-column
            prop="name"
            label="Nazwa"
          />
          <el-table-column
            prop="value"
            label="Cena"
            width="100px"
          />
        </el-table>
        <div v-if="!hasSubscription" class="subscriptions">
          <h3>Czy chcesz dodatkowy pakiet?</h3>
          <SubscriptionsNew
            v-if="!hasSubscription"
            :is-payment="isDialogNew"
            :selected-form-data="resultFormData"
            @selected-details="setActiveItem"
            @selected-obj-details="setSubscriptionPackage"
          />
        </div>
        <div class="invoice">
          <el-radio v-model="invoice" :label="false">
            <b>Nie potrzebuję faktury</b>
          </el-radio>
          <el-radio v-model="invoice" :label="true">
            <b>Potrzebuję fakture</b>
          </el-radio>
        </div>
        <div v-if="invoice" class="invoice-data">
          <el-form label-position="right" label-width="100px" :model="form" class="form">
            <el-input v-model="form.name" placeholder="Imię lub nazwa firmy" class="input" />
            <el-input v-model="form.phone" placeholder="Telefon" class="input" />
            <el-input v-model="form.street" placeholder="Ulica i numer domu/mieszkania" class="input" />
            <el-input v-model="form.zip_code" placeholder="Kod Pocztowy" class="input" />
            <el-input v-model="form.city" placeholder="Miasto" class="input" />
            <el-input v-model="form.country" placeholder="Kraj" class="input" />
            <el-input v-if="$store.state.user.roles.includes('company')" v-model="form.nip" placeholder="NIP" class="input" />
          </el-form>
        </div>
        <h3>Suma: {{ (amount / 100).toFixed(2) }} pln</h3>
        <div class="buttons">
          <nuxt-link v-if="$store.state.user.isLogged" :to="'/moje-ogloszenia/edytuj-ogloszenie/' + this.$route.params.slug">
            <el-button>
              Wróć do edycji
            </el-button>
          </nuxt-link>
          <el-button
            type="primary"
            round
            class="add-btn"
            icon="el-icon-sold-out"
            @click="paymentDialog = true"
          >
            Zamaiam i płacę
          </el-button>
        </div>
      </div>
    </div>
    <el-dialog
      v-loading="loading"
      title="Wybierz metodę płatności"
      :visible.sync="paymentDialog"
      width="30%"
      center
    >
      <div class="payments">
<!--        <el-button @click="pay('paypal')">-->
<!--          <div class="paypal">-->
<!--            <img src="~/assets/paypal.svg" alt="">-->
<!--            PayPal-->
<!--          </div>-->
<!--        </el-button>-->
        <el-button @click="pay('tpay')">
          <div class="tpay">
            <img src="https://tpay.com/img/banners/tpay_logo_blue.svg" alt="">
            Tpay
          </div>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getBill, charge } from '@/api/offer'
import SubscriptionsNew from '@/components/SubscriptionsNew'

export default {
  name: 'Payment',
  components: {
    SubscriptionsNew
  },
  data: () => ({
    selectedSubscription: 1,
    loading: false,
    paymentDialog: false,
    resultData: {},
    details: [],
    billAmount: 0,
    additionalAmount: 0,
    offerTitle: '',
    hasSubscription: true,
    invoice: false,
    form: {
      name: '',
      phone: '',
      city: '',
      street: '',
      zip_code: '',
      country: '',
      nip: ''
    },
    subForm: {},
    isDialogNew: true
  }),
  computed: {
    amount () {
      return this.billAmount + this.additionalAmount
    },
    formDetails () {
      return this.details
    },
    resultFormData () {
      return this.resultData
    }
  },
  mounted () {
    this.getPaymentDetails(this.$route.params.slug)
    if (this.$store.state.user.isLogged) {
      const user = this.$store.state.user
      this.form.name = user.name
      this.form.phone = user.phone
      this.form.city = user.city
      this.form.street = user.street
      this.form.zip_code = user.zip_code
      this.form.country = user.country
      this.form.nip = user.nip
    }
  },
  methods: {
    async pay (gateway) {
      this.loading = true
      let data = { gateway }
      if (this.invoice) {
        data = { invoice_data: this.form, gateway }
      }

      if (!this.hasSubscription) {
        data = {
          gateway,
          subscription: this.selectedSubscription,
          subscriptions: this.subForm.subscriptions[this.selectedSubscription] ? this.subForm.subscriptions[this.selectedSubscription] : {}
        }
      }
      const result = await charge(this.$route.params.slug, data)
      await this.$store.dispatch('user/setProfile', this.form)
      this.paymentDialog = false
      window.location.href = result.data
      this.loading = false
      console.log('this is test form');
      console.log(this.form);
    },
    async getPaymentDetails (slug) {
      const result = await getBill(slug)
      this.billAmount = result.data.bill.billAmount
      this.details = this.prepareDetails(result.data.bill.details)
      this.offerTitle = result.data.offerTitle
      const isSub = 'subscription' in result.data.bill.details
      if (!isSub) {
        this.resultData.subscriptions = {}
        this.resultData.id = this.selectedSubscription
        if (result.data.bill.details.okazja) {
          this.resultData.subscriptions.is_bargain = true
        }
        if (result.data.bill.details.pilne) {
          this.resultData.subscriptions.is_urgent = true
        }
        if (result.data.bill.details.podbicie_1) {
          this.resultData.subscriptions.has_raise_one = true
        }
        if (result.data.bill.details.podbicie_3) {
          this.resultData.subscriptions.has_raise_three = true
        }
        if (result.data.bill.details.podbicie_10) {
          this.resultData.subscriptions.has_raise_ten = true
        }
      }
      this.hasSubscription = 'subscription' in result.data.bill.details
    },
    prepareDetails (details) {
      const preparedDetails = []
      for (const detail in details) {
        preparedDetails.push({ name: details[detail].name, value: (details[detail].value / 100) + ' pln', key: detail, price: details[detail].value })
      }

      return preparedDetails
    },
    setActiveItem (e) {
      this.selectedSubscription = e.id
    },
    setSubscriptionPackage (obj) {
      console.log(obj)
      this.subForm = obj.form
      let tmpDetails = []
      tmpDetails = this.details.filter(item => !('additional' in item))
      if (obj.details.price !== 0) {
        tmpDetails.push({ name: obj.details.name, price: obj.details.price, value: (obj.details.price / 100) + ' pln', additional: true, id: Math.random().toString(16).slice(2) })
        this.details = tmpDetails
        this.additionalAmount = 0
      } else {
        this.details = tmpDetails
        this.additionalAmount = 0
      }
      this.details.forEach((item, i) => {
        if (item.key === 'pilne' && this.subForm.subscriptions[obj.selectedId].is_urgent) {
          this.details[i].value = obj.details.urgent_price / 100 + ' pln'
          this.details[i].price = obj.details.urgent_price
        }
        if (item.key === 'pilne' && !this.subForm.subscriptions[obj.selectedId].is_urgent) {
          this.details.splice(i, 1)
        }
        if (item.key === 'okazja' && this.subForm.subscriptions[obj.selectedId].is_bargain) {
          this.details[i].value = obj.details.bargain_price / 100 + ' pln'
          this.details[i].price = obj.details.bargain_price
        }
        if (item.key === 'okazja' && !this.subForm.subscriptions[obj.selectedId].is_bargain) {
          this.details.splice(i, 1)
        }
        if (item.key === 'podbicie_1' && this.subForm.subscriptions[obj.selectedId].has_raise_one) {
          this.details[i].value = obj.details.raise_price / 100 + ' pln'
          this.details[i].price = obj.details.raise_price
        }
        if (item.key === 'podbicie_1' && !this.subForm.subscriptions[obj.selectedId].has_raise_one) {
          this.details.splice(i, 1)
        }
        if (item.key === 'podbicie_3' && this.subForm.subscriptions[obj.selectedId].has_raise_three) {
          this.details[i].value = obj.details.raise_price_three / 100 + ' pln'
          this.details[i].price = obj.details.raise_price_three
        }
        if (item.key === 'podbicie_3' && !this.subForm.subscriptions[obj.selectedId].has_raise_three) {
          this.details.splice(i, 1)
        }
        if (item.key === 'podbicie_10' && this.subForm.subscriptions[obj.selectedId].has_raise_ten) {
          this.details[i].value = obj.details.raise_price_ten / 100 + ' pln'
          this.details[i].price = obj.details.raise_price_ten
        }
        if (item.key === 'podbicie_10' && !this.subForm.subscriptions[obj.selectedId].has_raise_ten) {
          this.details.splice(i, 1)
        }
      })
      if (typeof this.details.find(f => f.key === 'pilne') === 'undefined' && this.subForm.subscriptions[obj.selectedId].is_urgent) {
        const f = {
          name: 'Pilne',
          price: obj.details.urgent_price,
          value: (obj.details.urgent_price / 100) + ' pln',
          id: Math.random().toString(16).slice(2),
          key: 'pilne'
        }
        this.details.push(f)
      }
      if (typeof this.details.find(f => f.key === 'okazja') === 'undefined' && this.subForm.subscriptions[obj.selectedId].is_bargain) {
        const f = {
          name: 'Okazja',
          price: obj.details.bargain_price,
          value: (obj.details.bargain_price / 100) + ' pln',
          id: Math.random().toString(16).slice(2),
          key: 'okazja'
        }
        this.details.push(f)
      }
      if (typeof this.details.find(f => f.key === 'podbicie_1') === 'undefined' && this.subForm.subscriptions[obj.selectedId].has_raise_one) {
        const f = {
          name: 'Podibicie',
          price: obj.details.raise_price,
          value: (obj.details.raise_price / 100) + ' pln',
          id: Math.random().toString(16).slice(2),
          key: 'podbicie_1'
        }
        this.details.push(f)
      }
      if (typeof this.details.find(f => f.key === 'podbicie_3') === 'undefined' && this.subForm.subscriptions[obj.selectedId].has_raise_three) {
        const f = {
          name: 'Podibicie x3',
          price: obj.details.raise_price_three,
          value: (obj.details.raise_price_three / 100) + ' pln',
          id: Math.random().toString(16).slice(2),
          key: 'podbicie_3'
        }
        this.details.push(f)
      }
      if (typeof this.details.find(f => f.key === 'podbicie_10') === 'undefined' && this.subForm.subscriptions[obj.selectedId].has_raise_ten) {
        const f = {
          name: 'Podibicie x10',
          price: obj.details.raise_price_ten,
          value: (obj.details.raise_price_ten / 100) + ' pln',
          id: Math.random().toString(16).slice(2),
          key: 'podbicie_10'
        }
        this.details.push(f)
      }
      this.calculateBill()
    },
    calculateBill () {
      let price = 0
      for (const i in this.details) {
        console.log(this.details[i].key + ' = ' + this.details[i].price)
        price = price + parseInt(this.details[i].price)
      }
      this.billAmount = price
    }
  }
}
</script>

<style lang="scss">
.bg {
  background-image: url('~assets/header-background.jpg');
  background-position: top;
  background-size: cover;
  background-repeat: no-repeat;
}
.payment {
  min-height: calc(100vh - 274px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 6vw;
  padding: 90px 0;

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    padding: 40px;
    width: 80%;

    .items-table, h3 {
      margin-top: 20px;
    }
    .buttons {
      margin-top: 20px;
      text-align: right;
    }

    .subscriptions {
      width: 100%;
      margin-top: 30px;
      background: #f5f5f5;
      text-align: center;

      .subscriptions-container {
        width: 100%;
        padding: 0;

        .sub-box {
          margin: 20px 0;

          .card-box {
            width: 250px;
            height: unset;

            .price {
              font-size: 30px;
            }

            .list-item {
              padding: 2px 4px;
              text-align: left;
            }
          }
        }
      }
    }

    .invoice {
      display: flex;
      justify-content: center;
      width: 100%;
      padding: 20px;
    }

    .invoice-data {
      .el-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 500px;

        .input {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
