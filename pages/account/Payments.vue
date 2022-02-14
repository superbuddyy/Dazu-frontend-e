<template>
  <div class="account-page">
    <AccountMenu
      active="payments"
    />
    <div class="container">
      <PaymentsList />
    </div>
  </div>
</template>
<script>
import AccountMenu from '@/components/account/AccountMenu'
import PaymentsList from '@/components/account/payments/PaymentsList'

export default {
  middleware: 'authenticated',
  name: 'Payments',
  components: {
    AccountMenu,
    PaymentsList
  },
  data: () => ({
    //
  }),
  mounted () {
  },
  methods: {
    //
  }
}
</script>

<style lang="scss">
.account-page {
  min-height: calc(100vh - 274px);
  .container {
    display: flex;
    margin: 0 6vw;
    padding: 60px;
  }
}
</style>
