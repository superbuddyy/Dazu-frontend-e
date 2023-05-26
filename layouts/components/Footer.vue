<template>
  <div class="footer">
    <div class="box">
      <div class="info">
        <div class="container">
          <h2>Dazu</h2>
          <p>Real Estate Ads</p>
        </div>
      </div>
      <div class="newsletter">
        <div class="container">
          <b>Subscribe to the newsletter</b>
          <div style="margin-top: 15px;">
            <el-input v-model="newsletterEmail" placeholder="Your e-mail" class="input-with-select">
              <el-button slot="append" type="primary" @click="addToNewsletter">
                Subscribe
              </el-button>
            </el-input>
          </div>
        </div>
      </div>
      <div class="menu">
        <div class="container">
          <ul>
            <li v-for="(item, index) in pages" :key="item.id">
              <template v-if="oddEven(index) ==='odd' ">
                <nuxt-link :to="'/strony/' + item.id">
                  {{ item.title }}
                </nuxt-link>
              </template>
            </li>
          </ul>
          <ul>
            <li v-for="(item, index) in pages" :key="item.id">
              <template v-if="oddEven(index) ==='even' ">
                <nuxt-link :to="'/strony/' + item.id">
                  {{ item.title }}
                </nuxt-link>
              </template>
            </li>
          </ul>
          <ul>
            <!-- <li>
              <nuxt-link to="/">
                O nas
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/">
                Polityka prywatności
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/">
                Regulamin
              </nuxt-link>
            </li> -->
            <li>
              <nuxt-link to="/kontakt">
                Contact
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/faq">
                FAQ
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/">
                Home
              </nuxt-link>
            </li>
            <li>
              <div v-if="!user.isLogged" class="login" @click="toggleLogin">
                Login/Registration
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        Dazu.pl
      </div>
      <div class="right">
        All Right reserved Dazu.pl 2020
      </div>
    </div>
    <Login
      :visible="loginVisible"
      @toggle-popup="toggleLogin"
      @toggle-register-popup="toggleRegister"
    />
    <Register
      :visible="registerVisible"
      @toggle-popup="toggleRegister"
      @toggle-login-popup="toggleLogin"
    />
  </div>
</template>

<script>
import { store } from '@/api/newsleter'
import { index } from '@/api/footers'
import Login from '@/components/auth/Login'
import Register from '@/components/auth/Register'
export default {
  name: 'Footer',
  components: {
    Login,
    Register,
  },
  data: () => ({
    newsletterEmail: null,
    oldUrl: '',
    pages: [],
    user: ''
  }),
  watch: {
    '$route.path' (value) {
      if (this.oldUrl !== value) {
        this.newsletterEmail = ''
      }
    }
  },
  mounted () {
    this.user = this.$store.state.user;
    this.getPages()
  },
  methods: {
    toggleLogin () {
      this.$store.dispatch('user/setLoginFirst', !this.loginVisible)
    },
    oddEven (ind) {
      ind = ind + 1
      if (ind % 2 === 0) {
        return 'even'
      } else {
        return 'odd'
      }
    },
    async getPages () {
      const result = await index()
      if (result.status === 200) {
        this.pages = result.data
      }
    },
    async addToNewsletter () {
      const result = await store({ email: this.newsletterEmail })
      if (result.status === 204) {
        this.$message({
          message: 'Confirm your subscription to the newsletter by clicking on the link sent to the e-mail address provided.',
          type: 'success',
          duration: 3000
        })
      } else if (result.status === 200) {
        this.$message({
          message: 'Congratulations. Your newsletter is active',
          type: 'success',
          duration: 3000
        })
      }
      this.newsletterEmail = null
    }
  }
}
</script>

<style lang="scss">
  .footer {
    background: #f5f5f5;

    .box {
      min-height: 25vh;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding: 40px 0;
      margin: 0 6vw;
      .info {
        width: 30%;
        min-width: 240px;
        margin-top: 20px;
        .container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          @media only screen and (max-width: 640px) {
            align-items: center;
          }

          h2 {
            color: #ff19b7;
          }
          p {
            color: #000000;
            font-weight: bold;
          }
          
        }
      }
      .newsletter {
        width: 35%;
        min-width: 320px;
        margin-top: 20px;
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          @media only screen and (max-width: 640px) {
            align-items: center;
          }
          .el-button--primary {
            background-color: #ff19b7!important;
            color: #ffffff!important;
          }
        }
      }
      .menu {
        width: 35%;
        min-width: 320px;
        margin-top: 20px;
        .container {
          display: flex;
          justify-content: space-around;
          align-items: flex-start;
          @media only screen and (max-width: 640px) {
            align-items: center;
          }
          .login {
            cursor: pointer;
            &:hover {
              color: #ff19b7;
            }
          }
          ul {
            list-style: none;
            li {
              margin: 4px;
              a {
                color: #000000;
              }
            }
          }
        }
      }
    }

    .bottom {
      color: #676767;
      background: #e2e2e2;
      padding: 10px;
      display: flex;
      .left {
        width: 50%;
        text-align: left;
      }
      .right {
        width: 50%;
        text-align: right;
      }
    }
  }
</style>
