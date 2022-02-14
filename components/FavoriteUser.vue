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
      <div v-if="!isFavoriteUser" slot="reference" class="favorite-users" @click="addFavorite">
        <HeartIcon
          class="favourite-icon"
          :size="size"
        />
      </div>
      <div v-if="isFavoriteUser" slot="reference" class="favorite-users fill" @click="addFavorite">
        <HeartIcon
          class="favourite-icon"
          :size="size"
        />
      </div>
    </el-popover>
  </div>
</template>

<script>
import { store, destroy } from '@/api/favoriteUsers'
import { HeartIcon } from 'vue-feather-icons'
import vClickOutside from 'v-click-outside'

export default {
  name: 'FavoriteUser',
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
    userSlug: {
      type: String,
      default () {
        return ''
      }
    },
    isFavoriteUser: {
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
        const result = await store(this.userSlug)
        if (result.status === 200) {
          this.$emit('add-favorite', this.userSlug)
          if (result.data.status) {
            this.isFavoriteUser = true
            this.$message({
              message: 'Użytkownik został dodany do Twoich ulubionych',
              type: 'success',
              duration: 3000
            })
          } else {
            this.isFavoriteUser = false
            this.$emit('remove-favorites', true)
            this.$message({
              message: 'Użytkownik usunięty z ulubionych',
              type: 'success',
              duration: 3000
            })
          }
        }
      }
    },
    async deleteFavorite () {
      const result = await destroy(this.userSlug)
      if (result.status === 204) {
        this.$emit('remove-favorite', this.userSlug)
        this.$message({
          message: 'Użytkownik usunięty z ulubionych',
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
.favorite-users {
  cursor: pointer;

  .favourite-icon {
    color: #eb5a28;

    &:hover {
      fill: #eb5a28;
    }
  }
}
</style>
