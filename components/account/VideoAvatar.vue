<template>
  <div v-loading="loading" class="avatar">
    <div class="title">
      Wideo avatar
    </div>
    <div class="img">
      <a
        v-if="$store.state.user.videoAvatar"
        :href="$store.state.user.videoAvatar"
        target="_blank"
      >
        <div class="video-avatar-block">
          <i class="el-icon-video-play video-icon" />
          <el-avatar :size="60" :src="videoAvatarUrl" />
        </div>
      </a>
      <div v-if="!$store.state.user.videoAvatar" class="video-avatar-block">
        <i class="el-icon-video-play video-icon" />
        <el-avatar :size="60" :src="videoAvatarUrl" />
      </div>
    </div>
    <el-popover
      v-model="buyVisible"
      placement="top"
      width="300px"
    >
      <p style="margin: 14px">
        Dodanie lub zmiana avatara jest płatna - 5zł na 30dni
      </p>
      <div style="text-align: center; margin: 0">
        <el-input v-model="videoLink" placeholder="Link do filmu na youtube (https://youtu.be/...)" class="link-input"/>
        <el-button type="primary" size="mini" @click="addAvatar()">
          Zapisz i zapłać
        </el-button>
        <el-button size="mini" type="text" @click="buyVisible = false">
          Innym razem
        </el-button>
      </div>
      <el-button slot="reference" type="primary" plain>
        Zmień
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { storeAvatar } from '@/api/user'

export default {
  name: 'VideoAvatar',
  data: () => ({
    videoLink: '',
    buyVisible: false,
    loading: false
  }),
  computed: {
    videoAvatarUrl () {
      const user = this.$store.state.user
      if (user && user.videoAvatar !== null) {
        const avatarLink = user.videoAvatar
        const url = new URL(avatarLink)
        const hostname = url.hostname
        if (hostname === 'youtu.be') {
          return this.videoYT(avatarLink)
        }
      }

      return ''
    }
  },
  methods: {
    videoYT (videoLink) {
      const parts = videoLink.split('/')
      return 'https://img.youtube.com/vi/' + parts[parts.length - 1] + '/0.jpg'
    },
    async addAvatar () {
      this.buyVisible = false
      this.loading = true
      const formData = new FormData()
      formData.append('avatar', this.videoLink)
      formData.append('avatar_type', 'video_url')
      const result = await storeAvatar(formData)
      if (result.status === 200) {
        window.location.href = result.data.links[1].href
      }
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
  i {
    background: #000000;
    border-radius: 50%;
    color: #009e79;
    position: absolute;
    font-size: 20px;
    font-weight: bold;
  }
}

.avatar {
  width: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .img {
    margin: 20px 0;
  }
}
</style>
