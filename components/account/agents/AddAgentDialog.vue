<template>
  <div class="report-dialog">
    <el-dialog
      title="Dodaj agenta"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="close"
    >
      <el-form :label-position="'left'" :model="form" class="form">
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="Email" />
        </el-form-item>
        <el-form-item label="Imię" prop="name">
          <el-input v-model="form.name" placeholder="Imię" />
        </el-form-item>
<!--        <vue-recaptcha-->
<!--          ref="recaptcha"-->
<!--          size="invisible"-->
<!--          sitekey="6Lc8SP0ZAAAAAOzDeYO-wDnJxQZDkJ_lC0Bp-iUp"-->
<!--          @verify="onCaptchaVerified"-->
<!--          @expired="resetCaptcha"-->
<!--        />-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close()">Zamknij</el-button>
        <el-button type="primary" @click="add">Dodaj</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { storeAgent } from '@/api/user'

export default {
  name: 'AddAgentDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        name: '',
        email: ''
      }
    }
  },
  methods: {
    resetCaptcha () {
      this.$refs.recaptcha.reset()
    },
    close () {
      this.$emit('close-dialog')
    },
    async add () {
      const result = await storeAgent(this.form)
      if (result.status === 200) {
        this.$message({
          message: 'Na email agenta został wysłany link aktywacyjny',
          type: 'success',
          duration: 3000
        })
      }

      this.$emit('add-agent', result.data)
      this.$emit('close-dialog')
    }
  }
}
</script>

<style lang="scss">
  .report-dialog {
    .el-textarea__inner {
      height: 200px;
    }
  }
</style>
