<template>
  <div class="report-dialog">
    <el-dialog
      title="Submit an ad"
      :visible.sync="dialogVisible"
      :before-close="close"
      class="report-dialog-box"
    >
      <label>Report description</label>
      <el-input v-model="message" type="textarea" class="text-area" />
      <div class="captcha">
        <vue-recaptcha
          ref="recaptcha"
          :sitekey="siteKey"
          @verify="onVerify"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close()">Close</el-button>
        <el-button type="primary" @click="send()">Report</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { report } from '@/api/offer'
import VueRecaptcha from 'vue-recaptcha'

export default {
  name: 'ReportDialog',
  components: {
    VueRecaptcha
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    offerSlug: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      message: '',
      recaptcha: null
    }
  },
  computed: {
    siteKey () {
      return this.$config.recaptchaSiteKey
    }
  },
  methods: {
    onVerify (response) {
      this.recaptcha = response
    },
    close () {
      this.$emit('close-dialog')
    },
    async send () {
      if (this.recaptcha === null) {
        this.$message({
          message: 'Please complete the recaptcha',
          type: 'error',
          duration: 3000
        })
        return
      }

      const result = await report(this.offerSlug, { message: this.message, recaptcha: this.recaptcha })

      if (result.status === 204) {
        this.$message({
          message: 'The application has been sent',
          type: 'success',
          duration: 3000
        })
      }

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
    .captcha {
      margin-top: 20px;
    }
  }
</style>
