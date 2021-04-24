<template>
  <div v-loading="loading" class="avatar">
    <div class="title">
      Avatar
    </div>
    <div class="img">
      <div class="block">
        <el-avatar :size="60" :src="avatarUrl" />
      </div>
    </div>
    <el-popover
      v-model="buyVisible"
      placement="top"
      width="300px"
    >
      <p style="margin: 14px">
        Dodanie lub zmiana avatara jest płatna - 5zł na 30dni
      </p>
      <div style="text-align: center; margin: 0">
        <el-upload
          action="#"
          :auto-upload="false"
          :on-change="addAvatar"
          :limit="1"
          :file-list="avatar"
        >
          <el-button type="primary" size="mini" @click="buyVisible = false">
            Wybierz avatar i zapłać
          </el-button>
        </el-upload>
        <el-button size="mini" type="text" @click="buyVisible = false">
          Innym razem
        </el-button>
      </div>
      <el-button slot="reference" type="primary" plain class="avatar-btn">
        Zmień
      </el-button>
    </el-popover>
    <el-popover
      v-model="deleteAvatarVisible"
      placement="top"
      width="300px"
    >
      <div style="text-align: center; margin: 0">
        <p style="margin: 14px">
          Czy na pewno chcesz usunąć avatar?
        </p>
        <el-button type="primary" size="mini" plain @click="deleteAvatarVisible = false">
          Anuluj
        </el-button>
        <el-button type="danger" size="mini" plain @click="removeAvatar()">
          Usuń
        </el-button>
      </div>
      <el-button v-if="$store.state.user.avatar !== null" slot="reference" type="danger" plain class="avatar-btn">
        Usuń
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { storeAvatar, deleteAvatar } from '@/api/user'

export default {
  name: 'Avatar',
  data: () => ({
    buyVisible: false,
    deleteAvatarVisible: false,
    avatar: [],
    loading: false
  }),
  computed: {
    avatarUrl () {
      const user = this.$store.state.user
      const defaultAvatar = this.$config.assetsUrl + '/images/avatar.svg'
      if (user == null) {
        return defaultAvatar
      }
      return user.avatar ? user.avatar : defaultAvatar
    }
  },
  methods: {
    async addAvatar (file) {
      this.loading = true
      const formData = new FormData()
      formData.append('avatar', file.raw)
      formData.append('avatar_type', 'photo')
      const result = await storeAvatar(formData)
      if (result.status === 200) {
        window.location.href = result.data.links[1].href
      }
    },
    async removeAvatar () {
      const result = await deleteAvatar()
      if (result.status === 204) {
        this.deleteAvatarVisible = false
        await this.$store.dispatch('user/setAvatar', null)
        this.$message({
          message: 'Usunięto avatar',
          type: 'success',
          duration: 3000
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .avatar {
    width: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .avatar-btn {
      width: 80px;
      margin-bottom: 4px;
    }

    .img {
      margin: 14px 0;
    }
  }
</style>
