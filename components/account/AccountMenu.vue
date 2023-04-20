<template>
  <div class="account-menu-bg">
    <div class="account-menu">
      <nuxt-link to="/ustawienia-konta" :class="[ active === 'settings' ? 'menu-item active' : 'menu-item' ]">
        Ustawienia
      </nuxt-link>
      <nuxt-link to="/ulubione" :class="[ active === 'favorites' ? 'menu-item active' : 'menu-item' ]">
        Ulubione
      </nuxt-link>
      <nuxt-link to="/moje-ogloszenia" :class="[ active === 'offers' ? 'menu-item active' : 'menu-item' ]">
        Moje ogłoszenia
      </nuxt-link>
      <nuxt-link
        v-if="user.roles.includes('company')"
        to="/agenci"
        :class="[ active === 'agents' ? 'menu-item active' : 'menu-item' ]"
      >
        Agenci
      </nuxt-link>
      <nuxt-link to="/faktury" :class="[ active === 'payments' ? 'menu-item active' : 'menu-item' ]">
        Historia płatności
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountMenu',
  props: {
    active: {
      default: 'settings',
      type: String
    }
  },
  data: () => ({
    user: ''
  }),
  mounted() {
    this.user = this.$store.state.user;
    console.log('test', this.user, 'test2')
  }
}
</script>

<style lang="scss">
.account-menu-bg {
  padding-top: 80px;

  .account-menu {
    padding: 0 6vw;
    display: flex;
    justify-content: flex-end;
    background: #f5f5f5;

    .menu-item {
      padding: 16px;
      color: #000000;
      text-decoration: none;

      &:hover {
        font-weight: bold;
        background: #ff19b742;
      }
    }

    .active {
      background: #ff19b742;
      font-weight: bold;
      text-decoration: underline;
    }
  }
}
</style>
