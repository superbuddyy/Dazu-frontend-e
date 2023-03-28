<template>
  <div v-show="visible" class="custom-popup">
    <div class="left">
      <h2>{{ title }}</h2>
      <p v-html="content">
        
      </p>
      <div class="newsletter">
        <div class="container">
          <b>Zapisz się do newslettera</b>
          <div style="margin-top: 15px;">
            <el-input v-model="newsletterEmail" placeholder="Twój email" class="input-with-select">
            </el-input>
            <el-button slot="append" type="primary" @click="addToNewsletter">
              Subskrybuj
            </el-button>
          </div>
        </div>
      </div>
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
import { store } from '../api/newsleter'
export default {
  name: 'CustomPopup',
  data () {
    return {
      visible: false,
      title: '',
      content: '',
      image: '',
      showAgainAfter: 1,
      newsletterEmail: null
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
    async addToNewsletter () {
      const result = await store({ email: this.newsletterEmail })
      if (result.status === 204) {
        this.$message({
          message: 'Potwierdź zapis do newslettera klikając w link wysłany na podany adres email.',
          type: 'success',
          duration: 3000
        })
        this.close()
      } else if (result.status === 200) {
        this.$message({
          message: 'Gratulujemy. Twój newsletter jest aktywny',
          type: 'success',
          duration: 3000
        })
        this.close()
      }
      this.newsletterEmail = null
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
  .newsletter {
    // width: 35%;
    min-width: 320px;
    margin-top: 5px;
    position: absolute;
    bottom: 0;
    left: 70px;
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      @media only screen and (max-width: 640px) {
        align-items: center;
      }
      .el-input {
        width: 80% !important;
      }
      .el-button--primary {
        background-color: #ff19b7!important;
        color: #ffffff!important;
        width: 80%;
        margin-top: 10px !important;
        margin-bottom: 5px !important;
      }
    }
  }
}
</style>
