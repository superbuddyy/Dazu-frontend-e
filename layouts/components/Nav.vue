<template>
  <div>
    <div class="nav">
      <n-link to="/" class="logo">
        <h1>Dazu</h1>
      </n-link>
      <div class="search">
        <el-input
          v-model="search"
          :class="[isHomePage ? 'search-input' : 'search-input black-text']"
          placeholder="Szukaj"
          prefix-icon="el-icon-search"
          @keyup.enter.native="searchPhrase"
        />
        <el-button icon="el-icon-s-operation" @click="searchPopup = true">
          Zaawonsowane
        </el-button>
      </div>
      <div class="mobile-menu">
        <i class="el-icon-s-fold" @click="mobileNav = !mobileNav" />
        <el-drawer
          size="50%"
          :visible.sync="mobileNav"
          :before-close="handleClose"
        >
          <nuxt-link to="/dodaj-ogloszenie">
            <div class="nav-menu-item">
              Dodaj ogłoszenie
            </div>
          </nuxt-link>
          <nuxt-link v-if="$store.state.user.isLogged" to="/ustawienia-konta">
            <div class="nav-menu-item">
              Ustawienia
            </div>
          </nuxt-link>
          <nuxt-link v-if="$store.state.user.isLogged" to="/ulubione">
            <div class="nav-menu-item">
              Ulubione
            </div>
          </nuxt-link>
          <nuxt-link v-if="$store.state.user.isLogged" to="/moje-ogloszenia">
            <div class="nav-menu-item">
              Moje Ogłoszenia
            </div>
          </nuxt-link>
          <nuxt-link v-if="$store.state.user.roles.includes('company')" to="/agenci">
            <div class="nav-menu-item">
              Agenci
            </div>
          </nuxt-link>
          <nuxt-link v-if="$store.state.user.isLogged" to="/faktury">
            <div class="nav-menu-item">
              Historia płatności
            </div>
          </nuxt-link>
          <div v-if="!$store.state.user.isLogged" @click="toggleLogin">
            <div class="nav-menu-item">
              Zaloguj
            </div>
          </div>
          <div v-if="$store.state.user.isLogged" @click="logout">
            <div class="nav-menu-item">
              Wyloguj
            </div>
          </div>
        </el-drawer>
      </div>
      <div class="menu">
        <div
          v-if="$store.state.user.isLogged"
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
        <div v-if="!$store.state.user.isLogged" class="login" @click="toggleLogin">
          Zaloguj
        </div>
        <el-dropdown v-if="$store.state.user.isLogged" @command="handleCommand">
          <nuxt-link to="/ustawienia-konta">
            <div class="login account">
              Moje konto
            </div>
          </nuxt-link>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="settings">
              Ustawienia
            </el-dropdown-item>
            <el-dropdown-item command="favorites">
              Ulubione
            </el-dropdown-item>
            <el-dropdown-item command="ads">
              Moje Ogłoszenia
            </el-dropdown-item>
            <el-dropdown-item
              v-if="$store.state.user.roles.includes('company')"
              command="agents"
            >
              Agenci
            </el-dropdown-item>
            <el-dropdown-item command="payments">
              Histroia płatności
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided>
              Wyloguj
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <nuxt-link to="/dodaj-ogloszenie">
          <el-button type="primary" round class="add-offer pulse-add">
            Dodaj ogłoszenie
          </el-button>
        </nuxt-link>
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
  </div>
</template>

<script>
import { HeartIcon } from 'vue-feather-icons'
import Login from '@/components/auth/Login'
import Register from '@/components/auth/Register'
import AdvancedSearch from '@/components/home_page/AdvancedSearch'
import Notifications from '@/components/Notifications'
import { buildSearchQuery } from '@/helpers'

export default {
  name: 'Nav',
  components: {
    HeartIcon,
    Login,
    Register,
    AdvancedSearch,
    Notifications
  },
  data: () => ({
    search: '',
    registerVisible: false,
    searchPopup: false,
    notifications: [],
    visibleNotifications: false,
    mobileNav: false
  }),
  computed: {
    isHomePage () {
      return this.$route.path === '/'
    },
    loginVisible () {
      return this.$store.state.user.loginFirst
    }
  },
  methods: {
    handleClose () {
      this.mobileNav = false
    },
    searchPhrase () {
      this.$router.push({ path: '/szukaj', query: buildSearchQuery({ phrase: this.search }) })
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
    }
  }
}
</script>

<style lang="scss">
.nuxt-link-active {
  text-decoration: none;
}

.pulse-add {
  color: #ffffff;
  background: rgb(0 158 121 / 80%);
  animation: pulse-add 2s infinite;
  border: none;
}

@keyframes pulse-add {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgb(0 158 121 / 70%);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 12px rgb(0 158 121 / 0%);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgb(0 158 121 / 0%);
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
  margin: 0 6vw;
  right: 0;
  left: 0;
  position: absolute;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 80px;

  .logo {
    color: #5dca8c;
    cursor: pointer;
    width: 25%;
    text-align: left;

    @media only screen and (max-width: 1100px) {
      width: 50%;
    }
  }

  .search {
    width: 40%;
    position: relative;

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
        color: #ffffff;
        padding-left: 36px;
      }
    }
  }

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
    justify-content: space-around;
    align-items: center;
    width: 35%;

    @media only screen and (max-width: 1100px) {
      display: none;
    }

    a {
      text-decoration: none;
      outline: 0;
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
      color: #000000;
      cursor: pointer;
      padding: 13px 4px;
      text-transform: uppercase;
      font-size: 14px;
      outline: 0!important;

      &:hover {
        color: #ff19b7;
      }
    }

    .add-offer {
      font-family: Mulish-Regular;
      background: #ff19b7;
      border-color: #ff19b7;
    }
  }
}
</style>
