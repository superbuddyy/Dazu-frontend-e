<template>
  <div class="offers-list">
    <div class="panel">
      <el-row class="search-row">
        <el-col :span="7">
          <el-input v-model="searchTxt" clearable placeholder="Search for an ad" @clear="searchOfferList" />
        </el-col>
        <el-col :span="2" class="search-box-btn">
          <el-button type="primary" class="login-btn" @click="searchOfferList">
            Search
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="panel">
      <el-checkbox class="check-box" @change="checkAll">
        Select all
      </el-checkbox>
      <el-popover
        v-model="deactivatePopoverVisible"
        placement="bottom"
      >
        <p>Are you sure you want to deactivate?</p>
        <div style="text-align: center; margin: 0">
          <el-button size="mini" type="text" @click="deactivatePopoverVisible = false">
            No
          </el-button>
          <el-button type="primary" size="mini" @click="deactivateChecked">
            Yes
          </el-button>
        </div>
        <el-button slot="reference" type="danger" round icon="el-icon-circle-close" class="mr-5">
          Deactivate
        </el-button>
      </el-popover>
      <!-- <el-button type="primary" round icon="el-icon-refresh-right" @click="refreshChecked" class="mr-5">
        Odśwież
      </el-button> -->
      <span v-if="!user.roles.includes('user') && !user.roles.includes('agent')">
        Filter by agents:
      </span>
      <el-select
        v-if="!user.roles.includes('user') && !user.roles.includes('agent')"
        v-model="current_agent"
        class="mr-5"
        filterable
        clearable
        placeholder="Choose tags for your article"
        @change="searchOfferList()"
      >
        <el-option
          v-for="agent in agents"
          :key="agent.id"
          :label="agent.username"
          :value="agent.id"
        >
          {{ agent.username }}
        </el-option>
      </el-select>
      <el-select
        v-model="changeOrder"
        class="location-input"
        filterable
        placeholder="Select sorting options"
        clearable
        @change="changeOfferList"
      >
        <el-option
          v-for="loc in sortOptions"
          :key="loc.id"
          :label="loc.name"
          :value="loc.value"
        />
      </el-select>
    </div>
    <div v-loading="loading" class="loading">
      <div v-if="offers" class="offers-content">
        <div
          v-for="offer in offers"
          :key="offer.id"
          class="offer"
          :class="[(current_agent === '' || offer.user_name === current_agent) ? 'offer' : 'offer-hide']"
        >
          <div class="subscription-badge">
            {{ offer.subscriptions[0]?offer.subscriptions[0].name : 'Free' }}
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
                Location: {{ offer.location_name }}
              </div>
              <div class="stats">
                <div class="views">
                  <span>{{ offer.views }}</span> Views
                </div>
                <el-button type="text" @click="showStats(offer.slug)">
                  View statistics
                </el-button>
                <el-button v-if="!user.roles.includes('user') && !user.roles.includes('agent')" type="info">
                  {{ offer.user_name }}
                </el-button>
              </div>
              <div v-if="offer.status === 'active' && !offer.is_expired" class="expire-time">
                <ExpireTime :expire-time="offer.expire_time" />
              </div>
            </div>
          </div>
          <div class="actions">
            <div class="buttons">
              <el-popover
                v-model="offer.showDialog"
                placement="bottom"
              >
                <p>Are you sure you want to deactivate?</p>
                <div style="text-align: center; margin: 0">
                  <el-button size="mini" type="text" @click="offer.showDialog = false">
                    No
                  </el-button>
                  <el-button type="primary" size="mini" @click="deactivateOne(offer.id)">
                    Yes
                  </el-button>
                </div>
              </el-popover>
              <el-button slot="reference" type="danger" round icon="el-icon-circle-close" @click="offer.showDialog = true">
                Deactivate
              </el-button>
              <el-button
                v-if="offer.refresh_price === 0"
                type="primary"
                class="refresh-btn"
                round
                icon="el-icon-refresh-right"
                @click="refreshUI(offer.slug)"
                :disabled="offer.status=='in_active' || offer.status=='pending'"
              >
                Refresh
              </el-button>
              <el-button
                v-if="offer.refresh_price !== 0"
                type="primary"
                round
                icon="el-icon-refresh-right"
                :disabled="offer.status=='in_active' || offer.status=='pending'"
                @click="openRefreshPaymentDialog(offer.slug)"
              >
                Refresh ({{ offer.subscriptions[0].refresh_price / 100 }} pln)
              </el-button>
              <div class="promo-btn">
                <el-tooltip :content="toolTipText(offer)" placement="top">
                  <el-button
                    v-if="offer.total_raises !== 0"
                    type="warning"
                    round
                    icon="el-icon-upload2"
                    @click="raiseUI(offer.slug, true)"
                  >
                    Conquer
                  </el-button>
                  <el-button
                    v-else-if="offer.raise_price === 0"
                    type="warning"
                    round
                    icon="el-icon-upload2"
                    @click="raiseUI(offer.slug, false)"
                  >
                    Conquer
                  </el-button>
                  <el-button
                    v-else-if="offer.raise_price !== 0"
                    type="warning"
                    round
                    icon="el-icon-upload2"
                    @click="openPaymentDialog(offer.slug)"
                  >
                    Conquer
                  </el-button>
                </el-tooltip>
              </div>
              <nuxt-link :to="'/moje-ogloszenia/edytuj-ogloszenie/' + offer.slug" class="edit-btn">
                <el-button type="info" round icon="el-icon-edit">
                  Edit
                </el-button>
              </nuxt-link>
              <div class="promo-btn">
                <el-button class="promo" type="primary" round icon="el-icon-star-on" 
                :disabled="offer.status=='in_active'"
                @click="openSubscriptionsDialog(offer.slug)">
                  Promote
                </el-button>
              </div>
            </div>
            <div class="stats">
              <div v-if="offer.status === 'in_active' && !offer.is_expired" class="status-inactive">
                <i class="el-icon-circle-close" />
                Inactive
                <span class="tip">
                  (Awaiting approvals)
                </span>
              </div>
              <div v-if="offer.status === 'in_active_by_user' && !offer.is_expired" class="status-inactive">
                <i class="el-icon-circle-close" />
                Inactive
                <span class="tip">
                  (Deactivated by the user)
                </span>
              </div>
              <div v-if="offer.status === 'rejected' && !offer.is_expired" class="status-inactive">
                <i class="el-icon-close" />
                Rejected - {{ offer.note }}
              </div>
              <div v-if="offer.status === 'active' && !offer.is_expired" class="status-active">
                <i class="el-icon-circle-check" />
                Active
              </div>
              <div v-if="offer.status === 'pending' && !offer.is_expired" class="status-pending">
                <i class="el-icon-time" />
                Awaiting payment
              </div>
              <div v-if="offer.is_expired" class="status-expired">
                <i class="el-icon-warning-outline" />
                Expired
              </div>
              <!-- <el-button
                v-if="offer.is_expired && offer.refresh_price === 0"
                type="text"
                icon="el-icon-refresh-right"
                @click="refreshUI(offer.slug)"
              >
                Odśwież ({{ offer.refresh_price / 100 }} pln)
              </el-button>
              <el-button
                v-if="offer.is_expired && offer.refresh_price !== 0"
                type="text"
                icon="el-icon-refresh-right"
                @click="openRefreshPaymentDialog(offer.slug)"
              >
                Odśwież ({{ offer.refresh_price / 100 }} pln)
              </el-button> -->
              <el-button
                v-if="offer.status === 'pending' && !offer.is_expired"
                type="text"
                icon="el-icon-sold-out"
                @click="redirectToPayPage(offer.slug, 'charge')"
              >
                Pay up
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
      title="Choose payment method"
      :visible.sync="paymentDialog"
      center
    >
      <div class="payments">
<!--        <el-button @click="pay('paypal')">-->
<!--          <div class="paypal">-->
<!--            <img src="~/assets/paypal.svg" alt="">-->
<!--            PayPal-->
<!--          </div>-->
<!--        </el-button>-->
        <!-- <el-button @click="pay('tpay')">
          <div class="tpay">
            <img src="https://tpay.com/img/banners/tpay_logo_blue.svg" alt="">
            Tpay
          </div>
        </el-button> -->
        <el-button @click="pay('stripe')">
          <div class="stripe">
            <img src="~/assets/stripe.svg" alt="" width="50">
            Stripe
          </div>
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-loading="loading"
      title="Choose payment method"
      :visible.sync="refreshPaymentDialog"
      center
    >
      <div class="payments">
<!--        <el-button @click="refresh(refreshSlug, 'paypal')">-->
<!--          <div class="paypal">-->
<!--            <img src="~/assets/paypal.svg" alt="">-->
<!--            PayPal-->
<!--          </div>-->
<!--        </el-button>-->
        <!-- <el-button @click="refreshUI(refreshSlug, 'tpay')">
          <div class="tpay">
            <img src="https://tpay.com/img/banners/tpay_logo_blue.svg" alt="">
            Tpay
          </div>
        </el-button> -->
        <el-button @click="refreshUI(refreshSlug, 'stripe')">
          <div class="stripe">
            <img src="~/assets/stripe.svg" alt="" width="50">
            Stripe
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
import ExpireTime from './ExpireTime'

export default {
  name: 'OffersList',
  components: {
    ExpireTime,
    SubscriptionsDialog,
    OfferStats
  },
  data: () => ({
    user: {
      roles: []
    },
    deactivateOnePopoverVisible: false,
    deactivatePopoverVisible: false,
    checked_offers: [],
    agents: [],
    current_agent: '',
    agents_names: [],
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
    statsOfferSlug: null,
    changeOrder: null,
    searchTxt: '',
    sortOptions: [
      {
        id: 1,
        name: 'Latest',
        value: 'desc'
      },
      {
        id: 2,
        name: 'The oldest',
        value: 'asc'
      },
      {
        id: 3,
        name: 'Active',
        value: 'active'
      },
      {
        id: 4,
        name: 'Deactivated',
        value: 'in_active'
      },
      {
        id: 5,
        name: 'Deactivated by user',
        value: 'in_active_by_user'
      },
      {
        id: 6,
        name: 'pending approval',
        value: 'pending'
      },
      {
        id: 7,
        name: 'Rejected',
        value: 'rejected'
      }
    ]
  }),
  mounted () {
    this.getOffers('')
    this.user = this.$store.state.user;
  },
  methods: {
    toolTipText (offer) {
      if (offer.total_raises !== 0) {
        return '(' + offer.total_raises + ' raises)'
      } else {
        return '(' + (offer.raise_price / 100) + ' pln)'
      }
    },
    changeOfferList () {
      let query = 'sort=' + this.changeOrder
      if (this.searchTxt) {
        query = query + '&keyword=' + this.searchTxt
      }
      this.getOffers(query)
    },
    searchOfferList () {
      const query = new URLSearchParams('')
      if (this.searchTxt) {
        query.set('keyword', this.searchTxt)
      }
      if (this.changeOrder) {
        query.set('sort', this.changeOrder)
      }
      if (this.current_agent) {
        query.set('agent_id', this.current_agent)
      }
      this.getOffers(query)
    },
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
    async pay (gateway) {
      this.loading = true
      const result = await raise(this.paymentSlug, gateway)
      this.paymentDialog = false
      window.location.href = result.data
      this.loading = false
    },
    async getOffers (query) {
      this.agents_names = []
      const result = await getOffers(query)
      if (result.status === 200) {
        this.offers = result.data.data
        this.agents = []
        this.offers.map((item) => {
          if (!this.agents_names.includes(item.user_name)) {
            this.agents.push({
              id: item.user_id,
              username: item.user_name
            })
            this.agents_names.push(item.user_name)
          }
        })

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
    async refreshUI (slug, gateway) {
      this.loading = true
      const result = await refresh(slug, gateway)

      if (result.status === 204) {
        this.$message({
          message: 'Ad refreshed successfully',
          type: 'success',
          duration: 3000
        })
      } else if (result.status === 200) {
        
        if(typeof result.data === 'string'){
          this.refreshPaymentDialog = false
          window.location.href = result.data
        } else {
          this.$message({
            message: 'Ad refreshed successfully',
            type: 'success',
            duration: 3000
          })
          this.offers = result.data.data
        }
        
      }
      this.loading = false
    },
    async raiseUI (slug, isReduce) {
      this.loading = true
      if (isReduce) {
        slug = slug + '?reduce_raise=true'
      }
      const result = await raise(slug)
      console.log(result)
      if (result.status === 204) {
        this.$message({
          message: 'Advertisement successful',
          type: 'success',
          duration: 3000
        })
      } else if (result.status === 200) {
        console.log('test result', result)
        if(typeof result.data === 'string'){
          window.location.href = result.data
        } else {
          this.$message({
            message: 'Advertisement successful',
            type: 'success',
            duration: 3000
          })
          this.offers = result.data.data
        } 
      }
      this.loading = false
    },
    refreshChecked () {
      if (this.checked_offers.length === 0) {
        this.$message({
          message: 'You must mark the offers to refresh',
          type: 'warning',
          duration: 3000
        })
      }
    },
    refreshOne (id) {
      this.checked_offers.push(id)
      this.refreshChecked()
    },
    deactivateOne (id) {
      this.checked_offers.push(id)
      this.deactivateChecked()
      this.deactivateOnePopoverVisible = false
    },
    async deactivateChecked () {
      this.deactivatePopoverVisible = false
      if (this.checked_offers.length !== 0) {
        const result = await deactivate({ offers: this.checked_offers })
        if (result.status === 200) {
          this.$message({
            message: 'Updated successfully',
            type: 'success',
            duration: 3000
          })
          this.offers = result.data.data
          this.checked_offers = []
        }
      } else {
        this.$message({
          message: 'You must mark the offers to deactivate',
          type: 'warning',
          duration: 3000
        })
      }
    }
  }
}
</script>

<style lang="scss">
.stripe {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.offers-list {
  width: 100%;

  .el-button.is-round {
    border-radius: 10px;
  }

  @media only screen and (max-width: 834px) {
    .el-dialog {
      width: 90%;
    }
  }

  .pagination-section {
    text-align: center;
  }

  .panel {
    // display: flex;
    margin-left: 75px;
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
      width: 90%;
      border: 1px solid gray;
      padding: 16px 16px 16px 6px;
      margin-bottom: 20px;
      position: relative;

      @media only screen and (max-width: 1110px) {
        width: 90%;
      }

      .left {
        display: flex;
        width: 50%;
        min-width: 600px;

        @media only screen and (max-width: 843px) {
          width: 100%;
          min-width: unset;
        }
      }

      .subscription-badge {
        position: absolute;
        left: 0;
        top: 0;
        background: #D3D3D3;
        padding: 4px 10px;
        color: #000000;
        font-size: 14px;
        font-family: 'Inconsolata';
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
          font-family: 'Inconsolata';
          color: #000000;
          text-decoration: none;
        }
        .location {
          font-size: 15px;
        }
        .stats {
          padding: 10px 0;
          font-size: 15px;
          font-family: 'Inconsolata';
          display: flex;
          justify-content: center;
          align-items: flex-start;
          .views {
            padding: 10px 10px 0 0;
            span {
              color: #ff19b7;
              font-weight: bold;
              font-family: 'Inconsolata';
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
          // width: 100%;
          display: flex;
          align-items: center;
          padding: 10px;
          .edit-btn, .promo-btn, .refresh-btn, span {
            width: 50%;
            text-align: center;
            .promo {
              background-color: #FFE122;
              border: 1px solid #FFD165;
              color: #000000;
            }
          }
          button {
            margin-right: 10px;
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
              color: #ff19b7;
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
  .search-box-btn {
    margin-left: 5px;
    margin-right: 5px;
  }
  .search-row {
    margin-bottom: 5px;
  }
  .mr-5 {
    margin-right: 5px;
  }
}
</style>
