<template>
  <div>
    <el-popover
      v-model="loginRequiredPopup"
      v-click-outside="close"
      placement="bottom"
      width="200"
      trigger="manual"
    >
      <div class="login-required-popup">
        <p>Musisz się zalogować aby dodać do ulubuinych</p>
        <el-button type="primary" @click="openLoginPopup">
          zaloguj się
        </el-button>
      </div>
      <div v-if="!isFavorite" slot="reference" class="favorites" @click="addFavorite">
        <HeartIcon
          class="favourite-icon"
          :size="size"
        />
      </div>
      <div v-if="isFavorite" slot="reference" class="favorites fill" @click="deleteFavorite">
        <HeartIcon
          class="favourite-icon"
          :size="size"
        />
      </div>
    </el-popover>
  </div>
</template>

<script>
import { store, destroy } from '@/api/favorite'
import { HeartIcon } from 'vue-feather-icons'
import vClickOutside from 'v-click-outside'

export default {
  name: 'Favorite',
  components: {
    HeartIcon
  },
  directives: {
    clickOutside: vClickOutside.directive
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
  data () {
    return {
      loginRequiredPopup: false
    }
  },
  watch: {
    loginRequiredPopup (value) {
      if (!value) {
        this.$store.dispatch('settings/setCarouselPause', false)
        this.$emit('refresh')
      }
    }
  },
  methods: {
    async openLoginPopup () {
      await this.$store.dispatch('user/setLoginFirst', true)
      this.loginRequiredPopup = false
    },
    async addFavorite () {
      if (!this.$store.state.user.isLogged) {
        this.loginRequiredPopup = true
        this.$store.dispatch('settings/setCarouselPause', true)
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
    },
    close () {
      this.loginRequiredPopup = false
    }
  }
}
</script>

<style lang="scss" scoped>
.login-required-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  .el-button {
    margin-top: 6px;
  }
}
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
