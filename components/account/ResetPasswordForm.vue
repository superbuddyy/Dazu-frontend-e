<template>
  <div class="reset-form">
    <el-form ref="resetPasswordForm" :model="resetPasswordForm" :rules="rules" class="form">
      <h3>Change Password</h3>
      <el-form-item prop="oldPassword">
        <el-input
          v-model="resetPasswordForm.oldPassword"
          placeholder="Old password"
          class="input"
          type="password"
          autocomplete="off"
          show-password
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="resetPasswordForm.password"
          placeholder="A new password"
          class="input"
          type="password"
          autocomplete="off"
          show-password
        />
      </el-form-item>
      <el-form-item prop="rePassword">
        <el-input
          v-model="resetPasswordForm.rePassword"
          placeholder="Repeat new password"
          class="input"
          type="password"
          autocomplete="off"
          show-password
        />
      </el-form-item>
      <el-button type="primary" plain class="btn-save" @click="save">
        Save
      </el-button>
      <el-button type="info" plain class="btn-delete" @click="softDelete">
        Delete account
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { changePassword } from '@/api/auth'

export default {
  name: 'ResetPasswordForm',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Enter the password'))
      } else {
        if (this.resetPasswordForm.password !== '') {
          this.$refs.resetPasswordForm.validateField('rePassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Repeat password'))
      } else if (value !== this.resetPasswordForm.password) {
        callback(new Error('The passwords must be the same'))
      } else {
        callback()
      }
    }
    return {
      tos: false,
      resetPasswordForm: {
        oldPassword: '',
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
      try {
        const response = await changePassword(this.resetPasswordForm)
        if (response.status === 204) {
          this.$message({
            message: 'Password has been changed',
            type: 'success',
            duration: 3000
          })
        }
        this.clearForm()
      } catch (e) {
        //
      }
    },
    clearForm () {
      this.resetPasswordForm = {
        oldPassword: '',
        password: '',
        rePassword: ''
      }
    },
    softDelete () {
      this.$emit('toggle-delete-account')
    }
  }
}
</script>

<style lang="scss">
  .reset-form {
    width: calc(90% / 2);
    display: flex;
    flex-direction: column;
    align-items: center;
    .form {
      width: 400px;
      h3 {
        margin-bottom: 20px;
      }

      .el-input {
        margin-left: 0;
      }

      .btn-save {
        width: 100%;
      }
      .btn-delete {
        width: 100%;
        margin: 40px 0 0 0;
      }
    }
  }
</style>
