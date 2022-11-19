<template>
<div id="map" style="height: 50vh">
 <client-only>
  <l-map ref="map" :zoom="10" :center="['-7.05', '113.25']">
    <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
    <l-marker v-for="(item, index) in listCountKecamatan" :key="index" :lat-lng="getKoorKecamatan(item.kecamatan)" >
    <l-popup>{{ 'Jumlah Sekolah Kec.' + item.kecamatan + ': ' + item.count }}</l-popup>
    </l-marker>
  </l-map>
 </client-only>
</div>

</template>
<script>
import { LIST_KOOR_KECAMATAN } from '@/utils/constants'

export default {
  name: 'IndexPage',
  layout: 'Dashboard',
  middleware: ['auth'],
  data() {
    return {
      listCountKecamatan: [],
      totalTK: 0,
      totalPAUD: 0,
      totalSD: 0,
      totalSMP: 0,
      totalSMA: 0,
      totalSMK: 0,
    }
  },
  mounted() {
    this.getPresentaseData()
  },
  methods: {
    getKoorKecamatan(kecamatan) {
      return LIST_KOOR_KECAMATAN[kecamatan]
    },
    getPresentaseData() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/data/presentase',
        })
        .then((res) => {
          this.$store.commit('finishLoading')
          this.populate(res)
        })
        .catch((err) => {
          this.$store.commit('finishLoading')
          // console.error(err)
          alert(err.message)
          // TODO: handle error
        })
    },
    populate(response) {
      this.listCountKecamatan = response.kecamatan
      (response.tingkat || []).forEach(item => {
        if (item.tingkat === 'TK') {
          this.totalTK = item.count
        } else if (item.tingkat === 'PAUD') {
          this.totalPAUD = item.count
        } else if (item.tingkat === 'SD') {
          this.totalSD = item.count
        } else if (item.tingkat === 'SMP') {

          this.totalSMP = item.count
        } else if (item.tingkat === 'SMA') {

          this.totalSMA = item.count
        } else if (item.tingkat === 'SMK') {

          this.totalSMK = item.count
        }
      })
    },
    zoomUpdated (zoom) {
      this.zoom = zoom;
    },
    centerUpdated (center) {
      this.center = center;
    },
    boundsUpdated (bounds) {
      this.bounds = bounds;
    }
  },
}
</script>
