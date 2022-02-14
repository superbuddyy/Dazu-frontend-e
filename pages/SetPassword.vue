<template>
  <div class="set-password">
    <SetPasswordForm />
  </div>
</template>
<script>
import SetPasswordForm from '@/components/auth/SetPasswordForm'

export default {
  name: 'SetPassword',
  components: {
    SetPasswordForm
  },
  data: () => ({
    //
  }),
  methods: {
    //
  }
}
</script>

<style lang="scss">
.set-password {
  min-height: calc(100vh - 274px);
  display: flex;
  justify-content: center;
  margin: 0 6vw;
  padding: 60px;
}
</style>
