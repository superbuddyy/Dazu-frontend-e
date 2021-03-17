<template>
  <div class="favorites-list">
    <div v-if="!loading && favorites.length === 0" class="empty">
      <p>Brak ulubionych ogłoszeń</p>
    </div>
    <div v-loading="loading" class="favorites-container">
      <div v-for="favorite in favorites" :key="favorite.id" class="offer">
        <nuxt-link :to="'/ogloszenia/' + favorite.slug" class="offer">
          <div class="content">
            <div v-if="favorite.main_photo" class="img" :style="{backgroundImage: 'url(' + $store.state.settings.assetUrl + '/' + favorite.main_photo.file.path_name + ')'}" />
            <div v-if="favorite.main_photo === null" class="img" :style="{backgroundImage: 'url(https://yko.im/mpWr.png)'}" />
            <div class="description">
              {{ favorite.title }}
            </div>
            <div class="info">
              <div class="price">
                <Money
                  :money="favorite.price"
                />
              </div>
              <div class="type">
                {{ favorite.type }}
              </div>
              <div v-if="favorite.is_with_bills" class="badge">
                Rachunki wliczone
              </div>
            </div>
          </div>
        </nuxt-link>
        <div class="bottom">
          <div class="location">
            {{ favorite.location_name }}
          </div>
          <Favorite
            :offer-slug="favorite.slug"
            :is-favorite="favorite.is_favorite"
            @remove-favorite="removeFavorite"
          />
        </div>
        <div class="notifications">
          <p>chcę otrzymywać email ze zmianą ceny</p>
          <el-tooltip content="Wyłącz/Włącz powiadomienia" placement="top">
            <el-switch
              v-model="favorite.allow_notifications"
              :active-value="true"
              :inactive-value="false"
              @change="updateNotifications($event, favorite.slug)"
            >
            </el-switch>
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-pagination
      v-if="total > 1"
      background
      class="pagination-section"
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
    />
  </div>
</template>

<script>
import { index, activateNotifications, deactivateNotifications } from '@/api/favorite'
import Favorite from '@/components/Favorite'
import Money from '@/components/Money'

export default {
  name: 'FavoritesList',
  components: {
    Favorite,
    Money
  },
  data () {
    return {
      favorites: [],
      loading: true,
      total: 1,
      pageSize: 10,
      currentPage: 1
    }
  },
  mounted () {
    this.getFavorites()
  },
  methods: {
    async getFavorites () {
      const result = await index()
      if (result.status === 200) {
        this.favorites = result.data.data
        this.total = result.data.last_page
        this.pageSize = result.data.per_page
        this.currentPage = result.data.current_page
        this.loading = false
      }
    },
    removeFavorite (offerSlug) {
      this.favorites = this.favorites.filter(function (favorite) {
        return favorite.slug !== offerSlug
      })
    },
    async updateNotifications (e, offerSlug) {
      if (e) {
        const result = await activateNotifications(offerSlug)
        if (result.status === 204) {
          this.$message({
            message: 'Aktywowano powiadomienia',
            type: 'success',
            duration: 3000
          })
        }
      } else {
        const result = await deactivateNotifications(offerSlug)
        if (result.status === 204) {
          this.$message({
            message: 'Dezaktywowano powiadomienia',
            type: 'success',
            duration: 3000
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
.favorites-list {
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
      .img {
        height: 200px;
        width: 300px;
        background-size: cover;
      }
      .description {
        margin: 4px 0;
      }
      .info {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 10px 0 0 0;
        .type, .price {
          font-weight: bold;
          text-transform: uppercase;
        }
        .badge {
          text-align: center;
          border-radius: 14px;
          background: #f5f5f5;
          padding: 4px 6px;
          font-size: 13px;
          text-transform: lowercase;
        }
      }
      .bottom {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin-top: 6px;
        .location {
          font-weight: bold;
          font-size: 13px;
        }
      }
      .notifications {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        width: 100%;
        margin-top: 6px;
      }
    }
  }
  .pagination-section {
    margin-top: 16px;
    text-align: center;
  }

}
</style>
