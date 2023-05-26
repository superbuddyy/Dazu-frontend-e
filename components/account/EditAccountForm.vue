<template>
  <div class="edit-account-form">
    <div class="newsletter">
      <h3>Newsletter</h3>
      <div class="btns">
        <el-button type="primary" plain :class="[newsletter ? 'btn' : 'btn pulse']" :disabled="newsletter" @click="toggleNewsletter">
          Activate
        </el-button>
        <el-button type="info" plain class="btn" :disabled="!newsletter" @click="toggleNewsletter">
          Deactivate
        </el-button>
      </div>
    </div>
    <div class="account-info">
      <div>
        <h3>Account information</h3>
        <el-input v-model="email" disabled placeholder="First name or company name" class="input" />
        <el-input v-model="type" disabled placeholder="First name or company name" class="input" />
      </div>
      <el-form label-position="right" label-width="100px" :model="form" class="form">
        <h3>Edit information</h3>
        <el-input v-model="form.name" placeholder="First name or company name" class="input" />
        <el-input
          v-model="form.phone"
          placeholder="Telephone"
          class="input"
        />
        <el-input v-model="form.street" placeholder="Street and house/apartment number" class="input" />
        <el-input v-model="form.zip_code" placeholder="Zip code" class="input" />
        <el-input v-model="form.city" placeholder="City" class="input" />
        <el-input v-model="form.country" placeholder="End" class="input" />
        <el-input
          v-if="$store.state.user.roles.includes('company')"
          v-model="form.nip"
          placeholder="NIP"
          class="input"
        />
        <el-button type="primary" plain class="btn-save" @click="save">
          Save
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
    //translate
    switch(this.type){
      case 'user':
        this.type = 'Konto prywatne'
        break;
      case 'company':
        if(this.$store.state.user.type === 'developer')
          this.type = 'Deweloper'
        else
          this.type = 'Agencja'
        break;
      case 'agent':
        this.type = 'Agent'
        break;
    }
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
          message: 'The newsletter has been updated',
          type: 'success',
          duration: 3000
        })
      }
    },
    save () {
      updateProfile(this.form)
      this.$store.dispatch('user/setProfile', this.form)
      this.$message({
        message: 'The settings have been saved',
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
