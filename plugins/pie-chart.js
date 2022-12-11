import Vue from 'vue'
import { Pie } from 'vue-chartjs'

Vue.component('PieChart', {
  extends: Pie,
  props: {
    data: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        // responsive: true,
        maintainAspectRatio: false,
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
