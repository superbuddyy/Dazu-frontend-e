<template>
  <el-dialog title="" :visible.sync="localVisible" :close-on-click-modal="false" class="register-popup">
    <h3>Rejestracja</h3>
    <el-form ref="registerForm" :model="registerForm" :rules="rules">
      <el-form-item label="" prop="type">
        <el-select v-model="registerForm.type" placeholder="Jestem" clearable class="who-am-i">
          <el-option
            label="Osobą prywatną"
            value="user"
          />
          <el-option
            label="Agencją nieruchomości"
            value="agency"
          />
          <el-option
            label="Deweloperem"
            value="developer"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="email">
        <el-input
          v-model="registerForm.email"
          prefix-icon="el-icon-s-custom"
          placeholder="Email"
        />
      </el-form-item>
      <el-form-item prop="name">
        <el-input
          v-model="registerForm.name"
          prefix-icon="el-icon-user"
          placeholder="Nazwa firmy lub imię"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          autocomplete="off"
          show-password
          prefix-icon="el-icon-key"
          placeholder="Hasło"
        />
      </el-form-item>
      <el-form-item prop="rePassword">
        <el-input
          v-model="registerForm.rePassword"
          type="password"
          autocomplete="off"
          show-password
          prefix-icon="el-icon-key"
          placeholder="Powtórz hasło"
        />
      </el-form-item>
      <div class="captch" />
      <div class="rules">
        <el-form-item prop="tos">
          <el-checkbox v-model="registerForm.tos" name="tos">
            Rejestrując się akceptujesz <nuxt-link to="/">
              regulamin
            </nuxt-link> Dazu.pl
          </el-checkbox>
        </el-form-item>
      </div>
      <div class="btns">
        <el-button type="primary" class="login-btn" @click="submit">
          Załóż konto
        </el-button>
        <el-button class="login-btn" @click="openLogin">
          Zaloguj się
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>

import { csrf } from '@/api/auth'

export default {
  props: {
    visible: {
      default: false,
      type: Boolean
    }
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Wpisz hasło'))
      } else {
        if (this.registerForm.password !== '') {
          this.$refs.registerForm.validateField('rePassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Powtórz hasło'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('Hasła muszą być takie same'))
      } else {
        callback()
      }
    }
    return {
      tos: false,
      registerForm: {
        type: '',
        name: '',
        email: '',
        password: '',
        rePassword: '',
        tos: ''
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' },
          { pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$', message: 'Hasło musi posiadać co najmnie 6 znaków, 1 dużą literę i jedną liczbę', trigger: 'blur' }
        ],
        rePassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        tos: [
          { required: true, message: 'Akceptacja regulaminu jest wymagana', trigger: 'change' }
        ],
        type: { required: true, message: 'Wybierz kim jesteś?', trigger: 'change' },
        email: [
          { required: true, message: 'Email jest wymagany', trigger: 'change' },
          { type: 'email', message: 'Niepoprawny adres email', trigger: ['blur', 'change'] }
        ],
        name: { required: true, message: 'Nazwa firmy lub imię jest wymagane', trigger: 'change' }
      }
    }
  },
  computed: {
    localVisible: {
      get () {
        return this.visible
      },
      set () {
        // $emit is the correct way to update props:
        this.$emit('toggle-popup')
      }
    }
  },
  methods: {
    openLogin () {
      this.$emit('toggle-popup')
      this.$emit('toggle-login-popup')
    },
    submit () {
      this.$refs.registerForm.validate((valid) => {
        if (!valid) {
          this.$message({
            message: 'Proszę, popraw formularz rejestracji',
            type: 'error',
            duration: 3000
          })
          return false
        } else {
          this.register()
        }
      })
    },
    register () {
      csrf().then(async () => {
        await this.$store.dispatch('user/register', this.registerForm)
        this.$emit('toggle-popup')
        this.$message({
          message: 'Gratulacje. Prosimy aktywować konto. Kliknij w link wysłany na emaila.',
          type: 'success',
          duration: 5000
        })
        this.loginForm = {
          type: '',
          name: '',
          email: '',
          password: '',
          rePassword: ''
        }
      })
    }
  }
}
</script>

<style lang="scss">
.register-popup {
  width: 800px;
  margin: 0 auto;

  .who-am-i {
    width: 100%;
  }

  h3 {
    text-align: center;
    margin-bottom: 20px;
  }

  .rules {
    margin: 30px 0 14px 0;
    text-align: center;

    a {
      text-transform: lowercase;
      color: #ff19b7;
    }
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
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .el-input {
    margin-top: 10px;
    margin-bottom: 2px;
  }
}
</style>
