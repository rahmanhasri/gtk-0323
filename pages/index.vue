<template>
  <div class="column">
    <client-only>
      <progress v-if="loading" class="progress is-small is-primary" max="100" />
      <CountSekolahCardsVue
        v-else
        :total="totalSekolah"
        :negeri="totalSekolahNegeri"
        :swasta="totalSekolahSwasta"
      />
    </client-only>

    <div id="sekolah-graph" class="columns multiline">
      <div class="column is-two-fifths is-one-mobile">
        <client-only>
          <progress v-if="loading" class="progress is-small is-primary" max="100" />
          <PieChart v-else style="height: 50vh" :data="chartData" />
        </client-only>
      </div>

      <div class="column is-three-fifths is-one-mobile">
        <client-only>
          <progress v-if="loading" class="progress is-small is-primary" max="100" />
          <HBarChart v-else style="height: 50vh" :data="sekolahData" />
        </client-only>
      </div>
    </div>

    <div class="columns is-centered is-vcentered">
      <div id="map" class="column is-10" style="height: 50vh">
        <client-only>
          <l-map ref="map" :zoom="10" :center="['-7.05', '113.25']">
            <l-tile-layer
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            ></l-tile-layer>
            <l-marker
              v-for="(item, index) in listCountKecamatan"
              :key="index"
              :lat-lng="getKoorKecamatan(item.kecamatan)"
            >
              <l-tooltip>{{
                'Jumlah Sekolah Kec.' + item.kecamatan + ': ' + item.count
              }}</l-tooltip>
            </l-marker>
          </l-map>
        </client-only>
      </div>
    </div>
  </div>
</template>
<script>
import * as constants from '@/utils/constants.mjs'
import CountSekolahCardsVue from '@/components/CountSekolahCards.vue'

export default {
  name: 'IndexPage',
  components: {
    CountSekolahCardsVue,
  },
  layout: 'Dashboard',
  middleware: ['auth'],
  data() {
    return {
      listCountKecamatan: [],
      total: {
        PAUD: 0,
        TK: 0,
        SD: 0,
        MI: 0,
        SMP: 0,
        MTs: 0,
        SMA: 0,
        SMK: 0,
        MA: 0,
        MAK: 0,
      },
      totalSekolah: 0,
      totalSekolahNegeri: 0,
      totalSekolahSwasta: 0,
      totalSiswa: 0,
      totalGuru: 0,
      totalTenagaPendidik: 0,
      //
      loading: true,
    }
  },
  computed: {
    chartData() {
      return {
        labels: ['Siswa', 'Guru', 'Tenaga Pendidik'],
        datasets: [
          {
            label: '',
            data: [this.totalSiswa, this.totalGuru, this.totalTenagaPendidik],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(94, 79, 162)',
            ],
            hoverOffset: 4,
          },
        ],
      }
    },

    sekolahData() {
      const notZeroData = Object.entries(this.total).filter(entry => entry[1] > 1)

      return {
        labels: notZeroData.map(entry => entry[0]),
        datasets: [
          {
            label: '',
            data: notZeroData.map(entry => entry[1]),
            fill: false,
            backgroundColor: [
              'rgb(158, 1, 66)',
              'rgb(213, 62, 79)',
              'rgb(244, 109, 67)',
              'rgb(253, 174, 97)',
              'rgb(254, 224, 139)',
              'rgb(230, 240, 152)',
              'rgb(171, 221, 164)',
              'rgb(102, 194, 165)',
              'rgb(50, 136, 189)',
              'rgb(94, 79, 162)'
            ],
            borderWidth: 1,
          },
        ],
      }
    },
  },
  created() {
    this.getPresentaseData()
  },
  methods: {
    getKoorKecamatan(kecamatan) {
      return constants.LIST_KOOR_KECAMATAN[kecamatan]
    },
    getPresentaseData() {
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/data/presentase',
        })
        .then((res) => {
          this.populate(res)
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          console.error(err)
          this.$toast.error('Ada kesalahan di server')
        })
    },
    populate(response={}) {
      this.listCountKecamatan = response ? response.countKecamatan : []
      response.countTingkat.forEach((item) => {
        this.total[item.tingkat] = item.count
      })
      response.countJenis.forEach((item) => {
        if (item.jenis === constants.SWASTA) {
          this.totalSekolahSwasta = item.count
        } else if (item.jenis === constants.NEGERI) {
          this.totalSekolahNegeri = item.count
        }
        this.totalSekolah += item.count
      })
      this.totalSiswa = response?.totalSiswa
      const count = (response?.totalGuru || []).reduce((prev, curr) => {
        return { ...prev, [curr.kategori]: curr.count }
      }, {})
      this.totalGuru = count[constants.GURU]
      this.totalTenagaPendidik = count[constants.TENAGA_PENDIDIK]
    },
  },
}
</script>
