import Vue from 'vue'
import { HorizontalBar } from 'vue-chartjs'

Vue.component('HBarChart', {
  extends: HorizontalBar,
  props: {
    data: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        maintainAspectRatio: false,
        // indexAxis: 'y',
        legend: false,
        scales: {
          xAxes: [{ display: true, ticks: { beginAtZero: true } }]
        }
      }),
    },
  },
  watch: {
    data() {
      this.renderChart(this.data, this.options)
    },
  },
  mounted() {
    this.renderChart(this.data, this.options)
  },
})
