<template>
  <div class="edit-account-form">
    <div class="newsletter">
      <h3>Newsletter</h3>
      <div class="btns">
        <el-button type="primary" plain :class="[newsletter ? 'btn' : 'btn pulse']" :disabled="newsletter" @click="toggleNewsletter">
          Aktywuj
        </el-button>
        <el-button type="info" plain class="btn" :disabled="!newsletter" @click="toggleNewsletter">
          Dezaktywuj
        </el-button>
      </div>
    </div>
    <div class="account-info">
      <div>
        <h3>Account Info</h3>
        <el-input v-model="email" placeholder="Imię lub nazwa firmy" class="input" />
        <el-input v-model="type" placeholder="Imię lub nazwa firmy" class="input" />
      </div>
      <el-form label-position="right" label-width="100px" :model="form" class="form">
        <h3>Edytuj informacje</h3>
        <el-input v-model="form.name" placeholder="Imię lub nazwa firmy" class="input" />
        <el-input
          type="number"
          min="0"
          v-model="form.phone"
          placeholder="Telefon"
          class="input"
          onkeyup="value = value.replace(/[^\d]/g, 0)"
        />
        <el-input v-model="form.street" placeholder="Ulica i numer domu/mieszkania" class="input" />
        <el-input v-model="form.zip_code" placeholder="Kod Pocztowy" class="input" />
        <el-input v-model="form.city" placeholder="Miasto" class="input" />
        <el-input v-model="form.country" placeholder="Kraj" class="input" />
        <el-input
          v-if="$store.state.user.roles.includes('company')"
          v-model="form.nip"
          placeholder="NIP"
          class="input"
        />
        <el-button type="primary" plain class="btn-save" @click="save">
          Zapisz
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { updateProfile, toggleNewsletter } from '@/api/user'

export default {
  name: 'EditAccountForm',
  data: () => ({
    email: '',
    type: '',
    form: {
      name: '',
      phone: '',
      city: '',
      street: '',
      zip_code: '',
      country: '',
      nip: ''
    },
    newsletter: false
  }),
  computed: {
    storeUser () {
      return this.$store.state.user
    }
  },
  mounted () {
    const user = this.$store.state.user
    this.email = this.$store.state.user.email
    this.type = this.$store.state.user.roles[0]
    this.form = {
      name: user.name,
      phone: user.phone,
      city: user.city,
      street: user.street,
      zip_code: user.zip_code,
      country: user.country,
      nip: user.nip
    }
    this.newsletter = user.newsletter
  },
  methods: {
    async toggleNewsletter () {
      const newsletter = await toggleNewsletter()
      if (newsletter.data) {
        await this.$store.dispatch('user/setNewsletter', newsletter.data.newsletter)
        this.newsletter = newsletter.data.newsletter
        this.$message({
          message: 'Newsletter został zaktualizowany',
          type: 'success',
          duration: 3000
        })
      }
    },
    save () {
      updateProfile(this.form)
      this.$store.dispatch('user/setProfile', this.form)
      this.$message({
        message: 'Ustawienia zostały zapisane',
        type: 'success',
        duration: 3000
      })
    }
  }
}
</script>

<style lang="scss">
.edit-account-form {
  width: calc(90% / 2);
  display: flex;
  flex-direction: column;
  align-items: center;

  .newsletter {
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 40px;

    .pulse {
      color: #ffffff;
      background: rgb(241 0 0 / 85%);
      animation: pulse 2s infinite;
      border: none;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(241, 0, 0, 0.7);
      }

      70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(241, 0, 0, 0);
      }

      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(241, 0, 0, 0);
      }
    }

    .btns {
      width: 100%;
      display: flex;
      margin-top: 20px;

      .btn {
        width: 50%;
      }
    }
  }

  .account-info {
    display: flex;
    flex-direction: column;
    align-items: center;

    .form {
      max-width: 400px;

      .input {
        margin: 10px 0;
      }

      .btn-save {
        width: 100%;
      }
    }
  }
}
</style>
