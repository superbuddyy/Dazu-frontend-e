<template>
  <div v-loading="loading" class="report-dialog">
    <el-dialog
      title="Add agent"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="close"
    >
      <el-form :label-position="'left'" :model="form" class="form">
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="Email" />
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="Name" />
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
      loading: false,
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
      this.loading = true
      const result = await storeAgent(this.form)
      if (result.status === 200) {
        this.$message({
          message: 'An activation link has been sent to the agent\'s email',
          type: 'success',
          duration: 3000
        })
      }

      this.loading = false
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
