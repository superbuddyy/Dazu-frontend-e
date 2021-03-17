<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="close"
    class="offer-stats"
  >
    <LineChart
      v-if="stats !== null"
      v-loading="loading"
      :chart-data="stats"
    />
  </el-dialog>
</template>

<script>
import { getStats } from '@/api/offer'
import LineChart from '@/components/add_offer/LineChart'

export default {
  name: 'OfferStats',
  components: {
    LineChart
  },
  props: {
    visible: {
      type: Boolean,
      default () {
        return false
      }
    },
    offerSlug: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      stats: {},
      options: {},
      loading: false
    }
  },
  watch: {
    offerSlug (value) {
      if (value !== null) {
        return this.getOfferStats()
      }
      return []
    }
  },
  mounted () {
    if (this.offerSlug !== null) {
      return this.getOfferStats()
    }
  },
  methods: {
    async getOfferStats () {
      this.loading = true
      const result = await getStats(this.offerSlug)
      if (result.status === 200) {
        this.stats = {
          labels: result.data.labels,
          datasets: [
            {
              label: 'Wyświetlenia',
              data: result.data.data,
              backgroundColor: 'transparent',
              borderColor: 'rgba(1, 116, 188, 0.50)',
              pointBackgroundColor: 'rgba(171, 71, 188, 1)'
            }
          ]
        }
        this.options = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: {
              ticks: {
                beginAtZero: true
              }
            }
          },
          title: {
            display: true,
            text: 'Ilość odsłon od opublikowania'
          }
        }
      }
      this.loading = false

      return {}
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
