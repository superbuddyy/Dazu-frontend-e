<template>
  <div class="money">
    {{ preparedMoney }} PLN
  </div>
</template>

<script>
export default {
  name: 'Money',
  props: {
    money: {
      type: Number,
      default () {
        return 1
      }
    }
  },
  computed: {
    preparedMoney () {
      const dividedMoney = this.money / 100
      return dividedMoney.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }
  }
}
</script>

<style scoped>

</style>
