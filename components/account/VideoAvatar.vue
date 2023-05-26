<template>
  <div v-loading="loading" class="avatar">
    <div class="title">
      Video avatar
    </div>
    <div class="img">
      <a
        v-if="userVideoAvatar"
        :href="userVideoAvatar"
        target="_blank"
      >
        <div class="video-avatar-block">
          <img src="~/assets/play-icon.svg" class="video-icon">
          <el-avatar :size="60" :src="videoAvatarUrl" />
        </div>
      </a>
      <div v-if="!userVideoAvatar" class="video-avatar-block">
        <i class="el-icon-video-play video-icon" />
        <el-avatar :size="60" :src="videoAvatarUrl" />
      </div>
      <div class="check">
        <el-checkbox v-model="checkStatus" @change="changeAvatarStatus" />
      </div>
      <div v-if="expireTime" class="expire-time">
        <ExpireTime :expire-time="expireTime" text="Avatar video expires in " />
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
        <el-input
          v-model="videoLink"
          placeholder="Link to the movie on youtube (https://youtu.be/...)"
          class="link-input"
        />
        <el-button type="primary" size="mini" @click="addAvatar()">
          Save and pay
        </el-button>
        <el-button size="mini" type="text" @click="buyVisible = false">
          Another time
        </el-button>
      </div>
      <el-button slot="reference" type="primary" plain class="avatar-btn">
        Change
      </el-button>
    </el-popover>
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
      <el-button v-if="$store.state.user.videoAvatar !== null" slot="reference" type="danger" plain class="avatar-btn">
        Delete
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { storeAvatar, deleteAvatar, updateDefaultAvatar, getMyProfile } from '@/api/user'
import { getSettings } from '@/api/setting'
import { generatePhotoFromYoutubeLink } from '@/helpers'
import ExpireTime from './my_offers/ExpireTime'
export default {
  name: 'VideoAvatar',
  components: {
    ExpireTime
  },
  data: () => ({
    deleteAvatarVisible: false,
    videoLink: '',
    buyVisible: false,
    loading: false,
    checkValue: 'photo',
    checkStatus: false,
    user: null,
    userVideoAvatar: null,
    avatarLimitMsg: '',
    avatarPrice: ''
  }),
  computed: {
    videoAvatarUrl () {
      const user = this.$store.state.user
      if (user && user.videoAvatar !== null) {
        const avatarLink = user.videoAvatar
        const url = new URL(avatarLink)
        const hostname = url.hostname
        return generatePhotoFromYoutubeLink(avatarLink)
      }

      return ''
    },
    expireTime () {
      return this.user && this.user.video_avatar_expire_time ? this.user.video_avatar_expire_time : null
    }
  },
  watch: {
    '$store.state.user.default_avatar' () {
      this.checkDefaultAvatar()
    }
  },
  async mounted () {
    this.userVideoAvatar = this.$store.state.user.videoAvatar
    console.log('test', this.userVideoAvatar)
    this.checkDefaultAvatar()
    if (this.$store.state.user.isLogged) {
      this.getProfile()
    }
    await this.getSettingsValues()
  },
  methods: {
    async addAvatar () {
      this.videoLink = this.videoLink.trim()
      if (typeof this.videoLink === 'undefined' || this.videoLink === null || this.videoLink === '') {
        this.$message({
          message: 'Enter the URL of the video',
          type: 'error',
          duration: 3000
        })
        return
      }
      if (!this.isValidHttpUrl(this.videoLink)) {
        this.$message({
          message: 'Enter the URL of the video',
          type: 'error',
          duration: 3000
        })
        return
      }
      this.buyVisible = false
      this.loading = true
      const formData = new FormData()
      formData.append('avatar', this.videoLink)
      formData.append('avatar_type', 'video_url')
      formData.append('platform', 'desktop')
      this.$store.dispatch('user/setVideoAvatar', this.videoLink)
      const result = await storeAvatar(formData)
      if (result.status === 200) {
        window.location.href = result.data
      }
    },
    isValidHttpUrl (string) {
      let url
      try {
        url = new URL(string)
      } catch (_) {
        return false
      }
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return url.hostname === 'youtu.be' || url.hostname === 'www.youtube.com'
      } else {
        return true
      }
    },
    async removeAvatar () {
      const result = await deleteAvatar('video_url')
      if (result.status === 204) {
        this.deleteAvatarVisible = false
        await this.$store.dispatch('user/setVideoAvatar', null)
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
      console.log(user.default_avatar === 'video')
      if (user.default_avatar === 'video') {
        this.checkStatus = true
      } else {
        this.checkStatus = false
      }
    },
    async changeAvatarStatus (e) {
      console.log(e)
      if (e) {
        const result = await updateDefaultAvatar({ default_avatar: 'video' })
        if (result.status === 200) {
          this.$store.dispatch('user/setDefaultAvatar', 'video')
          this.$message({
            message: 'Avatar changed',
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
        if (item.name === 'avatar_video_url.price') {
          this.avatarLimitMsg = `Adding or changing an avatar is paid - ${item.value}PLN for 30 days`
          this.avatarPrice = item.value
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.link-input {
  margin-bottom: 4px;
}

.video-avatar-block {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .video-icon {
    border-radius: 50%;
    position: absolute;
    height: 20px;
    width: 20px;
  }
}

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
    margin: 20px 0;
  }
}
</style>
