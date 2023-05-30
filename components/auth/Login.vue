<template>
  <el-dialog title="" :visible.sync="localVisible" :close-on-click-modal="false" :class="[failed ? 'login-popup shake' : 'login-popup']">
    <h3>Logowanie</h3>
    <el-form @submit.prevent="login">
      <el-input
        v-model="loginForm.email"
        prefix-icon="el-icon-s-custom"
        placeholder="Email"
        name="email"
        @keyup.enter.native="login"
      />
      <el-input
        v-model="loginForm.password"
        type="password"
        autocomplete="off"
        show-password
        prefix-icon="el-icon-key"
        placeholder="Hasło"
        @keyup.enter.native="login"
      />
      <div class="btns">
        <el-button type="primary" class="login-btn" @click="login">
          Log in
        </el-button>
        <el-button class="login-btn" @click="openRegister">
          Create an account
        </el-button>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="link" @click="openRemindPassword">
        Password reminder
      </div>
      <div class="link" @click="openResendMail">
        Resend your account activation email
      </div>
    </span>
  </el-dialog>
</template>
<script>
import { csrf, remindPassword, resendMail } from '@/api/auth'

export default {
  props: {
    visible: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    failed: false,
    loginForm: {
      email: '',
      password: ''
    }
  }),
  computed: {
    localVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('toggle-popup')
      }
    }
  },
  methods: {
    async login () {
      await csrf()
      await this.$store.dispatch('user/login', this.loginForm)
      console.log('test')
      this.$emit('toggle-popup')
      this.clearForm()
      await this.$store.dispatch('user/setLoginFirst', false)
    },
    clearForm () {
      this.loginForm = {
        email: '',
        password: ''
      }
    },
    openRegister () {
      this.$emit('toggle-popup')
      this.$emit('toggle-register-popup')
    },
    openRemindPassword () {
      this.$emit('toggle-popup')
      this.$prompt('Please enter your email address to reset your password', 'Password reminder', {
        confirmButtonText: 'Send',
        cancelButtonText: 'Close',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: 'Incorrect e-mail address!',
        inputPlaceholder: 'Email'
      }).then(async ({ value }) => {
        const result = await remindPassword({ email: value })
        if (result.status === 204) {
          this.$message({
            type: 'success',
            message: 'A password reset link has been sent to the email address provided: ' + value,
            duration: 3000
          })
        }
      }).catch(() => {
      })
    },
    openResendMail () {
      this.$emit('toggle-popup')
      this.$prompt('Please enter your email address for activation mail', 'Activation mail', {
        confirmButtonText: 'Send',
        cancelButtonText: 'Close',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: 'Incorrect e-mail address!',
        inputPlaceholder: 'Email'
      }).then(async ({ value }) => {
        const result = await resendMail({ email: value })
        if (result.status === 204 || result.status === 200) {
          this.$message({
            type: 'success',
            message: 'A password reset link has been sent to the email address provided: ' + value,
            duration: 3000
          })
        }
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss">
.shake {
  -webkit-animation: kf_shake 0.4s 1 linear;
  -moz-animation: kf_shake 0.4s 1 linear;
  -o-animation: kf_shake 0.4s 1 linear;
}
@-webkit-keyframes kf_shake {
  0% { -webkit-transform: translate(30px); }
  20% { -webkit-transform: translate(-30px); }
  40% { -webkit-transform: translate(15px); }
  60% { -webkit-transform: translate(-15px); }
  80% { -webkit-transform: translate(8px); }
  100% { -webkit-transform: translate(0px); }
}
@-moz-keyframes kf_shake {
  0% { -moz-transform: translate(30px); }
  20% { -moz-transform: translate(-30px); }
  40% { -moz-transform: translate(15px); }
  60% { -moz-transform: translate(-15px); }
  80% { -moz-transform: translate(8px); }
  100% { -moz-transform: translate(0px); }
}
@-o-keyframes kf_shake {
  0% { -o-transform: translate(30px); }
  20% { -o-transform: translate(-30px); }
  40% { -o-transform: translate(15px); }
  60% { -o-transform: translate(-15px); }
  80% { -o-transform: translate(8px); }
  100% { -o-origin-transform: translate(0px); }
}

.login-popup {
  margin: 0 auto;
  width: 800px;
  @media only screen and (max-width: 1100px) {
    width: unset;
    .el-dialog {
      width: 90%;
    }
  }

  h3 {
    margin: 10px 0;
    text-align: center;
  }

  .el-input {
    margin: 10px 0;
  }

  .btns {
    display: flex;
    flex-direction: column;
    width: 100%;
    .login-btn {
      margin: 4px 0 0 0;
    }
  }

  .el-dialog__footer {
    text-align: center;
    .link {
      color: #ff19b7;
      text-decoration: none;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
