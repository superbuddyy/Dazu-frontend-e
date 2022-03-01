<template>
  <div class="blog-post-page">
    <div class="post-header" :style="'background-image: url(' + post.main_photo_url +');'">
      <h1>{{ post.name }}</h1>
    </div>
    <div class="container">
      <p
        v-html="post.content"
      />
    </div>
  </div>
</template>
<script>
import { show } from '@/api/pages'

export default {
  name: 'FooterPages',
  data: () => ({
    post: {},
    posts: []
  }),
  mounted () {
    this.getPost()
  },
  methods: {
    async getPost () {
      const result = await show(this.$route.params.slug)
      this.post = result.data
    }
  }
}
</script>

<style lang="scss">
.blog-post-page {
  min-height: calc(100vh - 274px);
  margin: 0 4vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 1360px) {
    margin: 0;
  }

  .post-header {
    margin-top: 80px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 100%;
    padding: 25px 0;
    h1 {
      background: rgba(255,255,255,0.41961);
      text-align: center;
      padding: 20px;
      color: #000000;
    }
  }

  .container {
    text-align: left;
    display: flex;
    flex-wrap: wrap;
    padding: 40px;
    width: 80%;
    margin: 0 auto;
    color: #ff19b7;

    @media only screen and (max-width: 1360px) {
      width: 100%;
    }

    p {
      color: #000000;
      width: 80%;
    }

    .other-posts {
      @media only screen and (max-width: 1010px) {
        width: 100%;
        margin-top: 30px;
      }
    }
  }
}
</style>
