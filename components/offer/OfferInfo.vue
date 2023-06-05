<template>
  <div class="offer-info">
    <div class="header-section">
      <!-- <div class="left">
        <div class="date">
          {{ offer.created_at }}
        </div>
        <div v-if="false" class="views">
          Visits: x
        </div>
      </div>
      <div class="right">
        <el-button
          v-if="user.isLogged && user.id === offer.user_id"
          type="primary"
          icon="el-icon-top-right"
          round
          @click="subscriptionsDialogVisible = true"
        >
          Promuj
        </el-button>
        <Favorite
          class="favorite-btn"
          :offer-slug="offer.slug"
          :is-favorite="offer.is_favorite"
          size="30"
          @add-favorite="addFavorite"
          @remove-favorite="removeFavorite"
        />
      </div> -->
    </div>
    <div class="info-body">
      <div class="price-tags">
        <div class="price">
          <b><Money :money="offer.price" /></b>
        </div>
        <div class="tags">
          <el-tag v-if="offer.is_urgent" type="danger" class="urgent_label">
            URGENT
          </el-tag>
          <el-tag v-if="offer.is_promoted" type="warn" class="offer_label">
            OPPORTUNITY
          </el-tag>
          <el-tag v-if="offer.is_installments" type="info">
            In installments
          </el-tag>
          <el-tag v-if="offer.is_for_negotiations" type="info">
            To negotiate
          </el-tag>
          <el-tag v-if="offer.is_with_bills" type="info">
            Bills included
          </el-tag>
          <el-tag v-if="offer.is_per_month" type="info">
            PLN/month
          </el-tag>
          <el-tag v-if="offer.is_free" type="info">
            Free
          </el-tag>
          <el-tag v-if="offer.is_available_now" type="info">
            Available immediately
          </el-tag>
        </div>
      </div>
      <div class="text">
        <h1>{{ offer.title }}</h1>
      </div>
      <div class="text">
        <p v-if="offer.location">{{ offer.location.name }}</p>
      </div>
      <div class="personal-data">
        <template v-if="(user.isLogged && user.id === offer.user_id) || !offer.is_expired">
          <div v-if="offer.company && (offer.user.type === 'company' || offer.user.type === 'agent')" class="avatar">
            <Avatar
              :company="offer.company"
              :user="offer.user"
            />
          </div>
          <div v-else-if="offer.company === null && offer.user.type !== 'company'" class="avatar">
            <Avatar
              :company="offer.company"
              :user="offer.user"
            />
          </div>
        </template>
        <template v-else>
          <div class="avatar">
            <Avatar
              :user="offer.exp_avatar_url"
            />
          </div>
        </template>
        <template v-if="(user.isLogged && user.id === offer.user_id) || !offer.is_expired">
          <div v-if="offer.user" class="right-data">
            <div v-if="offer.company && offer.user.type === 'company'" class="company-name">
              <nuxt-link :to="'/profil/' + offer.user.id">
                {{ offer.company.name }}
              </nuxt-link>
              <el-button type="default" class="fvt-usr-btn">
                Save
                <FavoriteUser
                  class="favorite-btn"
                  :userSlug="offer.user.id"
                  :isFavoriteUser="offer.user.is_favorite_user"
                  size="20"
                />
              </el-button>
            </div>
            <div
              v-if="(offer.user.type === 'user' || offer.user.type === 'agent' || offer.user.type === 'admin')"
              class="agent"
            >
              <b
                class="agent-name"
              >
                <nuxt-link :to="'/profil/' + offer.user.id">{{ offer.user.name }}</nuxt-link>
              </b>
              <div class="fvt-usr-btn">
                Save
                <FavoriteUser
                  class="favorite-btn"
                  :userSlug="offer.user.id"
                  :isFavoriteUser="offer.user.is_favorite_user"
                  size="20"
                />
              </div>
            </div>
            <div
              v-if="isPreview && !user.isLogged"
              class="agent"
            >
              <b
                class="agent-name"
              >
                {{ localData.user.name }}
              </b>
              <div class="fvt-usr-btn">
                Save
                <FavoriteUser
                  class="favorite-btn"
                  :userSlug="offer.user.id"
                  :isFavoriteUser="offer.user.is_favorite_user"
                  size="20"
                />
              </div>
            </div>
            <div class="buttons">
              <el-button v-if="offer.user && offer.user.phone" type="plain" @click="showPhone" :style="{width: '150px'}">
                Call
              </el-button>
              <el-button type="primary" class="black-button" @click="emailVisible = true" :style="{width: '150px'}">
                Send an email
              </el-button>
            </div>
            <div v-if="phone !== null" class="phone">
              Phone number: {{ phone }}
            </div>
          </div>
        </template>
        <template v-else-if="isPreview && !user.isLogged">
          <div class="right-data">
            <div
              v-if="isPreview && !user.isLogged"
              class="agent"
            >
              <b
                class="agent-name"
              >
                <!-- {{ localData.user.name }} -->
              </b>
              <div class="fvt-usr-btn">
                Save
                <FavoriteUser
                  class="favorite-btn"
                  :userSlug="offer.user.id"
                  :isFavoriteUser="offer.user.is_favorite_user"
                  size="20"
                />
              </div>
            </div>
            <div class="buttons">
              <el-button v-if="offer.user && offer.user.phone" type="plain" round @click="showPhone">
                Call
              </el-button>
              <el-button type="primary" round @click="emailVisible = true">
                Send an email
              </el-button>
            </div>
            <div v-if="phone !== null" class="phone">
              Phone number: {{ phone }}
            </div>
          </div>
        </template>
      </div>
      <div class="text">
        <p v-html="offer.description">
        </p>
      </div>
      <div class="stats">
        <el-table
          :data="attributes"
          stripe
        >
          <el-table-column
            prop="name"
            label="Attribute"
            width="200px"
          />
          <el-table-column
            prop="result"
            label="Value"
          />
        </el-table>
      </div>
      <div class="report">
        <el-button type="text" @click="reportVisible = true">
          Report this ad
          <i class="el-icon-warning-outline" />
        </el-button>
      </div>
      <Map
        v-if="offer.main_photo"
        :location="offer.location"
      />
    </div>
    <ReportDialog
      :dialog-visible="reportVisible"
      :offer-slug="offer.slug"
      @close-dialog="reportVisible = false"
    />
    <EmailDialog
      :dialog-visible="emailVisible"
      :offer-slug="offer.slug"
      :offer-title="offer.title"
      offer-target-email="placeholder"
      @close-dialog="emailVisible = false"
    />
    <SubscriptionsDialog
      :visible="subscriptionsDialogVisible"
      :offer-slug="offer.slug"
      @close-dialog="subscriptionsDialogVisible = false"
    />
    <PhotoDialog
      :visible="photoDialog"
      :img-path="imgPath"
      :link="avatarVideo"
      @close="photoDialog = false"
    />
    <el-dialog
      title="Please verify that you are not a robot to see the phone number"
      :visible.sync="recaptchaVisible"
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
import VueRecaptcha from 'vue-recaptcha'
import Avatar from '../Avatar'
import ReportDialog from '~/components/offer/ReportDialog'
import EmailDialog from '~/components/offer/EmailDialog'
import Favorite from '~/components/Favorite'
import Money from '~/components/Money'
import Map from '~/components/offer/Map'
import SubscriptionsDialog from '~/components/SubscriptionsDialog'
import { getPhone } from '~/api/user'
import PhotoDialog from '~/components/PhotoDialog'
import { generatePhotoFromYoutubeLink } from '~/helpers'
import FavoriteUser from '~/components/FavoriteUser'

export default {
  name: 'OfferInfo',
  components: {
    ReportDialog,
    EmailDialog,
    Money,
    Favorite,
    SubscriptionsDialog,
    VueRecaptcha,
    PhotoDialog,
    Map,
    Avatar,
    FavoriteUser
  },
  props: {
    offer: {
      type: Object,
      default () {
        return {
          user: {
            name: '',
            email: ''
          }
        }
      }
    },
    attributes: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      photoDialog: false,
      imgPath: '',
      avatarVideo: '',
      reportVisible: false,
      emailVisible: false,
      subscriptionsDialogVisible: false,
      recaptchaVisible: false,
      recaptcha: null,
      phone: null,
      videoAvatarAvailable: false,
      localData: {},
      user: {}
    }
  },
  computed: {
    userAvatar () {
      return this.offer.user.avatar
    },
    companyAvatar () {
      if (this.offer.company.avatar === null && this.offer.company.video_avatar !== null) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.videoAvatarAvailable = true
        return generatePhotoFromYoutubeLink(this.offer.company.video_avatar)
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.videoAvatarAvailable = false
      return this.offer.company.avatar
    },
    siteKey () {
      return this.$config.recaptchaSiteKey
    },
    isPreview () {
      return Object.prototype.hasOwnProperty.call(this.$route.query, 'preview') && this.$route.query.preview
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
    this.user = this.$store.state.user
    if (this.isPreview && !this.user.isLogged) {
      this.localData = localStorage.getItem('offer') ? JSON.parse(localStorage.getItem('offer')) : null
    }
  },
  methods: {
    showPhone () {
      this.recaptchaVisible = true
    },
    openPhotoDialog (path, videoAvatar) {
      this.photoDialog = true
      if (videoAvatar) {
        this.avatarVideo = videoAvatar
      } else {
        this.imgPath = path
      }
    },
    onVerify (response) {
      this.recaptcha = response
    },
    async getPhone () {
      const result = await getPhone(this.offer.user.id, { recaptcha: this.recaptcha })
      if (result.data.phone === '') {
        this.phone = 'Brak numeru'
      } else {
        this.phone = result.data.phone
      }
    },
    addFavorite () {
      this.$emit('set-favorite', true)
    },
    removeFavorite () {
      this.$emit('set-favorite', false)
    }
  }
}
</script>

<style lang="scss">
  .captcha {
    display: flex;
    justify-content: center;
  }
  .black-button {
    background-color: black;
    border: none;
  }
  .black-button:hover {
    background-color: #424242;
  }
  .offer-info {
    padding: 0 40px;
    .header-section {
      display: flex;
      justify-content: space-between;
      width: 100%;

      .views, .date {
        font-family: 'Inconsolata';
        font-size: 13px;
      }

      .left, .right {
        // width: 50%;
        display: flex;
        align-items: center;
        font-family: 'Inconsolata';
        font-weight: bold;

        .views, .favorite-btn {
          margin-left: 20px;
        }
        .fvt-usr-btn {
          display: flex;
        }
      }
    }

    .info-body {
      .agent {
        width:100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        .agent-avatar-img {
          width: 42px;
          height: 42px;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          border-radius: 50%;
          margin-right: 10px;
          cursor: pointer;
        }
      }

      .personal-data {
        background-color: #f1f1f1;
        padding: 19px 10px;
        margin: 20px 0 20px 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .phone {
          margin-top: 14px;
        }

        .avatar {
          width: 30%;
          display: flex;
          justify-content: center;
          .avatar-img {
            cursor: pointer;
            height: 100px;
            width: 100px;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            background-color: white;
            border-radius: 12px;
          }
        }

        .company-avatar {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          .video-icon {
            position: absolute;
            background: #000000;
            border-radius: 50%;
            color: #ff19b7;
            font-size: 20px;
            font-weight: bold;
            font-family: 'Inconsolata';
          }
        }

        .right-data {
          width: 80%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: flex-start;

          .agent-name, .company-name {
            margin: 0 0 10px 0;
            a {
              text-decoration: none;
              color: #000000;
            }
          }
          .company-name {
            display: flex;
            width: 100%;
            justify-content: space-between;
          }
          .fvt-usr-btn {
            display: flex;
            margin-left: 15px;
            margin-top: -3px;
          }
        }
      }
      .text {
        margin: 20px 0;
      }
      .price-tags{
        display: flex;
        align-items: center;
        .price {
          .el-badge__content.is-fixed {
            top: -4px;
          }
          b {
            color: #000000;
            font-size: 25px;
            font-family: 'Inconsolata';
          }
        }
        .tags {
          display:flex;
          align-items: center;
          .el-tag {
            margin-left: 10px;
            color: #000000;
          }
        }
      }
      .text {
        h1 {
          font-size: 20px;
          font-family: 'Inconsolata';
          text-align: left;
          margin-bottom:10px;
        }
        p {
          margin: 10px 0;
        }
      }

      .stats {
        margin-top: 20px;
        width: 90%;
        .cell {
          color: #000000!important;
          white-space:pre-wrap;
          word-break:break-word;
        }
      }

      .report {
        text-align: right;
      }

      .offer-map {
        height: 300px;
      }
    }
    .urgent_label {
      background: #FF4800 !important;
      color: #fff !important;
    }
    .offer_label {
      background: #FFE000 !important;
      color: #000 !important;
    }
  }
</style>
