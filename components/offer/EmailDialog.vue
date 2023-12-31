<template>
  <div class="email-dialog">
    <el-dialog
      title="Write a message"
      :visible.sync="dialogVisible"
      :before-close="close"
    >
      <el-form v-if="isShowForm" ref="emailForm" :label-position="'left'" :model="form" class="form" :rules="rules">
        <el-row :span="24">
          <el-col :span="12">
            <el-form-item label="Name" prop="name">
              <el-input v-model="form.name" placeholder="Name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Email" prop="email">
              <el-input v-model="form.email" :disabled="isDisabled" placeholder="Email" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Message">
          <el-input v-model="form.message" type="textarea" class="text-area" />
        </el-form-item>
        <el-checkbox v-if="offerSlug" v-model="form.wantToSee" label="I want to view the property" name="type" />
        <div v-if="offerSlug && form.wantToSee" class="check-buttons">
          <el-button :type="[datetimeForm ? 'blank' : 'primary']" @click="active(1)">
            As soon as possible
          </el-button>
          <el-button :type="[datetimeForm ? 'primary' : 'blank']" @click="active(2)">
            At a specific time
          </el-button>
        </div>
        <div v-if="datetimeForm && form.wantToSee" class="datatime-form">
          <el-form-item label="Choose a date">
            <el-form-item prop="date">
              <el-date-picker v-model="form.date" value-format="yyyy-MM-dd" type="date" placeholder="Select a date" />
              <el-time-picker v-model="form.time" value-format="hh:mm" placeholder="Select an hour" />
            </el-form-item>
          </el-form-item>
        </div>
        <div class="captcha">
          <vue-recaptcha
            ref="recaptcha"
            :sitekey="siteKey"
            @verify="onVerify"
          />
        </div>
      </el-form>
      <span v-if="isShowForm" slot="footer" class="dialog-footer">
        <el-button @click="close()">Close</el-button>
        <el-button type="primary" icon="el-icon-right" @click="showAlertDialog()">Wyślj</el-button>
      </span>
      <div v-if="!isShowForm" class="alert-div">
        In order for your message to be delivered, you must click on the email link provided in the message.
        <div class="alert-div-btn">
          <el-button
            type="primary"
            round
            class="alert-btn"
            @click="send()"
          >
            OK
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { sendOfferEmail, sendProfileEmail } from '@/api/contact'
import VueRecaptcha from 'vue-recaptcha'

export default {
  name: 'EmailDialog',
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
      default () {
        return ''
      }
    },
    offerTitle: {
      type: String,
      default () {
        return ''
      }
    },
    offerTargetEmail: {
      type: String,
      default () {
        return ''
      }
    },
    userId: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      datetimeForm: false,
      form: {
        name: '',
        email: '',
        message: '',
        wantToSee: false,
        recaptcha: null,
        date: '',
        time: '',
        targetEmail: ''
      },
      isShowForm: true,
      isDisabled: false,
      rules: {
        email: [
          { required: true, message: 'Email is required', trigger: 'change' },
          { type: 'email', message: 'Incorrect email address', trigger: ['blur', 'change'] }
        ],
        name: { required: true, message: 'Company name or first name is required', trigger: 'change' }
      }
    }
  },
  computed: {
    siteKey () {
      return this.$config.recaptchaSiteKey
    }
  },
  watch: {
    'form.date' (value) {
      if (this.datetimeForm) {
        this.form.message = 'Reply to the ad ' + this.offerTitle + `. Suggested viewing of the day ${value} at ${this.form.time}`
      }
    },
    'form.time' (value) {
      if (this.datetimeForm) {
        this.form.message = 'Reply to the ad ' + this.offerTitle + `. Suggested viewing of the day ${this.form.date} at ${value}`
      }
    },
    'form.wantToSee' (value) {
      if (value) {
        this.form.message = 'Reply to the ad ' + this.offerTitle + '. Recommended viewing as soon as possible'
      } else {
        this.form.message = ''
      }
    }
  },
  mounted () {
    this.default()
    if (this.$store.state.user.isLogged) {
      this.form.email = this.$store.state.user.email
      this.isDisabled = true
    }
  },
  methods: {
    default () {
      // this.form.wantToSee = true
      // this.form.message = 'Reply to the ad ' + this.offerTitle + '. Proponowane oglądanie jak najszybciej'
      this.form.targetEmail = this.offerTargetEmail
    },
    active (option) {
      if (option === 2) {
        this.datetimeForm = true
        this.form.message = 'Reply to the ad ' + this.offerTitle + '. Suggested viewing of the day {data} at {godzina}'
      } else {
        this.datetimeForm = false
        this.form.message = 'Reply to the ad ' + this.offerTitle + '. Recommended viewing as soon as possible'
        this.form.date = ''
        this.form.time = ''
      }
    },
    onVerify (response) {
      this.form.recaptcha = response
    },
    close () {
      this.$emit('close-dialog')
    },
    showAlertDialog () {
      // if (this.form.email === this.$store.state.user.email) {
        // this.send()
      // } else {
      //   this.isShowForm = false
      // }
      this.send()
    },
    async send () {
      let result = {}
      if (this.form.recaptcha === null) {
        this.$message({
          message: 'Please complete the recaptcha',
          type: 'error',
          duration: 3000
        })
        return
      }
      
      let format_valid = true
      this.$refs.emailForm.validate((valid) => {
        if (!valid) {
          this.$message({
            message: 'Please correct the registration form',
            type: 'error',
            duration: 3000
          })
          format_valid = false
          return
        }
      })

      if(!format_valid)
        return

      this.$emit('close-dialog')
      if (this.userId !== '' || this.offerSlug === '') {
        result = await sendProfileEmail(this.userId, this.form)
      } else {
        result = await sendOfferEmail(this.offerSlug, this.form)
      }
      this.isShowForm = true
      if (result.status === 204) {
        this.$message({
          message: 'Message was sent',
          type: 'success',
          duration: 3000
        })
        this.form = {
          name: '',
          email: this.isDisabled ? this.form.email : '',
          message: this.form.message,
          wantToSee: this.form.wantToSee,
          captcha: null
        }
        this.$refs.recaptcha.reset()
        // this.$emit('close-dialog')
      } else if (result.status === 200) {
        this.$message({
          message: 'Congratulations. Confirm your account. Click on the link sent to the e-mail.',
          type: 'success',
          duration: 3000
        })
        this.form = {
          name: '',
          email: this.isDisabled ? this.form.email : '',
          message: this.form.message,
          wantToSee: this.form.wantToSee,
          captcha: null
        }
        this.$refs.recaptcha.reset()
        // this.$emit('close-dialog')
      } else {
        this.$message({
          message: 'Something went wrong',
          type: 'error',
          duration: 3000
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .email-dialog {

    .datetime-form, .check-buttons {
      display: flex;
      margin: 10px 0;
    }

    .el-textarea__inner {
      height: 200px;
    }
    .captcha {
      display: flex;
      justify-content: center;
      margin-top: 100px;
    }
    .alert-div {
      font-weight: bolder;
      font-family: 'Inconsolata';
    }
    .alert-div-btn {
      display: flex;
      justify-content: center;
      margin-top: 30px;
    }
    .alert-btn {
      width: 50%;
    }
  }
</style>
