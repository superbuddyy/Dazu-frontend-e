<template>
  <div class="offers-list">
    <div class="panel">
      <el-checkbox class="check-box" @change="checkAll">
        Zaznacz wszystkie
      </el-checkbox>
      <el-popover
        v-model="deactivatePopoverVisible"
        placement="bottom"
      >
        <p>Czy na pewno chcesz zdezaktywować?</p>
        <div style="text-align: center; margin: 0">
          <el-button size="mini" type="text" @click="deactivatePopoverVisible = false">
            Nie
          </el-button>
          <el-button type="primary" size="mini" @click="deactivateChecked">
            Tak
          </el-button>
        </div>
        <el-button slot="reference" type="danger" round icon="el-icon-circle-close">
          Dezaktywuj
        </el-button>
      </el-popover>
      <el-button type="primary" round icon="el-icon-refresh-right" @click="refreshChecked">
        Odświerz
      </el-button>
    </div>
    <div v-loading="loading" class="loading">
      <div v-if="offers" class="offers-content">
        <div
          v-for="offer in offers"
          :key="offer.id"
          class="offer"
        >
          <div class="subscription-badge">
            {{ offer.subscriptions[0].name }}
          </div>
          <div class="left">
            <div class="checkbox">
              <el-checkbox class="check-box" :value="getCheckedIndex(offer.id) !== -1" @change="checkOne(offer.id)" />
            </div>
            <div class="info">
              <nuxt-link :to="'/ogloszenia/' + offer.slug">
                {{ offer.title }}
              </nuxt-link>
              <div class="location">
                Lokalizacja: {{ offer.location_name }}
              </div>
              <div class="stats">
                <div class="views">
                  <span>{{ offer.views }}</span> Odsłon
                </div>
                <el-button type="text" @click="showStats(offer.slug)">
                  Zobacz statystyki
                </el-button>
              </div>
            </div>
          </div>
          <div class="actions">
            <div class="buttons">
              <div class="promo-btn">
                <el-tooltip :content="'(' + (offer.raise_price / 100) + ' pln)'" placement="top">
                  <el-button
                    v-if="offer.raise_price === 0"
                    type="warning"
                    round
                    icon="el-icon-upload2"
                    @click="raise(offer.slug)"
                  >
                    Podbij
                  </el-button>
                </el-tooltip>
                <el-tooltip :content="'(' + (offer.raise_price / 100) + ' pln)'" placement="top">
                  <el-button
                    v-if="offer.raise_price !== 0"
                    type="warning"
                    round
                    icon="el-icon-upload2"
                    @click="openPaymentDialog(offer.slug)"
                  >
                    Podbij
                  </el-button>
                </el-tooltip>
              </div>
              <nuxt-link :to="'/moje-ogloszenia/edytuj-ogloszenie/' + offer.slug" class="edit-btn">
                <el-button type="info" round icon="el-icon-edit">
                  Edytuj
                </el-button>
              </nuxt-link>
              <div class="promo-btn">
                <el-button type="primary" round icon="el-icon-top-right" @click="openSubscriptionsDialog(offer.slug)">
                  Promuj
                </el-button>
              </div>
            </div>
            <div class="stats">
              <div v-if="offer.status === 'in_active' && !offer.is_expired" class="status-inactive">
                <i class="el-icon-circle-close" />
                Nieaktywne
                <span class="tip">
                  (Oczekuje na akceptacje)
                </span>
              </div>
              <div v-if="offer.status === 'in_active_by_user' && !offer.is_expired" class="status-inactive">
                <i class="el-icon-circle-close" />
                Nieaktywne
                <span class="tip">
                  (dezaktywowane przez użytkownika)
                </span>
              </div>
              <div v-if="offer.status === 'rejected' && !offer.is_expired" class="status-inactive">
                <i class="el-icon-close" />
                Odrzucone - {{ offer.note }}
              </div>
              <div v-if="offer.status === 'active' && !offer.is_expired" class="status-active">
                <i class="el-icon-circle-check" />
                Aktywne
              </div>
              <div v-if="offer.status === 'pending' && !offer.is_expired" class="status-pending">
                <i class="el-icon-time" />
                Oczekuje na płatność
              </div>
              <div v-if="offer.is_expired" class="status-expired">
                <i class="el-icon-warning-outline" />
                Wygasło
              </div>
              <el-button
                v-if="offer.is_expired && offer.refresh_price === 0"
                type="text"
                icon="el-icon-refresh-right"
                @click="refresh(offer.slug)"
              >
                Odświerz ({{ offer.refresh_price / 100 }} pln)
              </el-button>
              <el-button
                v-if="offer.is_expired && offer.refresh_price !== 0"
                type="text"
                icon="el-icon-refresh-right"
                @click="openRefreshPaymentDialog(offer.slug)"
              >
                Odświerz ({{ offer.refresh_price / 100 }} pln)
              </el-button>
              <el-button
                v-if="offer.status === 'pending' && !offer.is_expired"
                type="text"
                icon="el-icon-sold-out"
                @click="redirectToPayPage(offer.slug, 'charge')"
              >
                Opłać
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      v-if="total > 1"
      background
      class="pagination-section"
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
    />
    <SubscriptionsDialog
      :visible="subscriptionsDialogVisible"
      :offer-slug="offerSlug"
      @close-dialog="subscriptionsDialogVisible = false"
    />
    <el-dialog
      v-loading="loading"
      title="Wybierz metodę płatności"
      :visible.sync="paymentDialog"
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
    <el-dialog
      v-loading="loading"
      title="Wybierz metodę płatności"
      :visible.sync="refreshPaymentDialog"
      center
    >
      <div class="payments">
        <el-button @click="refresh(refreshSlug)">
          <div class="paypal">
            <img src="~/assets/paypal.svg" alt="">
            PayPal
          </div>
        </el-button>
      </div>
    </el-dialog>
    <OfferStats
      v-if="statsOfferSlug !== null"
      :visible="visibleStats"
      :offer-slug="statsOfferSlug"
      @close="visibleStats = false"
    />
  </div>
</template>

<script>
import { getOffers } from '@/api/user'
import { deactivate, refresh, raise } from '@/api/offer'
import SubscriptionsDialog from '@/components/SubscriptionsDialog'
import OfferStats from '@/components/account/my_offers/OfferStats'

export default {
  name: 'OffersList',
  components: {
    SubscriptionsDialog,
    OfferStats
  },
  data: () => ({
    deactivatePopoverVisible: false,
    checked_offers: [],
    offers: [],
    loading: true,
    total: 1,
    pageSize: 10,
    currentPage: 1,
    subscriptionsDialogVisible: false,
    paymentDialog: false,
    refreshPaymentDialog: false,
    refreshSlug: '',
    paymentSlug: '',
    offerSlug: '',
    visibleStats: false,
    statsOfferSlug: null
  }),
  mounted () {
    this.getOffers()
  },
  methods: {
    showStats (offerSlug) {
      this.visibleStats = true
      this.statsOfferSlug = offerSlug
    },
    openSubscriptionsDialog (slug) {
      this.subscriptionsDialogVisible = true
      this.offerSlug = slug
    },
    openPaymentDialog (slug) {
      this.paymentDialog = true
      this.paymentSlug = slug
    },
    redirectToPayPage (slug) {
      this.$router.push('/moje-ogloszenia/oplac/' + slug)
    },
    openRefreshPaymentDialog (slug) {
      this.refreshSlug = slug
      this.refreshPaymentDialog = true
    },
    async pay () {
      this.loading = true
      const result = await raise(this.paymentSlug, {})
      this.paymentDialog = false
      window.location.href = result.data.links[1].href
      this.loading = false
    },
    async getOffers () {
      const result = await getOffers()
      if (result.status === 200) {
        this.offers = result.data.data
        this.total = result.data.last_page
        this.pageSize = result.data.per_page
        this.currentPage = result.data.current_page
        this.loading = false
      }
    },
    checkAll (e) {
      if (!e) {
        this.checked_offers = []
      } else {
        this.checked_offers = this.offers.map(({ id }) => id)
      }
    },
    checkOne (id) {
      const index = this.getCheckedIndex(id)
      if (index === -1) {
        this.checked_offers.push(id)
      } else {
        this.checked_offers.splice(this.checked_offers, 1)
      }
    },
    getCheckedIndex (id) {
      return this.checked_offers.indexOf(id)
    },
    async refresh (slug) {
      this.loading = true
      const result = await refresh(slug)
      if (result.status === 204) {
        this.$message({
          message: 'Odświeżono ogłoszenie pomyślnie',
          type: 'success',
          duration: 3000
        })
      } else if (result.status === 200 && 'links' in result.data) {
        this.refreshPaymentDialog = false
        window.location.href = result.data.links[1].href
      } else if (result.status === 200) {
        this.$message({
          message: 'Odświeżono ogłoszenie pomyślnie',
          type: 'success',
          duration: 3000
        })
        this.offers = result.data.data
      }
      this.loading = false
    },
    async raise (slug) {
      this.loading = true
      const result = await raise(slug)
      if (result.status === 204) {
        this.$message({
          message: 'Podbito ogłoszenie pomyślnie',
          type: 'success',
          duration: 3000
        })
      } else if (result.status === 200 && 'links' in result.data) {
        window.location.href = result.data.links[1].href
      } else if (result.status === 200) {
        this.$message({
          message: 'Podbito ogłoszenie pomyślnie',
          type: 'success',
          duration: 3000
        })
        this.offers = result.data.data
      }
      this.loading = false
    },
    refreshChecked () {
      if (this.checked_offers.length === 0) {
        this.$message({
          message: 'Musisz zaznaczyć ofert do odświerzenia',
          type: 'warning',
          duration: 3000
        })
      }
    },
    async deactivateChecked () {
      this.deactivatePopoverVisible = false
      if (this.checked_offers.length !== 0) {
        const result = await deactivate({ offers: this.checked_offers })
        if (result.status === 200) {
          this.$message({
            message: 'Zaktualizowano pomyślnie',
            type: 'success',
            duration: 3000
          })
          this.offers = result.data.data
          this.checked_offers = []
        }
      } else {
        this.$message({
          message: 'Musisz zaznaczyć oferty do dezaktywowania',
          type: 'warning',
          duration: 3000
        })
      }
    }
  }
}
</script>

<style lang="scss">
.offers-list {
  width: 100%;

  @media only screen and (max-width: 834px) {
    .el-dialog {
      width: 90%;
    }
  }

  .pagination-section {
    text-align: center;
  }

  .panel {
    display: flex;
    justify-content: center;
    align-items: center;

    @media only screen and (max-width: 500px) {
      flex-direction: column;
      .check-box {
        margin-bottom: 10px;
      }

      button {
        width: 90%;
        margin-left: 0;
        margin-bottom: 10px;
      }
    }

    .check-box {
      margin-right: 20px;
    }
    .el-checkbox__inner {
      width: 24px;
      height: 24px;
      &:after {
        top: 6px;
        left: 9px;
      }
    }
  }

  .loading {
    min-height: 40vh;
  }

  .offers-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 20px 0;
    .offer {
      display: flex;
      flex-wrap: wrap;
      width: 80%;
      border: 1px solid gray;
      padding: 16px 16px 16px 6px;
      margin-bottom: 20px;
      position: relative;

      @media only screen and (max-width: 1110px) {
        width: 90%;
      }

      .left {
        display: flex;
        width: 65%;
        min-width: 600px;

        @media only screen and (max-width: 843px) {
          width: 100%;
          min-width: unset;
        }
      }

      .subscription-badge {
        position: absolute;
        right: 0;
        top: 0;
        background: #009E79;
        padding: 4px 10px;
        color: #ffffff;
        font-size: 14px;
      }

      .checkbox {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 10%;
        .el-checkbox__inner {
          width: 24px;
          height: 24px;
          &:after {
            top: 6px;
            left: 9px;
          }
        }
      }
      .info {
        width: 60%;
        display: flex;
        align-items: flex-start;
        flex-direction: column;

        a {
          cursor: pointer;
          margin-bottom: 10px;
          font-weight: bold;
          color: #000000;
          text-decoration: none;
        }
        .location {
          font-size: 15px;
        }
        .stats {
          padding: 10px 0;
          font-size: 15px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          .views {
            padding: 10px 10px 0 0;
            span {
              color: #009E79;
              font-weight: bold;
            }
          }
        }
      }
      .actions {
        width: 35%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        @media only screen and (max-width: 990px) {
          width: 100%;
        }

        .buttons {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 10px;
          .edit-btn, .promo-btn {
            width: 50%;
          }
          button {
            width: 90%;
          }
        }
        .stats {
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-around;
          .status-inactive {
            i {
              color: red;
            }
            .tip {
              color: #8c939d;
              font-style: italic;
              font-size: 14px;
            }
          }
          .status-active {
            i {
              color: #009E79;
            }
          }
          .status-expired, .status-expired {
            i {
              color: #909399;
            }
          }
        }
      }
    }
  }
}
</style>
