<template>
  <el-collapse-item :title="title" :name="title">
    <p v-safe-html="content" />
    
  </el-collapse-item>
</template>

<script>
export default {
  name: 'PageItem',
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
    },
    file: {
      type: String,
      default () {
        return null
      }
    }
  },
  data: () => {
    return {
      options: {
        minimizable: false,
        playerSize: 'standard',
        backgroundColor: '#fff',
        backgroundStyle: 'color',
        theme: {
          controlsView: 'standard',
          active: 'light',
          light: {
            color: '#3D4852',
            backgroundColor: '#fff',
            opacity: '0.7'
          },
          dark: {
            color: '#fff',
            backgroundColor: '#202020',
            opacity: '0.7'
          }
        }
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
