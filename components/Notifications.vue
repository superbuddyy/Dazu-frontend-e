<template>
  <div>
    <el-badge v-if="notifications.length !== 0" :value="amount" class="item">
      <BellIcon :style="[showList ? {'color': '#009E79'} : {}]" class="notifications" @click="toggle" />
    </el-badge>
    <BellIcon v-if="notifications.length === 0" :style="[showList ? {'color': '#009E79'} : {}]" class="notifications" @click="toggle" />
    <div v-if="showList" v-click-outside="toggle" class="notifications-box">
      <div class="notifications-header">
        <span @click="deactivate()">Oznacz jako przeczytane</span>
      </div>
      <div v-if="notifications.length === 0" class="no-notifications">
        Brak nowych powiadomień
      </div>
      <div v-for="(notification, index) in notifications" :key="index+1" class="notification" @click="goTo(notification.link)">
        <div class="content">
          <div class="icon">
            <i v-if="notification.type === 'info'" class="el-icon-info info" />
            <i v-if="notification.type === 'warning'" class="el-icon-warning warning" />
          </div>
          <div class="message">
            <b>{{ notification.message }}</b>
          </div>
        </div>
        <div class="bottom">
          <div class="date">
            {{ notification.created_at }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMyNotifications, deactivateNotifications } from '@/api/user'
import { BellIcon } from 'vue-feather-icons'
import vClickOutside from 'v-click-outside'

export default {
  name: 'Notifications',
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    BellIcon
  },
  props: {
    showList: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      notifications: [],
      amount: 0
    }
  },
  mounted () {
    this.getNotifications()
  },
  methods: {
    toggle () {
      this.$emit('toggle')
    },
    goTo (link) {
      window.open(link, '_blank')
    },
    async deactivate () {
      const result = await deactivateNotifications()
      if (result.status === 204) {
        this.notifications = []
        this.amount = 0
        // this.$message({
        //   message: 'Powiadomienia zostały zostały oznaczone jako przeczytane',
        //   type: 'success',
        //   duration: 3000
        // })
      }
    },
    async getNotifications () {
      const result = await getMyNotifications()
      this.notifications = result.data.data
      this.amount = this.notifications.length
    }
  }
}
</script>

<style lang="scss">
  .notifications-box {
    margin-top: 10px;
    position: absolute;
    width: 300px;
    background: #ffffff;
    font-size: 14px;
    color: #606266;
    border-radius: 3px;
    box-shadow: 0 0 2px 1px #000000;
    overflow-y: scroll;
    height: 340px;
    z-index: 999;

    .no-notifications {
      text-align: center;
      padding: 10px;
    }

    .notifications-header {
      padding: 10px;
      text-align: right;
      color: #000000;
      text-decoration: underline;
      border-bottom: 1px solid #f5f5f5;
      span {
        cursor: pointer;
      }
    }

    .notification {
      cursor: pointer;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      flex-direction: column;
      border-bottom: 1px solid #e2e2e2;

      .content {
        display: flex;
        align-items: center;

        .icon {
          width: 32px;
        }

        .message {
          width: calc(100% - 32px);
        }
      }

      .bottom {
        width: 100%;
      }

      i {
        margin-right: 10px;
      }

      .info {
        color: #5dca8c;
      }

      .warning {
        color: #E6A23C;
      }

      .date {
        font-size: 12px;
        text-align: right;
      }

      &:hover {
        background-color: #effaf4;
      }
    }
  }
</style>
