<template>
  <div v-if="visible" class="custom-popup">
    <div class="left">
      <h2>{{ title }}</h2>
      <p
        v-html="content"
      />
    </div>
    <div class="right" :style="{backgroundImage: 'url(' + image + ')'}" />
    <div class="close" @click="close">
      <i class="el-icon-error" />
    </div>
  </div>
</template>

<script>
import * as Cookies from 'js-cookie'
import { show } from '../api/popup'

export default {
  name: 'CustomPopup',
  data () {
    return {
      visible: false,
      title: '',
      content: '',
      image: '',
      showAgainAfter: 1
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    close () {
      Cookies.set('custom-popup', 'true', { expires: this.showAgainAfter })
      this.$emit('close')
    },
    async getData () {
      const result = await show(1)
      if (result.status === 200 && result.data.is_active === true) {
        this.title = result.data.title
        this.content = result.data.content
        this.image = result.data.image.url
        this.showAgainAfter = result.data.showAgainAfter
        this.visible = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-popup {
  position: fixed;
  background: #FFFFFF;
  box-shadow: 0 0 10px 3px #333;
  width: 60%;
  height: 50vh;
  top: 10vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;

  @media only screen and (max-width: 1100px) {
    width: 90%;
  }

  .left {
    border-right: 1px solid #000;
    width: 50%;
    justify-content: center;
    h2 {
      text-align: center;
      font-weight: normal;
      background: rgb(4 30 21);
      color: #ffffff;
      padding: 10px;
    }

    p {
      padding: 10px;
    }
  }
  .right {
    width: 50%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .close {
    position: absolute;
    font-size: 27px;
    right: 0;
    top: 0;
    background: #ffffffbf;
    width: 32px;
    height: 32px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
