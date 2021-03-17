<template>
  <div class="other-posts">
    <h2>Inne wpisy</h2>
    <div class="posts">
      <nuxt-link v-for="post in posts" :key="post.id" :to="'/blog/' + post.slug" class="post">
        <img :src="post.main_photo_url" alt="">
        <h3>{{ post.title }}</h3>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OtherPosts',
  props: {
    posts: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style lang="scss">
.other-posts {
  overflow-y: scroll;
  width: 20%;
  border-left: 1px solid #e2e2e2;
  padding-left: 10px;

  h2 {
    border-bottom: 1px solid #e2e2e2;
    padding-bottom: 10px;
    color: #000000;
  }

  .posts {
    display: flex;
    flex-direction: column;

    .post {
      display: flex;
      margin-top: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e2e2e2;
      cursor: pointer;
      &:hover {
        h3 {
          color: #009E79;
        }
      }

      img {
        width: 100px;
        height: 60px;
      }

      h3 {
        margin-left: 10px;
        font-size: 16px;
        color: #000000;
        text-underline: none;
      }
    }
  }
}
</style>
