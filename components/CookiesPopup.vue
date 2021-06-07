<template>
  <div class="cookies-popup">
    <p>
      Informujemy że ta strona używa ciasteczek (cookies), dzięki którym nasz serwis może działać lepiej.
      Więcej na ten temat w dziale Cookies. Pragniemy Cię poinformować, że nasz serwis internetowy może
      personalizować treści marketingowe do Twoich potrzeb. Wyrażenie zgody jest dobrowolne. Masz prawo do:
      dostępu do Twoich danych, ich sprostowania oraz usunięcia. Więcej na ten znajdziesz w Polityce Prywatności.
    </p>
    <el-button class="accept-btn" @click="accept">
      Akceptuje
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
