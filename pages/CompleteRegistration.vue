<template>
  <div class="complete-registration">
    <div class="container">
      <h1>The registration process has been completed</h1>
      <el-steps :active="3" align-center>
        <el-step title="Step 1" description="Registration" />
        <el-step title="Step 2" description="Complete the data" />
        <el-step title="Step 3" description="Confirm email" />
      </el-steps>
      <p>The registration process has been successfully completed. Go to the login page to log in.</p>
    </div>
  </div>
</template>
<script>
import { csrf } from '@/api/auth'

export default {
  name: 'CompleteRegistration',
  data: () => ({
    //
  }),
  mounted () {
    this.completeRegistration()
  },
  methods: {
    completeRegistration () {
      csrf().then(async () => {
        await this.$store.dispatch('user/completeRegistration', { token: this.$route.query.token })
        this.$message({
          message: 'The account has been activated',
          type: 'success',
          duration: 3000
        })
      })
    }
  }
}
</script>

<style lang="scss">
  .complete-registration {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('~assets/header-background.jpg');
    background-position: top;
    background-size: cover;
    background-repeat: no-repeat;

    h1 {
      text-align: center;
      margin-bottom: 20px;
      color: #000000;
    }

    .container {
      background: #ffffff;
      padding: 40px;
      width: 80%;
      margin: 0 auto;
      height: 40vh;
      color: #ff19b7;

      p {
        color: #000000;
        text-align: center;
        padding: 40px;
      }
    }
  }
</style>
