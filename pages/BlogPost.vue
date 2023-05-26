<template>
  <div class="blog-post-page">
    <div class="post-header">
      <div class="post-title">
        <h1>{{ post.title }}</h1>
      </div>
      <div class="post-main-photo">
        <img :src="post.main_photo_url" alt="">
      </div>
    </div>
    <!-- <div class="post-header" :style="'background-image: url(' + post.main_photo_url +');'">
      <h1>{{ post.title }}</h1>
    </div> -->
    <div class="container">
      <p class="post-content" v-html="post.content">
        
      </p>
      <OtherPosts
        :posts="posts"
      />
    </div>
  </div>
</template>
<script>
import { show, index } from '@/api/blog'
import OtherPosts from '@/components/blog/OtherPosts'

export default {
  name: 'BlogPost',
  components: {
    OtherPosts
  },
  data: () => ({
    post: {},
    posts: []
  }),
  mounted () {
    this.getPost()
    this.getPosts()
  },
  methods: {
    async getPost () {
      const result = await show(this.$route.params.slug)
      this.post = result.data
    },
    async getPosts () {
      const result = await index()
      this.posts = result.data.data
    }
  }
}
</script>

<style lang="scss">
.blog-post-page {
  background-color: #FAFAFA;
  min-height: calc(100vh - 274px);
  padding: 0 7vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 1360px) {
    margin: 0;
  }

  .post-header {
    margin-top: 100px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 100%;
    padding: 25px 0;
    display: flex;
    .post-title {
      width: 50%;
      display: flex;
      align-items: center;
      h1 {
        color: #FF19B7;
        font-family: 'Epilogue';
        font-style: normal;
        font-weight: 900;
        font-size: 52px;
        line-height: 48px;
      }
    }
    .post-main-photo {
      width: 50%;
      img {
        width: 693px;
        height: 360px
      }
    }
  }
  .container {
    text-align: left;
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 0 auto;

    @media only screen and (max-width: 1360px) {
      width: 100%;
    }

    p.post-content {
      color: #000000;
      width: 50%;
      text-align: justify;
      background-color: white;
      line-height: 1.5;
      padding: 20px;
      h2 {
        margin:10px;
      }
    }

    .other-posts {
      width: 40%;
      @media only screen and (max-width: 1010px) {
        width: 100%;
        margin-top: 30px;
      }
    }
  }
}
</style>
