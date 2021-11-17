<template>
  <div class="page-contact-form">
    <div class="container">
      <h1>Kontakt</h1>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="Temat">
          <el-select v-model="form.topic" placeholder="Wybierz" clearable class="select-topic">
            <el-option
              v-for="topic in topics"
              :key="topic"
              :label="topic"
              :value="topic"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="form.email" placeholder="Email" />
        </el-form-item>
        <el-form-item label="Imię">
          <el-input v-model="form.name" placeholder="Imię" />
        </el-form-item>
        <el-form-item label="Wiadomość">
          <el-input
            v-model="form.message"
            type="textarea"
            :rows="5"
            placeholder="Wiadomość"
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
          <el-button type="primary" icon="el-icon-right" @click="send()">
            Wyślj
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
      'Pytanie odnośnie ogłoszenia',
      'Pomoc graficzna',
      'Problem techniczny',
      'Inne'
    ]
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
    async send () {
      if (this.form.recaptcha === null) {
        this.$message({
          message: 'Proszę uzupełnij recaptche',
          type: 'error',
          duration: 3000
        })
        return
      }

      const result = await sendContactForm(this.form)
      if (result.status === 204) {
        this.$message({
          message: 'Wiadomość została wysłana',
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
      }
    }
  }
}
</script>

<style lang="scss">
  .page-contact-form {
    height: calc(100vh - 170px);
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('~assets/header-background.jpg');
    background-position: top;
    background-size: cover;
    background-repeat: no-repeat;
    padding-top: 80px;

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
