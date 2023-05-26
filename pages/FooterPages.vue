<template>
  <div class="blog-post-page">
    <div class="post-header" >
      <h1>{{ post.title }}</h1>
    </div>
    <div class="container">
      <p v-html="post.content">
      </p>
    </div>
  </div>
</template>
<script>
import { show } from '@/api/footers'

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

</style>
