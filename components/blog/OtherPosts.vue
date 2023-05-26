<template>
  <div class="other-posts">
    <h2>Other blog posts</h2>
    <div class="posts">
      <nuxt-link v-for="post in posts" :key="post.id" :to="'/blog/' + post.slug" class="post">
        <div class="img">
          <img :src="post.main_photo_url" alt="">
        </div> 
        <div class="post-info">
          <h3>{{ post.title }}</h3>
          <p>{{ post.created_at }}</p>
        </div>
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
  h2 {
    font-family: 'Epilogue';
    font-style: normal;
    font-weight: 900;
    font-size: 22px;
    line-height: 30px;
  }

  .posts {
    display: flex;
    flex-direction: column;

    .post {
      display: flex;
      margin-top: 25px;
      background-color: white;
      cursor: pointer;
      &:hover {
        h3 {
          color: #ff19b7;
        }
      }

      .img {
        width: 270px;
        height: 166.7px;
        img {
          width: 270px;
          height: 166.7px;
          object-fit: cover;
          padding: 5px;
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
        }
      }
      .post-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 20px;
        h3 {
          font-size: 22px;
          color: #000000;
          text-underline: none;
        }
        p {
          color: #353434;
        }
      }
    }
  }
}
</style>
