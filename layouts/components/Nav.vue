<template>
  <div>
    <div class="nav">
      <div class="nav-brand-search">
        <n-link to="/" class="logo">
          <!-- <h1>Dazu</h1> -->
          <img src="~/assets/logo.svg" alt="">
        </n-link>
        <div class="search">
          <el-input
            v-model="search"
            :class="[isHomePage ? 'search-input' : 'search-input black-text']"
            placeholder="Search"
            prefix-icon="el-icon-search"
            @keyup.enter.native="searchPhrase"
          />
          <!-- <el-button icon="el-icon-s-operation" @click="searchPopup = true">
            Advanced
          </el-button> -->
        </div>
        <div class="nav-search-items">
          <el-button class="modal-button" type="default" plain @click="$event => showSearchModal('sale')">
            For Sale
          </el-button>
          <el-button class="modal-button" type="default" plain @click="$event => showSearchModal('rent')">
            For Rent
          </el-button>
          <el-button class="modal-button" type="default" plain @click="$event => showSearchModal('auctions')">
            Auctions
          </el-button>
          <el-button class="modal-button" type="default" plain @click="$event => showSearchModal('swap')">
            Swap
          </el-button>
        </div>
      </div>
      <div class="nav-links">
        <div class="mobile-menu">
          <i class="el-icon-s-fold" @click="mobileNav = !mobileNav" />
          <el-drawer
            size="50%"
            :visible.sync="mobileNav"
            :before-close="handleClose"
          >
            <nuxt-link to="/dodaj-ogloszenie">
              <div class="nav-menu-item">
                Post Ad
              </div>
            </nuxt-link>
            <nuxt-link v-if="user.isLogged" to="/ustawienia-konta">
              <div class="nav-menu-item">
                Settings
              </div>
            </nuxt-link>
            <nuxt-link v-if="user.isLogged" to="/ulubione">
              <div class="nav-menu-item">
                Favorite
              </div>
            </nuxt-link>
            <nuxt-link v-if="user.isLogged" to="/moje-ogloszenia">
              <div class="nav-menu-item">
                My Announcements  
              </div>
            </nuxt-link>
            <!-- <nuxt-link v-if="user.roles.includes('company')" to="/agenci">
              <div class="nav-menu-item">
                Agenci
              </div>
            </nuxt-link> -->
            <nuxt-link v-if="user.isLogged" to="/faktury">
              <div class="nav-menu-item">
                Payment history
              </div>
            </nuxt-link>
            <div v-if="!user.isLogged" @click="toggleLogin">
              <div class="nav-menu-item">
                Login/Registration
              </div>
            </div>
            <div v-if="user.isLogged" @click="logout">
              <div class="nav-menu-item">
                Log out
              </div>
            </div>
          </el-drawer>
        </div>
        <div class="menu">
          <div
            v-if="user.isLogged"
            class="icons"
          >
            <nuxt-link to="/ulubione">
              <HeartIcon class="favourites" />
            </nuxt-link>
            <Notifications
              :show-list="visibleNotifications"
              @toggle="visibleNotifications = !visibleNotifications"
            />
          </div>
          <div v-if="!user.isLogged" class="login" :class="[isHomePage ? 'wht-clr' : '']" @click="toggleLogin">
            <el-button type="info" plain>
              Login/Registration
            </el-button>
          </div>
          <el-dropdown v-if="user.isLogged" @command="handleCommand">
            <nuxt-link to="/ustawienia-konta">
              <div class="login account" :class="[isHomePage ? 'wht-clr' : '']">
                <el-avatar :size="60" :src="this.$config.baseUrl + '/svg/avatar.svg'" />
              </div>
            </nuxt-link>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="settings">
                Settings
              </el-dropdown-item>
              <el-dropdown-item command="favorites">
                Favorite
              </el-dropdown-item>
              <el-dropdown-item command="ads">
                My Announcements
              </el-dropdown-item>
              <el-dropdown-item
                v-if="user.roles.includes('company')"
                command="agents"
              >
                Agents
              </el-dropdown-item>
              <el-dropdown-item command="payments">
                Payment history
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                Log out
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <nuxt-link to="/dodaj-ogloszenie">
            <el-button type="primary" class="add-offer pulse-add">
              Post Ad
            </el-button>
          </nuxt-link>
        </div>
      </div>
    </div>
    <Login
      :visible="loginVisible"
      @toggle-popup="toggleLogin"
      @toggle-register-popup="toggleRegister"
    />
    <Register
      :visible="registerVisible"
      @toggle-popup="toggleRegister"
      @toggle-login-popup="toggleLogin"
    />
    <div v-if="searchPopup" class="search-popup">
      <div class="popup-container">
        <div class="close-btn" @click="searchPopup = false">
          <i class="el-icon-circle-close" />
        </div>
        <AdvancedSearch
          :only-advanced="true"
          @close="searchPopup = false"
        />
      </div>
    </div>
    <el-dialog :visible.sync="searchSaleModal" v-if="rootCategories.length > 0">
      <el-row>
        <el-col :span="8" class="col-with-border">
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[0].value, 'sale')">All Houses</div>
          <ul class="category-list-ul">
            <li class="category-list" v-for="subCategory in rootCategories[0].options">
              <span @click="searchCategoryPhrase(subCategory.value, 'sale')">{{ subCategory.label }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="8" class="col-with-border">
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[1].value, 'sale')">All Flats</div>
          <ul class="category-list-ul">
            <li class="category-list" v-for="subCategory in rootCategories[1].options">
              <span @click="searchCategoryPhrase(subCategory.value, 'sale')">{{ subCategory.label }}</span>
            </li>
          </ul>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[2].value, 'sale')">All Land</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[3].value, 'sale')">All Camping/Caravan</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[5].value, 'sale')">All Summer/Holiday properties</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[6].value, 'sale')">All Parking</div>
        </el-col>
        <el-col :span="8" class="col-with-border">
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[8].value, 'sale')">All Retirement</div>
          <ul class="category-list-ul">
            <li class="category-list" v-for="subCategory in rootCategories[8].options">
              <span @click="searchCategoryPhrase(subCategory.value, 'sale')">{{ subCategory.label }}</span>
            </li>
          </ul>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[7].value, 'sale')">All Development Opportunity</div>
          <ul class="category-list-ul">
            <li class="category-list" v-for="subCategory in rootCategories[7].options">
              <span @click="searchCategoryPhrase(subCategory.value, 'sale')">{{ subCategory.label }}</span>
            </li>
          </ul>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[4].value, 'sale')">All Commercial</div>
          <ul class="category-list-ul">
            <li class="category-list" v-for="subCategory in rootCategories[4].options">
              <span @click="searchCategoryPhrase(subCategory.value, 'sale')">{{ subCategory.label }}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <span class="root-category" @click="searchCategoryPhrase('all', 'sale')">All for Sale</span>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="searchRentModal" v-if="rootCategories.length > 0">
      <el-row>
        <el-col :span="8" class="col-with-border">
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[0].value, 'rent')">All Houses</div>
          <ul class="category-list-ul">
            <li class="category-list" v-for="subCategory in rootCategories[0].options">
              <span @click="searchCategoryPhrase(subCategory.value, 'rent')">{{ subCategory.label }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="8" class="col-with-border">
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[1].value, 'rent')">All Flats</div>
          <ul class="category-list-ul">
            <li class="category-list" v-for="subCategory in rootCategories[1].options">
              <span @click="searchCategoryPhrase(subCategory.value, 'rent')">{{ subCategory.label }}</span>
            </li>
          </ul>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[9].value, 'rent')">All Rooms</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[2].value, 'rent')">All Land</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[3].value, 'rent')">All Camping/Caravan</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[5].value, 'rent')">All Summer/Holiday properties</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[6].value, 'rent')">All Parking</div>
        </el-col>
        <el-col :span="8" class="col-with-border">
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[8].value, 'rent')">All Retirement</div>
          <ul class="category-list-ul">
            <li class="category-list" v-for="subCategory in rootCategories[8].options">
              <span @click="searchCategoryPhrase(subCategory.value, 'rent')">{{ subCategory.label }}</span>
            </li>
          </ul>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[7].value, 'rent')">All Development Opportunity</div>
          <ul class="category-list-ul">
            <li class="category-list" v-for="subCategory in rootCategories[7].options">
              <span @click="searchCategoryPhrase(subCategory.value, 'rent')">{{ subCategory.label }}</span>
            </li>
          </ul>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[4].value, 'rent')">All Commercial</div>
          <ul class="category-list-ul">
            <li class="category-list" v-for="subCategory in rootCategories[4].options">
              <span @click="searchCategoryPhrase(subCategory.value, 'rent')">{{ subCategory.label }}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <span class="root-category" @click="searchCategoryPhrase('all', 'rent')">All for Rent</span>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="searchAuctionsModal" v-if="rootCategories.length > 0">
      <el-row>
        <el-col :span="8" class="col-with-border">
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[0].value, 'auctions')">Houses</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[1].value, 'auctions')">Flats</div>
        </el-col>
        <el-col :span="8" class="col-with-border">
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[8].value, 'auctions')">Retirement</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[3].value, 'auctions')">Camping/Caravan</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[5].value, 'auctions')">Summer/Holiday properties</div>
        </el-col>
        <el-col :span="8" class="col-with-border">
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[6].value, 'auctions')">Parking</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[2].value, 'auctions')">Land</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[7].value, 'auctions')">Development Opportunity</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[4].value, 'auctions')">Commercial</div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <span class="root-category" @click="searchCategoryPhrase('all', 'auctions')">All for Auctions</span>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="searchSwapModal" v-if="rootCategories.length > 0">
      <el-row>
        <el-col :span="8" class="col-with-border">
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[0].value, 'swap')">Houses</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[1].value, 'swap')">Flats</div>
          <div class="root-category">Room</div>
        </el-col>
        <el-col :span="8" class="col-with-border">
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[8].value, 'swap')">Retirement</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[3].value, 'swap')">Camping/Caravan</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[5].value, 'swap')">Summer/Holiday properties</div>
        </el-col>
        <el-col :span="8" class="col-with-border">
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[6].value, 'swap')">Parking</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[2].value, 'swap')">Land</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[7].value, 'swap')">Development Opportunity</div>
          <div class="root-category" @click="searchCategoryPhrase(rootCategories[4].value, 'swap')">Commercial</div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <span class="root-category" @click="searchCategoryPhrase('all', 'swap')">All for Swap</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { HeartIcon } from 'vue-feather-icons'
import Login from '@/components/auth/Login'
import Register from '@/components/auth/Register'
import AdvancedSearch from '@/components/home_page/AdvancedSearch'
import Notifications from '@/components/Notifications'
import { buildSearchQuery } from '@/helpers'
import { index as categoryIndex } from '@/api/categories'

export default {
  name: 'Nav',
  components: {
    HeartIcon,
    Login,
    Register,
    AdvancedSearch,
    Notifications,
  },
  data: () => ({
    search: '',
    registerVisible: false,
    searchPopup: false,
    notifications: [],
    visibleNotifications: false,
    mobileNav: false,
    user: '',
    searchSaleModal: false,
    searchRentModal: false,
    searchAuctionsModal: false,
    searchSwapModal: false,
    rootCategories: [],
  }),
  mounted () {
    this.user = this.$store.state.user;
    this.getCategories()
    console.log(this.user)
  },
  computed: {
    isHomePage () {
      return this.$route.path === '/'
    },
    loginVisible () {
      return this.$store.state.user.loginFirst
    }
  },
  watch: {
    rootCategories( vaule) {
      console.log(vaule)
    }
  },
  methods: {
    handleClose () {
      this.mobileNav = false
    },
    searchPhrase () {
      this.$router.push({ path: '/szukaj', query: buildSearchQuery({ phrase: this.search }) })
    },
    searchCategoryPhrase (category, type) {
      if( type === 'sale') this.searchSaleModal = false
      else if (type === 'rent') this.searchRentModal = false
      else if ( type === 'auctions') this.searchAuctionsModal = false
      else if ( type === 'swap') this.searchSwapModal = false

      this.$router.push({ path: '/szukaj', query: buildSearchQuery({ phrase: category, phrase_type: type}) })
    },
    toggleLogin () {
      this.$store.dispatch('user/setLoginFirst', !this.loginVisible)
    },
    toggleRegister () {
      this.registerVisible = !this.registerVisible
    },
    logout () {
      this.$store.dispatch('user/logout')
      this.$router.push('/')
    },
    settings () {
      this.$router.push({ path: '/ustawienia-konta' })
    },
    favorites () {
      this.$router.push({ path: '/ulubione' })
    },
    ads () {
      this.$router.push({ path: '/moje-ogloszenia' })
    },
    agents () {
      this.$router.push({ path: '/agenci' })
    },
    payments () {
      this.$router.push({ path: '/faktury' })
    },
    handleCommand (command) {
      this[command]()
    },
    showSearchModal(type) {
      if( type === 'sale') {
        this.searchSaleModal = true
      } else if ( type === 'rent') {
        this.searchRentModal = true
      } else if ( type === 'auctions') {
        this.searchAuctionsModal = true
      } else if ( type === 'swap') {
        this.searchSwapModal = true
      }
    },
    async getCategories () {
      const categories = await categoryIndex()
      if (categories.status === 200) {
        this.rootCategories = categories.data.map((category) => {
          const children = category.children.map((sub) => {
            return {label: sub.name, value: sub.slug, parent_value:category.slug, id: sub.id, offer_types: sub.offer_types ? sub.offer_types : []}
          })
          // return category
          return { label: category.name, value: category.slug, id: category.id, options: children,offer_types: category.offer_types ? category.offer_types : [] }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.nuxt-link-active {
  text-decoration: none;
}
.el-dialog {
  border-radius: 20px;
}
.pulse-add {
  color: #ffffff;
  background: rgb(255 25 183 / 80%);
  animation: pulse-add 2s infinite;
  border: none;
}

@keyframes pulse-add {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgb(255 25 183 / 70%);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 12px rgb(255 25 183 / 0%);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgb(255 25 183 / 0%);
  }
}

a {
  text-decoration: none!important;
}

.nav-menu-item {
  color: #000000;
  padding: 6px 10px;
  border-bottom: 1px solid #f5f5f5;
}

.search-popup {
  background: rgb(0 0 0 / 75%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 3;

  .popup-container {
    position: relative;
    width: 82%;

    @media only screen and (max-width: 1100px) {
      width: 90%;
    }

    .close-btn {
      position: absolute;
      color: white;
      top: 34px;
      right: -15px;
      font-size: 40px;
      cursor: pointer;

      @media only screen and (max-width: 840px) {
        top: -20px;
      }
    }

    .advanced-search {
      width: 100%;
    }
  }
}

.nav {
  padding: 24px 24px 0 24px;
  right: 0;
  left: 0;
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color:white;
  .nav-brand-search {
    width:80%;
    display: flex;
    flex-direction:row;
    align-items: center;
    .logo {
      color: #ff19b7;
      cursor: pointer;
      width: 25%;
      text-align: left;
  
      @media only screen and (max-width: 1100px) {
        width: 50%;
      }
      img {
        width: 90px !important;
      }
    }
    .nav-search-items{
      width: 50%;
      display:flex;
      justify-content:flex-end;
      color: #0C0C0C;
      font-family: 'Inconsolata';
      button {
        border-color: transparent;
      }
    }
  
    .search {
      width: 25%;
      height: 36px;
      position: relative;
      background: #FFFFFF;
      /* Grey Mid */
  
      border: 1px solid #A0A0A0;
      border-radius: 4px;
     
      @media only screen and (max-width: 1100px) {
        display: none;
      }
  
      button {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        margin: 8px;
        padding: 2px 7px;
      }
  
      .black-text {
        input {
          color: #000000!important;
        }
      }
  
      .search-input {
        padding: 0 10px 0 0;
  
        input {
          background: transparent;
          border: 0;
          border-bottom: 1px solid #f5f5f5;
          border-radius: 0;
          color: rgba(26, 26, 26, 0.5);
          padding-left: 36px;
        }
      }
    }
  }
  .nav-links {
    width:30%;
    display:flex;
    flex-direction: row;
    .mobile-menu {
      width: 50%;
      display: none;
  
      i {
        background: #fff;
      }
  
      @media only screen and (max-width: 1100px) {
        display: flex;
        justify-content: flex-end;
        color: #000;
        font-size: 24px;
      }
    }
  
    .menu {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
  
      @media only screen and (max-width: 1100px) {
        display: none;
      }
  
      a {
        text-decoration: none;
        outline: 0;
        color:#0C0C0C !important;
      }
  
      .icons {
        position: relative;
        display: flex;
        @media only screen and (max-width: 1366px) {
          display: none;
        }
  
        .favourites, .notifications {
          color: #999b97;
          cursor: pointer;
  
          &:hover {
            color: #ff19b7;
          }
        }
        .notifications {
          margin: 0 0 0 18px;
        }
        .favourites {
          margin: 0 18px 0 0;
        }
      }
  
      .login {
        font-family: Mulish-Regular;
        cursor: pointer;
        padding: 13px 4px;
        // text-transform: uppercase;
        font-size: 14px;
        outline: 0!important;
  
        &:hover {
          color: #ff19b7;
        }
      }
      .wht-clr {
        color: #ffffff !important;
      }
      .add-offer {
        font-family: 'Inconsolata';
        background: #ff19b7;
        border-color: #ff19b7;
      }
    }
  }
}
.category-list-ul {
  list-style: none;
  padding: 0px;
  .category-list {
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    border-radius: 10px;
  }
  .category-list:hover {
    background-color: rgb(228, 228, 228);
  }
}
.root-category {
  padding: 10px 10px 10px 3px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border-radius: 10px;
}
.modal-button {
  font-family: 'Inconsolata';
  font-weight: bold;
}
.root-category:hover {
  background-color: rgb(228, 228, 228);
}
.col-with-border {
  //border-right: 1px solid #f0f0f0;
  //padding: 20px;
}
.col-with-border:last-child {
  //border-right: none; /* remove the border from the last column */
}
.account {
  color: black;
}
</style>
