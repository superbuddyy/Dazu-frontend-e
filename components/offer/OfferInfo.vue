<template>
  <div class="offer-info">
    <div class="header-section">
      <div class="left">
        <div class="date">
          {{ offer.created_at }}
        </div>
        <div v-if="false" class="views">
          Odwiedzeń: x
        </div>
      </div>
      <div class="right">
        <el-button
          v-if="$store.state.user.isLogged && $store.state.user.id === offer.user_id"
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
      </div>
    </div>
    <div class="info-body">
      <div class="personal-data">
        <div v-if="offer.company" class="avatar">
          <Avatar
            :company="offer.company"
            :user="offer.user"
          />
        </div>
        <div v-if="offer.user" class="right-data">
          <div v-if="offer.company !== null" class="company-name">
            <nuxt-link :to="'/profil/' + offer.user.id">
              {{ offer.company.name }}
            </nuxt-link>
          </div>
          <div
            v-if="offer.user.type === 'user' && offer.user.type === 'agent'"
            class="agent"
          >
            <Avatar
              :user="offer.user"
            />
            <b
              class="agent-name"
            >
              <nuxt-link :to="'/profil/' + offer.user.id">{{ offer.user.name }}</nuxt-link>
            </b>
          </div>
          <div class="buttons">
            <el-button type="plain" round @click="showPhone">
              Zadzwoń
            </el-button>
            <el-button type="primary" round @click="emailVisible = true">
              Wyślij maila
            </el-button>
          </div>
          <div v-if="phone !== null" class="phone">
            Numer telefonu: {{ phone }}
          </div>
        </div>
      </div>
      <div class="price">
        Cena: <b><Money :money="offer.price" /></b>
      </div>
      <div class="tags">
        <el-tag v-if="offer.is_installments" type="info">
          Na raty
        </el-tag>
        <el-tag v-if="offer.is_for_negotiations" type="info">
          Do negocjacji
        </el-tag>
        <el-tag v-if="offer.is_with_bills" type="info">
          Rachunki wliczone
        </el-tag>
        <el-tag v-if="offer.is_per_month" type="info">
          Zł/mc
        </el-tag>
        <el-tag v-if="offer.is_free" type="info">
          Darmowe
        </el-tag>
        <el-tag v-if="offer.is_available_now" type="info">
          Dostepne od zaraz
        </el-tag>
      </div>
      <div class="text">
        <h1>{{ offer.title }}</h1>
        <p
          v-html-safe="offer.description"
        />
      </div>
      <div class="stats">
        <el-table
          :data="attributes"
          stripe
        >
          <el-table-column
            prop="name"
            label="Atrybut"
            width="200px"
          />
          <el-table-column
            prop="result"
            label="Wartość"
          />
        </el-table>
      </div>
      <div class="report">
        <el-button type="text" @click="reportVisible = true">
          Zgłoś to ogłoszenie
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
      title="Zweryfikuj, że nie jesteś robotem, aby zobaczyć numer telefonu"
      :visible.sync="recaptchaVisible"
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
    Avatar
  },
  props: {
    offer: {
      type: Object,
      default () {
        return {
          user: {
            name: ''
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
      videoAvatarAvailable: false
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
  .offer-info {
    padding: 0 40px;
    .header-section {
      display: flex;
      justify-content: space-between;
      width: 100%;

      .views, .date {
        font-size: 13px;
      }

      .left, .right {
        // width: 50%;
        display: flex;
        align-items: center;
        font-weight: bold;

        .views, .favorite-btn {
          margin-left: 20px;
        }
      }
    }

    .info-body {
      .agent {
        display: flex;
        align-items: center;
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
        background: #f5f5f5;
        padding: 19px 10px;
        margin: 20px 0 40px 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .phone {
          margin-top: 14px;
        }

        .avatar {
          width: 20%;
          display: flex;
          justify-content: center;
          .avatar-img {
            cursor: pointer;
            height: 80px;
            width: 80px;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
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
            color: #009e79;
            font-size: 20px;
            font-weight: bold;
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
        }
      }
      .price {
        margin-bottom: 6px;
        .el-badge__content.is-fixed {
          top: -4px;
        }
        b {
          color: #009E79;
        }
      }

      .tags {
        margin-bottom: 30px;

        .el-tag {
          color: #000000;
        }
      }

      .text {
        h1 {
          font-size: 20px;
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
  }
</style>
