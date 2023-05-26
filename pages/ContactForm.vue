<template>
  <div class="page-contact-form">
    <div class="container">
      <h1>Contact</h1>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="Topic" prop="topic">
          <el-select v-model="form.topic" placeholder="Choose" clearable class="select-topic">
            <el-option
              v-for="topic in topics"
              :key="topic"
              :label="topic"
              :value="topic"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="Email" />
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="Name" />
        </el-form-item>
        <el-form-item label="Message" prop="message">
          <el-input
            v-model="form.message"
            type="textarea"
            :rows="5"
            placeholder="Message"
          />
        </el-form-item>
        <div class="captcha">
          <vue-recaptcha
            ref="recaptcha"
            :sitekey="siteKey"
            @verify="onVerify"
          />
        </div>
        <div class="buttons">
          <el-button type="primary" icon="el-icon-right" @click="submit">
            Send
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { sendContactForm } from '@/api/contact'
import VueRecaptcha from 'vue-recaptcha'

export default {
  name: 'ContactForm',
  components: {
    VueRecaptcha
  },
  data: () => ({
    form: {
      email: '',
      name: '',
      message: '',
      topic: '',
      recaptcha: null
    },
    topics: [
      'Question about the announcement',
      'Graphical help',
      'Technical problem',
      'Other'
    ],
    rules: {
      topic: { required: true, message: 'Subject is required', trigger: 'change' },
      message: { required: true, message: 'Message is required', trigger: 'change' },
      email: [
        { required: true, message: 'Email is required', trigger: 'change' },
        { type: 'email', message: 'Incorrect email address', trigger: ['blur', 'change'] }
      ],
      name: { required: true, message: 'Name is required', trigger: 'change' }
    }
  }),
  computed: {
    siteKey () {
      return this.$config.recaptchaSiteKey
    }
  },
  mounted () {
    //
  },
  methods: {
    onVerify (response) {
      this.form.recaptcha = response
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message({
            message: 'Please correct the registration form',
            type: 'error',
            duration: 3000
          })
          return false
        } else {
          this.send()
        }
      })
    },
    async send () {
      if (this.form.recaptcha === null) {
        this.$message({
          message: 'Please complete the recaptcha',
          type: 'error',
          duration: 3000
        })
        return
      }

      const result = await sendContactForm(this.form)
      if (result.status === 204) {
        this.$message({
          message: 'Message has been sent',
          type: 'success',
          duration: 3000
        })
        this.form = {
          email: '',
          name: '',
          message: '',
          topic: '',
          recaptcha: null
        }
        this.$refs.recaptcha.reset()
        await this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="scss">
  .page-contact-form {
    // height: calc(100vh - 170px);
    // display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('~assets/header-background.jpg');
    background-position: top;
    background-size: cover;
    background-repeat: no-repeat;
    padding-top: 80px;
    padding-bottom: 20px;

    h1 {
      text-align: center;
      margin-bottom: 26px;
      color: #000000;
    }

    .container {
      background: #ffffff;
      padding: 20px;
      width: 50%;
      margin: 0 auto;
      color: #ff19b7;

      @media only screen and (max-width: 1100px) {
        width: 80%;
      }

      @media only screen and (max-width: 600px) {
        width: 90%;
        .el-form-item__content {
          margin-left: 0!important;
        }
        label {
          display: none;
        }
      }

      .captcha {
        display: flex;
        justify-content: center;
      }

      .select-topic {
        width: 100%;
      }

      .buttons {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>
