<template>
  <div v-loading="loading" class="avatar">
    <div class="title">
      Avatar
    </div>
    <div class="img">
      <div class="block">
        <el-avatar :size="60" :src="avatarUrl" />
      </div>
      <div class="check">
        <el-checkbox v-model="checkStatus" @change="changeAvatarStatus" />
      </div>
      <div v-if="expireTime" class="expire-time">
        <ExpireTime :expire-time="expireTime" text="Avatar expires in " />
      </div>
    </div>
    <el-popover
      v-model="buyVisible"
      placement="top"
      width="300px"
    >
      <p style="margin: 14px">
        <!-- Dodanie lub zmiana avatara jest płatna - 5zł na 30dni -->
        {{ avatarLimitMsg }}
      </p>
      <div style="text-align: center; margin: 0">
        <el-upload
          action="#"
          :auto-upload="false"
          :on-change="addAvatar"
          :limit="1"
          :file-list="avatar"
        >
          <el-button type="primary" size="mini" @click="buyVisible = false">
            Choose an avatar and pay
          </el-button>
        </el-upload>
        <el-button size="mini" type="text" @click="buyVisible = false">
          Another time
        </el-button>
      </div>
      <el-button slot="reference" type="primary" plain class="avatar-btn">
        Change
      </el-button>
    </el-popover>
    <el-dialog
      v-loading="loading"
      title="Choose payment method"
      :visible.sync="paymentDialog"
      width="30%"
      center
    >
      <div class="payments">
<!--        <el-button @click="pay('paypal')">-->
<!--          <div class="paypal">-->
           <img src="~/assets/paypal.svg" alt="">
<!--            PayPal-->
<!--          </div>-->
<!--        </el-button>-->
        <el-button>
          <!-- <div class="tpay" @click="pay('tpay')">
            <img src="https://tpay.com/img/banners/tpay_logo_blue.svg" alt="">
            Tpay
          </div> -->
          <div class="stripe" @click="pay('stripe')">
            <img src="~/assets/stripe.svg" alt="" width="50">
            Stripe
          </div>
        </el-button>
      </div>
    </el-dialog>
    <el-popover
      v-model="deleteAvatarVisible"
      placement="top"
      width="300px"
    >
      <div style="text-align: center; margin: 0">
        <p style="margin: 14px">
          Are you sure you want to delete the avatar?
        </p>
        <el-button type="primary" size="mini" plain @click="deleteAvatarVisible = false">
          Cancel
        </el-button>
        <el-button type="danger" size="mini" plain @click="removeAvatar()">
          Delete
        </el-button>
      </div>
      <el-button v-if="user.avatar !== null" slot="reference" type="danger" plain class="avatar-btn">
        Delete
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { storeAvatar, deleteAvatar, updateDefaultAvatar, getMyProfile } from '@/api/user'
import { getSettings } from '@/api/setting'
import ExpireTime from './my_offers/ExpireTime'
export default {
  name: 'Avatar',
  components: {
    ExpireTime
  },
  data: () => ({
    avatarFile: null,
    paymentDialog: false,
    buyVisible: false,
    deleteAvatarVisible: false,
    avatar: [],
    loading: false,
    checkValue: 'photo',
    checkStatus: false,
    user: null,
    avatarLimitMsg: '',
    avatarPrice: ''
  }),
  computed: {
    avatarUrl () {
      const defaultAvatar = this.$config.baseUrl + '/svg/avatar.svg'
      if (this.user == null) {
        return defaultAvatar
      }
      return this.user.avatar ? this.user.avatar : defaultAvatar
    },
    expireTime () {
      return this.user && this.user.avatar_expire_time ? this.user.avatar_expire_time : null
    }
  },
  watch: {
    '$store.state.user.default_avatar' () {
      this.checkDefaultAvatar()
    }
  },
  async mounted () {
    this.checkDefaultAvatar()
    if (this.$store.state.user.isLogged) {
      this.getProfile()
    }
    await this.getSettingsValues()
  },
  methods: {
    addAvatar (file) {
      this.paymentDialog = true
      this.avatarFile = file
    },
    async pay (gateway) {
      this.loading = true
      const formData = new FormData()
      formData.append('avatar', this.avatarFile.raw)
      formData.append('avatar_type', 'photo')
      formData.append('gateway', gateway)
      formData.append('platform', 'desktop')
      const result = await storeAvatar(formData)
      if (result.status === 200) {
        window.location.href = result.data
      }
    },
    async removeAvatar () {
      const result = await deleteAvatar('photo')
      if (result.status === 204) {
        this.deleteAvatarVisible = false
        await this.$store.dispatch('user/setAvatar', null)
        this.$message({
          message: 'Avatar removed',
          type: 'success',
          duration: 3000
        })
      }
    },
    checkDefaultAvatar () {
      const user = this.$store.state.user
      console.log('user local')
      console.log(user)
      console.log(user.default_avatar === 'photo')
      if (user.default_avatar === 'photo') {
        this.checkStatus = true
      } else {
        this.checkStatus = false
      }
    },
    async changeAvatarStatus (e) {
      if (e) {
        const result = await updateDefaultAvatar({ default_avatar: 'photo' })
        if (result.status === 200) {
          this.$store.dispatch('user/setDefaultAvatar', 'photo')
          this.$message({
            message: 'Changed avatar status',
            type: 'success',
            duration: 3000
          })
        }
      } else {
        this.checkStatus = true
      }
    },
    async getProfile () {
      const result = await getMyProfile(this.$store.state.user.id)
      if (result.status === 200) {
        this.user = result.data
      }
    },
    async getSettingsValues () {
      const result = await getSettings()
      result.data.forEach((item, index) => {
        item.value = (item.value / 100).toFixed(2)
        if (item.name === 'avatar_photo.price') {
          this.avatarLimitMsg = `Adding or changing an avatar is paid - ${item.value}£ for 30 days`
          this.avatarPrice = item.value
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .avatar {
    width: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .avatar-btn {
      width: 80px;
      margin-bottom: 4px;
    }

    .img {
      margin: 14px 0;
    }
  }
  .stripe {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
