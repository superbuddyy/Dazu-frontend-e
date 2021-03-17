<template>
  <div class="account-types-list-bg">
    <h2 class="title">
      Dodaj ogłoszenie
    </h2>
    <div class="account-types-list">
      <Subscriptions
        @set-active-item="setActiveItem"
      />
      <el-button
        type="primary"
        round
        class="add-btn"
        @click="add"
      >
        Dodaj
      </el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AccountTypeList',
  data: () => ({
    active_item: null,
    items: [],
    paymentDialog: false,
    loading: false
  }),
  methods: {
    async add () {
      await this.$router.push('/dodaj-ogloszenie?option=' + this.active_item)
    },
    setActiveItem (id) {
      this.active_item = id
    }
  }
}
</script>

<style lang="scss">
  .payments {
    display: flex;
    justify-content: center;
    .paypal {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }

  .account-types-list-bg > .title {
    background: #f5f5f5;
    padding: 20px 0;
    text-align: center;
  }
  .account-types-list {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background: #f5f5f5;
    min-height: 46vh;

    .add-btn {
      width: 260px;
      margin-bottom: 20px;
    }
  }
</style>
