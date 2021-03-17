<template>
  <div>
    <div v-if="!isFavorite" class="favorites" @click="addFavorite">
      <HeartIcon
        class="favourite-icon"
        :size="size"
      />
    </div>
    <div v-if="isFavorite" class="favorites fill" @click="deleteFavorite">
      <HeartIcon
        class="favourite-icon"
        :size="size"
      />
    </div>
  </div>
</template>

<script>
import { store, destroy } from '@/api/favorite'
import { HeartIcon } from 'vue-feather-icons'

export default {
  name: 'Favorite',
  components: {
    HeartIcon
  },
  props: {
    size: {
      type: String,
      default () {
        return '20'
      }
    },
    offerSlug: {
      type: String,
      default () {
        return ''
      }
    },
    isFavorite: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  methods: {
    async addFavorite () {
      if (!this.$store.state.user.isLogged) {
        await this.$store.dispatch('user/setLoginFirst', true)
      } else {
        const result = await store(this.offerSlug)
        if (result.status === 200) {
          this.$emit('add-favorite', this.offerSlug)
          this.$message({
            message: 'Dodano ogłoszenie do ulubionych',
            type: 'success',
            duration: 3000
          })
        }
      }
    },
    async deleteFavorite () {
      const result = await destroy(this.offerSlug)
      if (result.status === 204) {
        this.$emit('remove-favorite', this.offerSlug)
        this.$message({
          message: 'Ogłoszenie usunięte z ulubionych',
          type: 'success',
          duration: 3000
        })
      }
    }
  }
}
</script>

<style lang="scss">
.fill {
  .favourite-icon {
    fill: #eb5a28;
  }
}
.favorites {
  cursor: pointer;

  .favourite-icon {
    color: #eb5a28;

    &:hover {
      fill: #eb5a28;
    }
  }
}
</style>
