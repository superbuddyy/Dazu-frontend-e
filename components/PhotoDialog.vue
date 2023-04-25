<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="close"
    class="photo-box"
  >
    <img v-if="ytLink === ''" :src="imgPath" alt="">
    <iframe
      v-if="ytLink !== ''"
      class="video-avatar"
      :src="ytLink"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </el-dialog>
</template>

<script>
export default {
  name: 'PhotoDialog',
  props: {
    visible: {
      type: Boolean,
      default () {
        return false
      }
    },
    imgPath: {
      type: String,
      default () {
        return ''
      }
    },
    link: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ytLink () {
      console.log('youtu link0 is', this.link)

      if (this.link !== '') {
        console.log('youtu link1 is', this.link)

        const url = new URL(this.link)
        const hostname = url.hostname
        if (hostname === 'youtu.be') {
          console.log('youtu link2 is', this.link)

          return this.videoYT(this.link)
        } else if(hostname === 'youtube.com'){
          console.log('test result', this.videoRawYT(this.link))
          return this.videoRawYT(this.link)
        }
      }
      return ''
    }
  },
  mounted () {
    console.log('youtu link is', this.link)
      console.log('youtu image is', this.imgPath)
  },
  methods: {
    close () {
      this.$emit('close')
    },
    videoYT (videoLink) {
      const parts = videoLink.split('/')
      const result_link = 'https://www.youtube.com/embed/' + parts[parts.length - 1]
      return result_link
    },
    videoRawYT (videoLink) {
      console.log('youtu link is', )
      const parts = videoLink.split('/')
      const result_link = 'https://www.youtube.com/embed/' + parts[parts.length - 1].slice(8, parts[parts.length - 1].length)
      return result_link
    },
  }
}
</script>

<style lang="scss">
.photo-box {
  width: 100%;
  height: 100vh;

  @media only screen and (max-width: 834px) {
    .el-dialog {
      width: 90%;
    }
  }

  .video-avatar {
    width: 100%;
    height: 50vh;
  }

  img {
    height: 100%;
    width: 100%;
  }
}
</style>
