<script>
import { Line, mixins } from 'vue-chartjs'

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  data () {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 1,
              suggestedMin: 0
            }
          }]
        },
        title: {
          display: true,
          text: 'Number of views since publication'
        }
      }
    }
  },
  watch: {
    chartData () {
      this.$data._chart.update()
    }
  },
  mounted () {
    this.renderChart(
      this.chartData,
      this.options
    )
  }
}
</script>

<style scoped>

</style>
