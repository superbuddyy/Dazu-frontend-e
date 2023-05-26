<template>
  <div v-if="calcTime().value > 0" class="expire-time">
    {{ text }} {{ calcTime().value }} {{ calcTime().unit }}
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ExpireTime',
  props: {
    expireTime: {
      type: String,
      default: () => ''
    },
    text: {
      type: String,
      default: () => 'ad expires in '
    }
  },
  computed: {
    expireDate () {
      return moment(this.expireTime).format('DD.MM.YYYY HH:mm:ss')
    }
  },
  methods: {
    calcTime () {
      const now = moment().format('DD.MM.YYYY HH:mm:ss')
      const nowDate = moment(now, 'DD.MM.YYYY HH:mm:ss')
      const endDate = moment(this.expireDate, 'DD.MM.YYYY HH:mm:ss')
      let diff = endDate.diff(nowDate, 'minutes')
      let unit = ''
      if (diff < 60) {
        unit = 'minutes'
        if (diff > 1 && diff < 5) { unit = 'minutes' }
        if (diff === 1) {
          unit = 'a minute'
        }
        return { value: diff, unit } // minutes
      }
      if (diff < 1440) {
        diff = endDate.diff(nowDate, 'hours')
        unit = 'hours'
        if (diff < 23 && diff > 4) { unit = 'hours' }
        if (diff === 1) { unit = 'hour' }
        return { value: diff, unit } // hours
      }
      diff = endDate.diff(nowDate, 'days')
      unit = 'days'
      if (diff === 1) { unit = 'day' }
      return { value: diff, unit } // days
    }
  }
}
</script>

<style lang="scss">
.expire-time {
  font-size: 14px;
  color: red;
}
</style>
