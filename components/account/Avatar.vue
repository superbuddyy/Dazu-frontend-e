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
      <el-button slot="reference" type="primary" plain>
        Zmień avatar
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { storeAvatar } from '@/api/user'

export default {
  name: 'Avatar',
  data: () => ({
    buyVisible: false,
    avatar: [],
    loading: false
  }),
  computed: {
    avatarUrl () {
      return this.$store.state.user.avatar
    }
  },
  methods: {
    async addAvatar (file) {
      this.loading = true
      const formData = new FormData()
      formData.append('avatar', file.raw)
      const result = await storeAvatar(formData)
      if (result.status === 200) {
        window.location.href = result.data.links[1].href
      }
    }
  }
}
</script>

<style lang="scss">
  .avatar {
    width: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .img {
      margin: 20px 0;
    }
  }
</style>
