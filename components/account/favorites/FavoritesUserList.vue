<template>
  <div class="favorites-user-list">
    <div class="left">
      <el-tag type="info" class="tag-btn" :class="[isTagActive == 'all' ? 'activated-btn' : '']" @click="sortResults('all')">
        Wszyscy
      </el-tag>
      <el-tag type="info" class="tag-btn" :class="[isTagActive == 'agent' ? 'activated-btn' : '']" @click="sortResults('agent')">
        Agenci
      </el-tag>
      <el-tag type="info" class="tag-btn" :class="[isTagActive == 'company' ? 'activated-btn' : '']" @click="sortResults('company')">
        Agencje
      </el-tag>
      <el-tag type="info" class="tag-btn" :class="[isTagActive == 'user' ? 'activated-btn' : '']" @click="sortResults('user')">
        Deweloperzy
      </el-tag>
      <el-tag type="info" class="tag-btn" :class="[isTagActive == 'private' ? 'activated-btn' : '']" @click="sortResults('private')">
        Prywatni
      </el-tag>
    </div>
    <div v-if="!loading && favorites.length === 0" class="empty">
      <p>Brak ulubionych użytkowników</p>
    </div>
    <div v-loading="loading" class="favorites-container">
      <el-row v-for="(row, rowIndex) in rowCount" :key="rowIndex">
        <el-col v-for="(favorite, colIndex) in favorites.slice((row - 1) * itemsPerRow, row * itemsPerRow)" :key="colIndex" :span="colSize">
          <div class="agent">
            <div>
              <Avatar
                :user="favorite"
              />
            </div>
            <div>
              <b class="agent-name">
                <nuxt-link :to="'/profil/' + favorite.id" class="offer">
                  {{ favorite.name }}
                </nuxt-link>
              </b>
            </div>
            <div>
              <FavoriteUser
                class="favorite-btn"
                :userSlug="favorite.id"
                :isFavoriteUser="favorite.is_favorite_user"
                size="20"
                @remove-favorites="removeFavorite"
              />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-pagination
      v-if="total > 1"
      background
      class="pagination-section"
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage"
    />
  </div>
</template>

<script>
import { index } from '@/api/favoriteUsers'
import FavoriteUser from '@/components/FavoriteUser'
import Avatar from '@/components/Avatar'
export default {
  name: 'FavoritesUserList',
  components: {
    FavoriteUser,
    Avatar
  },
  data () {
    return {
      favorites: [],
      loading: true,
      total: 1,
      pageSize: 10,
      currentPage: 1,
      isTagActive: 'all',
      itemsPerRow: 2
    }
  },
  computed: {
    rowCount () {
      return Math.ceil(this.favorites.length / this.itemsPerRow)
    },
    colSize () {
      return Math.ceil(24 / this.itemsPerRow)
    }
  },
  mounted () {
    this.getFavorites('', 1)
  },
  methods: {
    changePage (page) {
      this.loading = true
      this.getFavorites(this.isTagActive, page)
    },
    async getFavorites (type, page) {
      if (type === 'all') {
        type = ''
      }
      const q = '?type=' + type + '&page=' + page
      const result = await index(q)
      if (result.status === 200) {
        this.favorites = result.data.data
        this.total = result.data.total
        this.pageSize = result.data.per_page
        this.currentPage = result.data.current_page
        this.loading = false
      }
    },
    removeFavorite () {
      this.loading = true
      this.getFavorites(this.isTagActive, 1)
    },
    sortResults (type) {
      this.isTagActive = type
      if (type === 'all') {
        type = ''
      }
      this.loading = true
      this.getFavorites(type, 1)
    }
  }
}
</script>

<style lang="scss">
.favorites-user-list {
  justify-content: center;
  .favorites-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin: 0 6vw;
    .offer {
      max-width: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 20px;
      text-decoration: none;
      color: #000000;
      cursor: pointer;
    }
    .avatar-img, .agent-avatar-img {
      height: 110px;
      width: 110px;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      display: flex;
    }
    .favorite-btn {
      align-items: center;
      justify-content: center;
      display: flex;
    }
  }
  .pagination-section {
    margin-top: 16px;
    text-align: center;
  }
  .left {
    text-align: center;
    margin-bottom: 10px;
  }
  .tag-btn {
    cursor: pointer;
    margin: 5px;
  }
  .activated-btn {
    color: #ffffff;
    background-color: #ff19b7;
  }
  .empty {
    text-align: center;
  }
}
</style>
