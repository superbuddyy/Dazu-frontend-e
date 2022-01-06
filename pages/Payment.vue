<template>
  <div class="bg">
    <div class="payment">
      <div class="content">
        <h1>Opłać ogłoszenie</h1>
        <h4>{{ offerTitle }}</h4>
        <el-table
          :data="formDetails"
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
          <Subscriptions
            @selected-details="setActiveItem"
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
        <el-button @click="pay">
          <div class="paypal">
            <img src="~/assets/paypal.svg" alt="">
            PayPal
          </div>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getBill, charge } from '@/api/offer'
import Subscriptions from '@/components/Subscriptions'

export default {
  name: 'Payment',
  components: {
    Subscriptions
  },
  data: () => ({
    selectedSubscription: 1,
    loading: false,
    paymentDialog: false,
    details: [],
    billAmount: 0,
    additionalAmount: 0,
    offerTitle: '',
    hasSubscription: false,
    invoice: false,
    form: {
      name: '',
      phone: '',
      city: '',
      street: '',
      zip_code: '',
      country: '',
      nip: ''
    }
  }),
  computed: {
    amount () {
      return this.billAmount + this.additionalAmount
    },
    formDetails () {
      return this.details
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
    async pay () {
      this.loading = true
      let data = {}
      if (this.invoice) {
        data = { invoice_data: this.form }
      }

      if (this.selectedSubscription !== 1) {
        data = { subscription: this.selectedSubscription }
      }

      const result = await charge(this.$route.params.slug, data)
      await this.$store.dispatch('user/setProfile', this.form)
      this.paymentDialog = false
      window.location.href = result.data.links[1].href
      this.loading = false
    },
    async getPaymentDetails (slug) {
      const result = await getBill(slug)
      this.billAmount = result.data.bill.billAmount
      this.details = this.prepareDetails(result.data.bill.details)
      this.offerTitle = result.data.offerTitle
      this.hasSubscription = 'subscription' in result.data.bill.details
    },
    prepareDetails (details) {
      const preparedDetails = []
      for (const detail in details) {
        preparedDetails.push({ name: details[detail].name, value: (details[detail].value / 100) + ' pln' })
      }

      return preparedDetails
    },
    setActiveItem (e) {
      this.selectedSubscription = e.id
      let tmpDetails = []
      tmpDetails = this.details.filter(item => !('additional' in item))
      if (e.price !== 0) {
        tmpDetails.push({ name: e.name, value: (e.price / 100) + ' pln', additional: true, id: Math.random().toString(16).slice(2) })
        this.details = tmpDetails
        this.additionalAmount = e.price
      } else {
        this.additionalAmount = 0
      }
      console.log(this.details)
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
