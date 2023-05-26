<template>
  <div class="confirm-newsletter">
    <div class="container">
      <h1>Successfully subscribed to the newsletter</h1>
      <p>
        You will be redirected to the home page in a moment. If that doesn't happen
        <nuxt-link :to="'/'">
          kliknij tutaj
        </nuxt-link>
      </p>
    </div>
  </div>
</template>
<script>
import { active } from '@/api/newsleter'

export default {
  name: 'ConfirmNewsletter',
  data: () => ({
    //
  }),
  mounted () {
    this.confirmNewsletter()
  },
  methods: {
    async confirmNewsletter () {
      await active({ token: this.$route.query.token })
    }
  }
}
</script>

<style lang="scss">
.confirm-newsletter {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('~assets/header-background.jpg');
  background-position: top;
  background-size: cover;
  background-repeat: no-repeat;

  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #000000;
  }

  .container {
    background: #ffffff;
    padding: 40px;
    width: 80%;
    margin: 0 auto;
    height: 40vh;
    color: #ff19b7;

    p {
      color: #000000;
      text-align: center;
      padding: 40px;
    }
  }
}
</style>
