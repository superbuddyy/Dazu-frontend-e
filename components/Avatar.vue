<template>
  <div class="avatar-container">
    <div
      :class="[ company && isCompanyUser ? 'avatar-img company-avatar' : 'avatar-img agent-avatar-img']"
      :style="{backgroundImage: 'url(' + avatarUrl + ')'}"
      @click="openPhotoDialog()"
    >
      <img v-if="videoAvatarUrl && company" src="~/assets/play-icon.svg" class="video-icon">
    </div>

    <PhotoDialog
      :visible="photoDialog"
      :img-path="avatarUrl"
      :link="videoAvatarUrl"
      @close="photoDialog = false"
    />
  </div>
</template>

<script>
import PhotoDialog from './PhotoDialog'
import { generatePhotoFromYoutubeLink } from '~/helpers'

export default {
  name: 'Avatar',
  components: {
    PhotoDialog
  },
  props: {
    user: {
      type: Object,
      default () {
        return null
      }
    },
    company: {
      type: [Object, Array],
      default () {
        return null
      }
    }
  },
  data: () => {
    return {
      photoDialog: false,
      companyAvatar: null,
      companyVideoAvatar: null,
      userAvatar: null,
      userVideoAvatar: null
    }
  },
  computed: {
    avatarUrl () {
      return this.companyAvatar === null ? this.userAvatar : this.companyAvatar
    },
    videoAvatarUrl () {
      return this.companyVideoAvatar === null ? this.userVideoAvatar : this.companyVideoAvatar
    },
    isCompanyUser () {
      if (this.user) {
        return this.user.type !== 'agent' && this.user.type !== 'user'
      }
      return true
    },
    generatedCompanyVideoAvatar () {
      if (this.company && this.company.avatar === null && this.company.video_avatar !== null) {
        return generatePhotoFromYoutubeLink(this.company.video_avatar)
      }
      return null
    }
  },
  mounted () {
    this.setAvatars()
  },
  methods: {
    setAvatars () {
      if (this.company) {
        if (this.isCompanyUser) {
          this.companyVideoAvatar = this.company.video_avatar
          this.companyAvatar = this.generatedCompanyVideoAvatar
        } else {
          this.setUserAvatars()
        }
      } else {
        this.setUserAvatars()
      }
    },
    setUserAvatars () {
      this.userVideoAvatar = this.user.video_avatar
      this.userAvatar = this.user.avatar
    },
    openPhotoDialog () {
      this.photoDialog = true
      if (this.videoAvatar) {
        this.avatarVideo = this.videoAvatar
      } else {
        this.imgPath = this.avatar
      }
    }
  }
}
</script>

<style scoped>
.avatar-img {
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-icon {
  width: 20px;
  height: 20px;
}
</style>
