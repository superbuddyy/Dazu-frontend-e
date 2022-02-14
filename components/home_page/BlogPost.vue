<template>
  <div class="bg">
    <div class="blog-post" :style="'background-image: url(' + post.main_photo_url + ')'">
      <div class="content">
        <div class="text">
          <h1>{{ post.title }}</h1>
          <nuxt-link :to="'/blog/' + post.slug">
            <el-button type="primary" icon="el-icon-view">
              Zobacz więcej
            </el-button>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { lastPost } from '@/api/blog'

export default {
  name: 'BlogPost',
  data () {
    return {
      post: {}
    }
  },
  mounted () {
    this.getPost()
  },
  methods: {
    async getPost () {
      const result = await lastPost()
      this.post = result.data
    }
  }
}
</script>

<style lang="scss">
  .blog-post {
    height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0 0 0;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    h2 {
      text-align: center;
      margin-top: 30px;
      text-transform: uppercase;
    }

    .content {
      width: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .text {
        padding: 10px 0;
        top: -85px;
        text-align: center;
        h1 {
          background: rgba(255,255,255,0.41961);
          padding: 10px;
        }

        button {
          margin-top: 8px;
        }
      }
    }

    .right {
      width: 0;
    }

    .post-img {
      width: 600px;
      height: 400px;
      background-size: cover;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }
</style>
