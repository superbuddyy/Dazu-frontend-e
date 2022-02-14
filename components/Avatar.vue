<template>
  <div class="avatar-container">
    <!-- <div
      :class="[ company && isCompanyUser ? 'avatar-img company-avatar' : 'avatar-img agent-avatar-img']"
      :style="{backgroundImage: 'url(' + avatarUrl + ')'}"
      @click="openPhotoDialog()"
    >
      <img v-if="videoAvatarUrl && company" src="~/assets/play-icon.svg" class="video-icon">
    </div> -->
    <div
      v-if="avatarUrl"
      :class="[ company && isCompanyUser ? 'avatar-img company-avatar' : 'avatar-img agent-avatar-img']"
      :style="{backgroundImage: 'url(' + avatarUrl + ')'}"
      @click="openPhotoDialog()"
    >
      <img v-if="videoAvatarUrl && defaultAvatarType === 'video'" src="~/assets/play-icon.svg" class="video-icon">
    </div>
    <PhotoDialog
      :visible="photoDialog"
      :img-path="avatarUrl"
      :link="videoUrl"
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
      type: Object,
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
      userVideoAvatar: null,
      userVideoUrl: null,
      defaultAvatar: null
    }
  },
  computed: {
    avatarUrl () {
      // return this.companyAvatar === null ? this.userAvatar : this.companyAvatar
      return this.defaultAvatar === 'video' ? this.userVideoAvatar : this.userAvatar
      // return this.userAvatar
    },
    videoAvatarUrl () {
      // return this.companyVideoAvatar === null ? this.userVideoAvatar : this.companyVideoAvatar
      return this.userVideoAvatar
    },
    videoUrl () {
      return this.userVideoUrl
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
    },
    defaultAvatarType () {
      return this.defaultAvatar
    }
  },
  mounted () {
    this.setAvatarsV1()
    // this.setUserAvatars()
  },
  methods: {
    setAvatarsV1 () {
      if (this.company) {
        this.userVideoAvatar = this.company.video_avatar ? generatePhotoFromYoutubeLink(this.company.video_avatar) : null
        this.userVideoUrl = this.company.video_avatar ? this.company.video_avatar : this.company.avatar
        // this.userVideoAvatar = this.company.video_avatar
        this.userAvatar = this.company.avatar
        this.defaultAvatar = this.company.default_avatar
      } else {
        if (this.user.video_avatar) {
          this.userVideoAvatar = this.user.video_avatar ? generatePhotoFromYoutubeLink(this.user.video_avatar) : null
          this.userVideoUrl = this.user.video_avatar
        }
        this.userAvatar = this.user.avatar
        this.defaultAvatar = this.user.default_avatar
      }
    },
    setAvatars () {
      if (this.company) {
        this.defaultAvatar = this.company.default_avatar
        if (this.isCompanyUser) {
          this.companyVideoAvatar = this.company.video_avatar
          if (this.company.video_avatar !== null) {
            this.companyAvatar = this.generatedCompanyVideoAvatar
          } else {
            this.companyAvatar = this.company.avatar
          }
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
      this.defaultAvatar = this.user.default_avatar
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
