<template>
  <div class="cookies-popup">
    <p>
      Please be advised that this website uses cookies, thanks to which our website can work better.
      More on this topic in the Cookies section. We would like to inform you that our website may
      personalize marketing content to your needs. Consent is voluntary. You have the right to:
      access to your data, rectification and deletion. More on this can be found in the Privacy Policy.
    </p>
    <el-button class="accept-btn" @click="accept">
      I accept
    </el-button>
  </div>
</template>

<script>
import * as Cookies from 'js-cookie'

export default {
  name: 'CookiesPopup',
  methods: {
    accept () {
      Cookies.set('cookies-popup', 'true')
      this.$emit('accept-cookies')
    }
  }
}
</script>

<style lang="scss" scoped>
  .cookies-popup {
    z-index: 999999;
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: #041e15;
    color: #ffffff;
    padding: 10px;
    width: 50%;
    font-size: 13px;

    .accept-btn {
      float: right;
    }
  }
</style>
