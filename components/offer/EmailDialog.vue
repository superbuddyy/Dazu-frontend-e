<template>
  <div class="email-dialog">
    <el-dialog
      title="Napisz wiadomość"
      :visible.sync="dialogVisible"
      :before-close="close"
    >
      <el-form :label-position="'left'" :model="form" class="form">
        <el-row :span="24">
          <el-col :span="12">
            <el-form-item label="Imię">
              <el-input v-model="form.name" placeholder="Imię" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Email">
              <el-input v-model="form.email" placeholder="Email" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Wiadomość">
          <el-input v-model="form.message" type="textarea" class="text-area" />
        </el-form-item>
        <el-checkbox v-if="offerSlug" v-model="form.wantToSee" label="Chcę obejrzeć nieruchomość" name="type" />
        <div v-if="offerSlug && form.wantToSee" class="check-buttons">
          <el-button :type="[datetimeForm ? 'blank' : 'primary']" @click="active(1)">
            Jak najszybciej
          </el-button>
          <el-button :type="[datetimeForm ? 'primary' : 'blank']" @click="active(2)">
            O konkretnej porze
          </el-button>
        </div>
        <div v-if="datetimeForm && form.wantToSee" class="datatime-form">
          <el-form-item label="Wybierz termin">
            <el-form-item prop="date">
              <el-date-picker v-model="form.date" value-format="yyyy-MM-dd" type="date" placeholder="Wybierz date" />
              <el-time-picker v-model="form.time" value-format="hh:mm" placeholder="Wybierz godzinę" />
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="close()">Zamknij</el-button>
        <el-button type="primary" icon="el-icon-right" @click="send()">Wyślj</el-button>
      </span>
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
        time: ''
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
        this.form.message = 'Odp na ogłoszenie ' + this.offerTitle + `. Proponowane oglądanie dnia ${value} o godzinie ${this.form.time}`
      }
    },
    'form.time' (value) {
      if (this.datetimeForm) {
        this.form.message = 'Odp na ogłoszenie ' + this.offerTitle + `. Proponowane oglądanie dnia ${this.form.date} o godzinie ${value}`
      }
    },
    'form.wantToSee' (value) {
      if (value) {
        this.form.message = 'Odp na ogłoszenie ' + value + '. Proponowane oglądanie jak najszybciej'
      } else {
        this.form.message = ''
      }
    }
  },
  mounted () {
    this.default()
  },
  methods: {
    default () {
      this.form.wantToSee = true
    },
    active (option) {
      if (option === 2) {
        this.datetimeForm = true
        this.form.message = 'Odp na ogłoszenie ' + this.offerTitle + '. Proponowane oglądanie dnia {data} o godzinie {godzina}'
      } else {
        this.datetimeForm = false
        this.form.message = 'Odp na ogłoszenie ' + this.offerTitle + '. Proponowane oglądanie jak najszybciej'
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
    async send () {
      let result = {}
      if (this.form.recaptcha === null) {
        this.$message({
          message: 'Proszę uzupełnij recaptche',
          type: 'error',
          duration: 3000
        })
        return
      }

      if (this.userId !== '' || this.offerSlug === '') {
        result = await sendProfileEmail(this.userId, this.form)
      } else {
        result = await sendOfferEmail(this.offerSlug, this.form)
      }

      if (result.status === 204) {
        this.$message({
          message: 'Wiadomość została wysłana',
          type: 'success',
          duration: 3000
        })
        this.form = {
          name: '',
          email: '',
          message: '',
          wantToSee: false,
          captcha: null
        }
        this.$refs.recaptcha.reset()
        this.$emit('close-dialog')
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

  }
</style>
