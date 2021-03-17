<template>
  <div class="profile">
    <div class="user-data">
      <div v-if="user.company" class="avatar">
        <div v-if="user.company.avatar" class="avatar-img" :style="{backgroundImage: 'url(' + user.company.avatar.url + ')'}"></div>
      </div>
      <div class="details">
        <div class="stats">
          <div class="stat">
            Dołączył: <span>{{ user.created_at }}</span>
          </div>
          <div class="stat">
            Ilość ogłoszeń: <span>{{ user.offers_count }}</span>
          </div>
        </div>
        <div class="name">
          {{ user.name }}
        </div>
        <div v-if="user.address && user.address.street && user.address.city" class="address">
          ul. {{ user.address.street }}, {{ user.address.city }}, {{ user.address.country }}
        </div>
        <div class="profile-buttons">
          <el-button
            v-if="phone === null"
            @click="recaptchaVisible = true"
          >
            Pokaż numer
          </el-button>
          <b v-if="phone !== null">{{ phone }}</b>
          <el-button type="primary" @click="emailVisible = true">
            Wyślij wiadomość
          </el-button>
        </div>
      </div>
    </div>
    <OffersCarousel />
    <div class="container">
      <SearchOffers
        v-loading="loading"
        :offers="offers"
      />
    </div>
    <EmailDialog
      :dialog-visible="emailVisible"
      :user-id="$route.params.user"
      @close-dialog="emailVisible = false"
    />
    <el-dialog
      title="Zweryfikuj, że nie jesteś robotem, aby zobaczyć numer telefonu"
      :visible.sync="recaptchaVisible"
      width="500px"
      :before-close="close"
    >
      <div class="captcha">
        <vue-recaptcha
          ref="recaptcha"
          sitekey="6LdeEN4UAAAAAJz2waONCAXZKdXsMOp7ZCbDcgbn"
          @verify="onVerify"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getPhone, getProfilePage } from '@/api/user'
import OffersCarousel from '@/components/OffersCarousel'
import EmailDialog from '@/components/offer/EmailDialog'
import VueRecaptcha from 'vue-recaptcha'
import SearchOffers from '@/components/search/SearchOffers'

export default {
  name: 'Profile',
  components: {
    OffersCarousel,
    EmailDialog,
    VueRecaptcha,
    SearchOffers
  },
  data: () => ({
    recaptchaVisible: false,
    user: {},
    offers: {},
    emailVisible: false,
    phone: null,
    recaptcha: null
  }),
  watch: {
    recaptcha (value) {
      if (value !== null) {
        this.recaptchaVisible = false
        this.getPhone()
      }
    }
  },
  mounted () {
    this.getProfile()
  },
  methods: {
    onVerify (response) {
      this.recaptcha = response
    },
    async getPhone () {
      const result = await getPhone(this.user.id, { recaptcha: this.recaptcha })
      if (result.data.phone === '') {
        this.phone = 'Brak numeru'
      } else {
        this.phone = result.data.phone
      }
    },
    async getProfile () {
      this.loading = true
      const result = await getProfilePage(this.$route.params.user)
      if (result.status === 200) {
        this.user = result.data.user
        this.offers = result.data.offers
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
.profile {
  padding-top: 90px;

  .offers {
    margin: 40px 4vw;
  }

  .user-data {
    margin: 0 6vw 0 6vw;
    display: flex;

    .details {
      margin: 10px 20px;

      .stats {
        display: flex;

        .stat {
          margin-left: 10px;
          font-weight: bold;
          &:first-child {
            margin-left: 0;
          }
        }
        span {
          color: #009E79;
        }
      }

      .name {
        font-weight: bold;
      }

      .profile-buttons {
        margin-top: 20px;

        b {
          margin-right: 10px;
        }
      }
    }

    .avatar-img {
      height: 110px;
      width: 110px;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }

  .container {
    margin: 0 6vw 40px 6vw;
    .controls {
      display: flex;
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
