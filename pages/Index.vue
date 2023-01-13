<template>
  <client-only> 
    <div class="center content-inputs">
      <div class="header">
        <AdvancedSearch />
      </div>
      <div class="content">
        <OffersCarousel />
        <AccountTypeList />
        <BlogPost />
      </div>
      <CookiesPopup
        v-if="cookiesPopup"
        @accept-cookies="cookiesPopup = false"
      />
      <CustomPopup
        v-if="customPopupCookie"
        @close="closeCustomPopup"
      />
    </div>
    <template #placeholder>
      <p>Wait a sec</p>
    </template>
  </client-only>
</template>
<script>
import AdvancedSearch from '@/components/home_page/AdvancedSearch'
import OffersCarousel from '@/components/OffersCarousel'
import AccountTypeList from '@/components/home_page/AccountTypeList'
import BlogPost from '@/components/home_page/BlogPost'
import { check, csrf } from '@/api/auth'
import { verifyContact } from '@/api/contact'
import * as Cookies from 'js-cookie'
import CookiesPopup from '../components/CookiesPopup'
import CustomPopup from '../components/CustomPopup'

export default {
  components: {
    AdvancedSearch,
    OffersCarousel,
    AccountTypeList,
    BlogPost,
    CookiesPopup,
    CustomPopup
  },
  data: () => ({
    cookiesPopup: false,
    customPopupCookie: false
  }),
  mounted () {
    this.$ga.page({
      page: '/',
      title: 'Strona główna',
      location: window.location.href
    })
    this.checkAuth()
    if (this.$route.query['payment-status'] === 'fail') {
      this.$message({
        message: 'Płatność nie została zrealizowana',
        type: 'warning',
        duration: 3000
      })
      this.$router.push(this.$route.path)
    }
    if (this.$route.query['payment-status'] === 'success') {
      this.$message({
        message: 'Płatność została zrealizowana.',
        type: 'success',
        duration: 3000
      })
      if (this.$store.state.user.isLogged) {
        this.$router.push('/moje-ogloszenia')
      } else {
        this.$router.push(this.$route.path)
      }
    }
    if (this.$route.query.token) {
      this.verifyToken()
    }
    if (this.$route.query['test-msg'] === 'success') {
      this.$message({
        message: 'Test success msg.',
        type: 'success',
        duration: 30000
      })
    }
    if (this.$route.query['test-msg'] === 'fail') {
      this.$message({
        message: 'Test fail msg.',
        type: 'warning',
        duration: 30000
      })
    }
    this.toggleCookiesPopup()
    this.toggleCustomPopup()

    if (this.$store.state.user.isLogged) {
      console.log('isLoggedasdf')
    } else {
      console.log('tdsata', this.$route.path)
    }
  },
  methods: {
    closeCustomPopup () {
      this.customPopupCookie = false
      this.customPopup = false
    },
    toggleCookiesPopup () {
      if (Cookies.get('cookies-popup') === undefined) {
        this.cookiesPopup = true
      }
    },
    toggleCustomPopup () {
      if (Cookies.get('custom-popup') === undefined) {
        this.customPopupCookie = true
      }
    },
    async checkAuth () {
      const result = await check()
      if (this.$store.state.user.isLogged && result.data === false) {
        await this.$store.dispatch('user/logout')
      }
    },
    verifyToken () {
      csrf().then(async () => {
        await this.apiCall()
      })
    },
    async apiCall () {
      const result = await verifyContact({ token: this.$route.query.token })
      if (result.status === 204 || result.status === 200) {
        this.$message({
          message: 'Wiadomość została wysłana',
          type: 'success',
          duration: 3000
        })
        this.$router.push(this.$route.path)
      }
    }
  }
}
</script>

<style lang="scss">
  .el-cascader-menu, .el-select-dropdown__item, .el-checkbox {
    color: #000000;
  }

  .el-message__content {
    color: #000000!important;
    font-weight: bold;
  }
  .header {
    width: 100%;
    min-height: 50vh;
    background-image: url('~assets/header-background.jpg');
    background-position: top;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;

    @media only screen and (max-width: 1100px) {
      min-height: 100vh;
    }

    @media only screen and (max-width: 834px) {
      .el-dialog {
        width: 90%;
      }
    }
  }
</style>
