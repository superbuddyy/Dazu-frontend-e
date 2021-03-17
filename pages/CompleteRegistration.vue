<template>
  <div class="complete-registration">
    <div class="container">
      <h1>Zakończono proces rejestracji</h1>
      <el-steps :active="3" align-center>
        <el-step title="Krok 1" description="Rejestracja" />
        <el-step title="Krok 2" description="Uzupałnij dane" />
        <el-step title="Krok 3" description="Potwierdź maila" />
      </el-steps>
      <p>Proces rejestracji został pomyslnie zakończony. Przejdź do strony logowania aby się zalogować.</p>
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
          message: 'Konto zostało aktywowane',
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
      color: #009E79;

      p {
        color: #000000;
        text-align: center;
        padding: 40px;
      }
    }
  }
</style>
