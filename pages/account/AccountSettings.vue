<template>
  <div class="account-settings">
    <AccountMenu />
    <div class="container">
      <div class="avatars">
        <Avatar />
        <VideoAvatar
          v-if="$store.state.user.roles.includes('company')"
        />
      </div>
      <EditAccountForm />
      <ResetPasswordForm
        @toggle-delete-account="deleteAccountVisible = !deleteAccountVisible"
      />
      <DeleteAccount
        v-if="deleteAccountVisible"
        @toggle-delete-account="deleteAccountVisible = !deleteAccountVisible"
      />
    </div>
  </div>
</template>
<script>
import AccountMenu from '@/components/account/AccountMenu'
import Avatar from '@/components/account/Avatar'
import VideoAvatar from '@/components/account/VideoAvatar'
import EditAccountForm from '@/components/account/EditAccountForm'
import ResetPasswordForm from '@/components/account/ResetPasswordForm'
import DeleteAccount from '@/components/account/DeleteAccount'

export default {
  middleware: 'authenticated',
  name: 'AccountSettings',
  components: {
    AccountMenu,
    Avatar,
    VideoAvatar,
    EditAccountForm,
    ResetPasswordForm,
    DeleteAccount
  },
  data: () => ({
    deleteAccountVisible: false
  }),
  mounted () {
    if (this.$route.query['payment-status'] === 'success') {
      this.$message({
        message: 'Płatność została zrealizowana.',
        type: 'success',
        duration: 3000
      })
      if (this.$route.query.avatar_photo) {
        this.$store.dispatch('user/setAvatar', this.$route.query.avatar_photo)
      } else if (this.$route.query.avatar_video_url) {
        this.$store.dispatch('user/setVideoAvatar', this.$route.query.avatar_video_url)
      }
      this.$router.push(this.$route.path)
    }
  }
}
</script>

<style lang="scss">
  .account-settings {
    min-height: calc(100vh - 274px);
    .container {
      display: flex;
      flex-wrap: wrap;
      margin: 0 6vw;
      padding: 60px 0;
      position: relative;
      justify-content: center;

      .avatars {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .avatar {
          width: 120px;
          @media only screen and (max-width: 700px) {
            align-items: center;
          }
        }
      }

      .edit-account-form {
        width: 500px;
      }

      .reset-form {
        width: 500px;
      }
    }
  }
</style>
