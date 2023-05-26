<template>
  <el-form-item label="Announcement type">
    <el-button type="plain" :class="[ type === 'sell' ? 'active' : '' ]" @click="setType('sell')">
      I will sell
    </el-button>
    <el-button type="plain" :class="[ type === 'rent' ? 'active' : '' ]" @click="setType('rent')">
      I will rent
    </el-button>
    <el-button type="plain" :class="[ type === 'exchange' ? 'active' : '' ]" @click="setType('exchange')">
      I will replace
    </el-button>
    <el-button type="plain" :class="[ type === 'for_free' ? 'active' : '' ]" @click="setType('for_free')">
      I will give
    </el-button>
  </el-form-item>
</template>

<script>
export default {
  name: 'OfferTypeAttribute',
  props: {
    type: {
      type: String,
      default () {
        return 'sell'
      }
    }
  },
  methods: {
    setType (type) {
      this.$emit('set-type', type)
    }
  }
}
</script>

<style scoped>
.active {
  color: #1890ff;
  border-color: #badeff;
  background-color: #e8f4ff;
}
</style>
