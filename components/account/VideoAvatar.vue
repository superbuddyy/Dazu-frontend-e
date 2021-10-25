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
          <img src="~/assets/play-icon.svg" class="video-icon">
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
        <el-input
          v-model="videoLink"
          placeholder="Link do filmu na youtube (https://youtu.be/...)"
          class="link-input"
        />
        <el-button type="primary" size="mini" @click="addAvatar()">
          Zapisz i zapłać
        </el-button>
        <el-button size="mini" type="text" @click="buyVisible = false">
          Innym razem
        </el-button>
      </div>
      <el-button slot="reference" type="primary" plain class="avatar-btn">
        Zmień
      </el-button>
    </el-popover>
    <el-popover
      v-model="deleteAvatarVisible"
      placement="top"
      width="300px"
    >
      <div style="text-align: center; margin: 0">
        <p style="margin: 14px">
          Czy na pewno chcesz usunąć avatar?
        </p>
        <el-button type="primary" size="mini" plain @click="deleteAvatarVisible = false">
          Anuluj
        </el-button>
        <el-button type="danger" size="mini" plain @click="removeAvatar()">
          Usuń
        </el-button>
      </div>
      <el-button v-if="$store.state.user.videoAvatar !== null" slot="reference" type="danger" plain class="avatar-btn">
        Usuń
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { storeAvatar, deleteAvatar } from '@/api/user'
import { generatePhotoFromYoutubeLink } from '@/helpers'

export default {
  name: 'VideoAvatar',
  data: () => ({
    deleteAvatarVisible: false,
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
          return generatePhotoFromYoutubeLink(avatarLink)
        }
      }

      return ''
    }
  },
  methods: {
    async addAvatar () {
      this.videoLink = this.videoLink.trim()
      if (typeof this.videoLink === 'undefined' || this.videoLink === null || this.videoLink === '') {
        this.$message({
          message: 'Wprowadź adres URL filmu',
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
      const result = await storeAvatar(formData)
      if (result.status === 200) {
        window.location.href = result.data.links[1].href
      }
    },
    async removeAvatar () {
      const result = await deleteAvatar('video_url')
      if (result.status === 204) {
        this.deleteAvatarVisible = false
        await this.$store.dispatch('user/setVideoAvatar', null)
        this.$message({
          message: 'Usunięto avatar',
          type: 'success',
          duration: 3000
        })
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
