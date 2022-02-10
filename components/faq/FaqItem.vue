<template>
  <el-collapse-item :title="title" :name="title">
    <p v-html="content" />
  </el-collapse-item>
</template>

<script>
export default {
  name: 'FaqItem',
  props: {
    title: {
      type: String,
      default () {
        return ''
      }
    },
    content: {
      type: String,
      default () {
        return ''
      }
    }
  }
}
</script>

<style lang="scss">
.el-collapse-item__header {
  position: relative;
  justify-content: center !important;
  font-size: 15px;

  .el-collapse-item__arrow {
    position: absolute;
    right: 0;
  }
}
</style>
