<template>
  <div class="account-page">
    <AccountMenu
      active="agents"
    />
    <div class="container">
      <AgentsList />
    </div>
  </div>
</template>
<script>
import AccountMenu from '@/components/account/AccountMenu'
import AgentsList from '@/components/account/agents/AgentsList'

export default {
  middleware: ['authenticated', 'company'],
  name: 'Agents',
  components: {
    AccountMenu,
    AgentsList
  },
  data: () => ({
    //
  }),
  mounted () {
  },
  methods: {
    //
  }
}
</script>

<style lang="scss">
.account-page {
  min-height: calc(100vh - 274px);
  .container {
    display: flex;
    margin: 0 6vw;
    padding: 60px;
  }
}
</style>
