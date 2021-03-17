<template>
  <div class="set-password-form">
    <el-form ref="setPasswordForm" :model="setPasswordForm" :rules="rules" class="form">
      <h3>Ustaw hasło</h3>
      <el-form-item prop="password">
        <el-input
          v-model="setPasswordForm.password"
          placeholder="Hasło"
          class="input"
          type="password"
          autocomplete="off"
          show-password
        />
      </el-form-item>
      <el-form-item prop="rePassword">
        <el-input
          v-model="setPasswordForm.rePassword"
          placeholder="Powtórz hasło"
          class="input"
          type="password"
          autocomplete="off"
          show-password
        />
      </el-form-item>
      <el-button type="primary" plain class="btn-save" @click="save">
        Zapisz
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { csrf, setPassword } from '@/api/auth'

export default {
  name: 'SetPasswordForm',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Wpisz hasło'))
      } else {
        if (this.setPasswordForm.password !== '') {
          this.$refs.setPasswordForm.validateField('rePassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Powtórz hasło'))
      } else if (value !== this.setPasswordForm.password) {
        callback(new Error('Hasła muszą być takie same'))
      } else {
        callback()
      }
    }
    return {
      setPasswordForm: {
        password: '',
        rePassword: ''
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        rePassword: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async save () {
      if (this.$store.state.user.isLogged) {
        const result = await setPassword({ token: this.$route.query.token, password: this.setPasswordForm.password })
        if (result.status === 204) {
          await this.$router.push('/')
          this.$message({
            message: 'Hasło zostało ustawione. Możesz się zalogować',
            type: 'success',
            duration: 3000
          })
        }
      } else {
        csrf().then(async () => {
          const result = await setPassword({ token: this.$route.query.token, password: this.setPasswordForm.password })
          if (result.status === 204) {
            await this.$router.push('/')
            this.$message({
              message: 'Hasło zostało ustawione. Możesz się zalogować',
              type: 'success',
              duration: 3000
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .set-password-form {
    min-width: 332px;
    display: flex;
    align-items: center;

    h3 {
      margin-bottom: 10px;
    }

    .btn-save {
      width: 100%;
    }
  }
</style>
