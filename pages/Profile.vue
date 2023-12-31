<template>
  <div class="profile">
    <div v-if="user" class="user-data">
      <div class="avatar">
        <Avatar
          :company="user.company"
          :user="user"
        />
      </div>
      <div class="details">
        <div class="stats">
          <div class="stat">
            Date of registration: <span>{{ user.created_at }}</span>
          </div>
          <div class="stat">
            Number of ads: <span>{{ user.offers_count }}</span>
          </div>
        </div>
        <div class="name">
          {{ user.name }}
          <FavoriteUser
            class="favorite-btn"
            :userSlug="user.id"
            :isFavoriteUser="user.is_favorite_user"
            size="20"
          />
        </div>
        <div v-if="user.address && user.address.street && user.address.city" class="address">
          ul. {{ user.address.street }}, {{ user.address.city }}, {{ user.address.country }}
        </div>
        <div class="profile-buttons">
          <el-button
            v-if="phone === null && user && user.phone"
            @click="recaptchaVisible = true"
          >
            Show number
          </el-button>
          <b v-if="phone !== null">{{ phone }}</b>
          <el-button type="primary" @click="emailVisible = true">
            Send a message
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
      title="Please verify that you are not a robot to see the phone number"
      :visible.sync="recaptchaVisible"
      width="500px"
    >
      <div class="captcha">
        <vue-recaptcha
          ref="recaptcha"
          :sitekey="siteKey"
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
import FavoriteUser from '@/components/FavoriteUser'
import Avatar from '../components/Avatar'

export default {
  name: 'Profile',
  components: {
    OffersCarousel,
    EmailDialog,
    VueRecaptcha,
    SearchOffers,
    FavoriteUser,
    Avatar
  },
  data: () => ({
    loading: false,
    recaptchaVisible: false,
    user: null,
    offers: [],
    emailVisible: false,
    phone: null,
    recaptcha: null
  }),
  computed: {
    siteKey () {
      return this.$config.recaptchaSiteKey
    }
  },
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
          &:first-child {
            margin-left: 0;
          }
        }
        span {
          color: #ff19b7;
        }
      }

      .name {
        font-weight: bold;
        font-family: 'Inconsolata';
      }

      .profile-buttons {
        margin-top: 20px;

        b {
          margin-right: 10px;
        }
      }
    }

    .avatar-img, .agent-avatar-img {
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
