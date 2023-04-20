<template>
  <div class="my-offers">
    <AccountMenu
      active="offers"
    />
    <div class="container">
      <!-- <OffersList /> -->
    </div>
  </div>
</template>
<script>
import AccountMenu from '@/components/account/AccountMenu'
// import OffersList from '@/components/account/my_offers/OffersList'

export default {
  middleware: 'authenticated',
  name: 'MyOffers',
  components: {
    AccountMenu,
    // OffersList
  },
  data: () => ({
    //
    user: ''
  }),
  mounted () {
    this.user = this.$store.state.user;
  },
  methods: {
    //
  }
}
</script>

<style lang="scss" scoped>
.my-offers {
  min-height: calc(100vh - 274px);
  .container {
    display: flex;
    margin: 0 6vw;
    padding: 60px;
    @media only screen and (max-width: 1600px) {
      padding: 60px 0;
      margin: 0;
    }
  }
}
</style>
