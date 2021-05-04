<template>
  <div class="account-page">
    <AccountMenu
      active="favorites"
    />
    <div class="favorite-submenu">
      <el-button
        :class="[ activePage === 'search' ? 'active sub-item' : 'sub-item' ]"
        :to="'/ogloszenia/'"
        @click="activePage = 'search'"
      >
        Zapisane wyszukania
      </el-button>
      <el-button
        :class="[ activePage === 'offers' ? 'active sub-item' : 'sub-item' ]"
        :to="'/ogloszenia/'"
        @click="activePage = 'offers'"
      >
        Ulubione
      </el-button>
    </div>
    <div class="container">
      <FavoritesList
        v-if="activePage === 'offers'"
      />
      <FavoriteFiltersList
        v-if="activePage === 'search'"
      />
    </div>
  </div>
</template>
<script>
import AccountMenu from '@/components/account/AccountMenu'
import FavoritesList from '@/components/account/favorites/FavoritesList'
import FavoriteFiltersList from '@/components/account/favorites/FavoriteFiltersList'

export default {
  middleware: 'authenticated',
  name: 'Favorites',
  components: {
    AccountMenu,
    FavoritesList,
    FavoriteFiltersList
  },
  data: () => ({
    activePage: 'offers'
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

    .favorite-submenu {
      display: flex;
      justify-content: center;
      margin: 10px 6vw;

      .active {
        background: #009E79;
        color: #ffffff;
      }

      .sub-item {
        margin-right: 10px;
      }
    }

    .container {
      display: flex;
      justify-content: center;
      margin: 0 6vw;
      padding: 60px;
    }
  }
</style>
