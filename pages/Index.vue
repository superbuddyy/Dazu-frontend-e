<template>
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
      v-if="customPopup"
      @close="customPopup = false"
    />
  </div>
</template>
<script>
import AdvancedSearch from '@/components/home_page/AdvancedSearch'
import OffersCarousel from '@/components/OffersCarousel'
import AccountTypeList from '@/components/home_page/AccountTypeList'
import BlogPost from '@/components/home_page/BlogPost'
import { check } from '@/api/auth'
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
    customPopup: false
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
      this.$router.push(this.$route.path)
    }
    this.toggleCookiesPopup()
    this.toggleCustomPopup()
  },
  methods: {
    toggleCookiesPopup () {
      if (Cookies.get('cookies-popup') === undefined) {
        this.cookiesPopup = true
      }
    },
    toggleCustomPopup () {
      if (Cookies.get('custom-popup') === undefined) {
        this.customPopup = true
      }
    },
    async checkAuth () {
      const result = await check()
      if (this.$store.state.user.isLogged && result.data === false) {
        await this.$store.dispatch('user/logout')
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
