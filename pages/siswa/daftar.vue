<template>
  <div class="container mt-2">
    <div class="columns">
      <div class="column is-3 field">
        <div class="field">
          <label class="label">Cari Siswa</label>
          <div class="control">
            <input
              v-model="search"
              class="input"
              type="text"
              placeholder="Nama / Nomor Induk Nasional"
            />
          </div>
        </div>
      </div>

      <div class="column is-3 field">
        <label class="label">Tahun Angkatan</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select @change="tahunFilter = $event.target.value">
              <option value="" selected>Semua Tahun</option>
              <option
                v-for="i in 10"
                :key="'opt_tahun' + i"
                :value="new Date().getFullYear() - i + 1"
              >
                {{ new Date().getFullYear() - i + 1 }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="column is-3 field">
        <label class="label">Tingkat Sekolah</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select
              :value="tingkatFilter"
              @change="changeTingkatSekolah($event.target.value)"
            >
              <option value="">Semua tingkat</option>
              <template v-if="isKemenagUser">
                <option value="PAUD">PAUD</option>
                <option value="TK">TK</option>
                <option value="MI">MI</option>
                <option value="MTs">MTs</option>
                <option value="MA">MA</option>
                <option value="MAK">MAK</option>
              </template>
              <template v-else-if="isProvinsiUser">
                <option value="MA">MA</option>
                <option value="MAK">MAK</option>
                <option value="SMA">SMA</option>
                <option value="SMK">SMK</option>
              </template>
              <template v-else>
                <option value="PAUD">PAUD</option>
                <option value="TK">TK</option>
                <option value="SD">SD</option>
                <option value="MI">MI</option>
                <option value="SMP">SMP</option>
                <option value="MTs">MTs</option>
                <option value="SMA">SMA</option>
                <option value="MA">MA</option>
                <option value="SMK">SMK</option>
                <option value="MAK">MAK</option>
              </template>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-3 field">
        <label class="label">Nama Sekolah</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select
              :value="sekolahIdFilter"
              @change="changeSekolahId($event.target.value)"
            >
              <option value="" disabled selected>Pilih Sekolah</option>
              <option
                v-for="item in getDropdownSekolahFilter"
                :key="item.id + '_optsekolah'"
                :value="item.id"
              >
                {{ item.nama }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-4">
        <p class="control">
          <a
            class="button is-primary"
            :class="{ 'is-loading': loading }"
            @click.prevent="getListSiswa(true)"
          >
            Cari
          </a>
        </p>
      </div>
    </div>
    <TableSiswaVue
      :paginated-list-siswa="paginatedListSiswa"
      :page="page"
      :limit="limit"
    />
    <TablePagination
      :length="paginatedListSiswa.length"
      :page="page"
      :limit="limit"
      @turnPage="turnPage($event)"
    />
    <div v-if="daftarSiswa.length > 0" class="columns">
      <div class="column is-4">
        <p class="control">
          <button
            class="button is-primary"
            :class="{ 'is-loading': loading }"
            @click.prevent="downloadListSiswa"
          >
            Download
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TableSiswaVue from '@/components/TableSiswa.vue'
import TablePagination from '@/components/TablePagination.vue'
import { catchAndToastError } from '@/utils/common'

export default {
  name: 'DaftarSiswa',
  components: {
    TableSiswaVue,
    TablePagination,
  },
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      daftarSiswa: [],
      daftarSekolahId: [],
      page: 1,
      limit: 40,
      maxLoadedPage: 1,
      // filter
      search: '',
      newFilter: false,
      tingkatFilter: '',
      sekolahIdFilter: '',
      tahunFilter: '',
    }
  },
  computed: {
    ...mapGetters(['loading', 'isProvinsiUser', 'isKemenagUser']),
    paginatedListSiswa() {
      return this.daftarSiswa.slice(
        this.limit * (this.page - 1),
        this.limit * this.page
      )
    },
    getDropdownSekolahFilter() {
      return this.daftarSekolahId.filter((sekolah) => {
        if (this.tingkatFilter) {
          return sekolah.tingkat === this.tingkatFilter
        }
        return true
      })
    },
  },
  beforeMount() {
    this.getListSiswa()
    this.getListSekolahFilter()
  },
  methods: {
    turnPage(value) {
      if (this.page + value > 0) {
        this.page += value
        if (this.page > this.maxLoadedPage) {
          this.maxLoadedPage++
          this.getListGuru()
        }
      }
    },
    changeTingkatSekolah(value) {
      this.tingkatFilter = value
    },
    changeSekolahId(value) {
      this.sekolahIdFilter = value
    },
    getListSiswa(isNewFilter = false) {
      this.newFilter = isNewFilter
      this.$store.commit('loading')
      const params = {}
      if (this.search) {
        params.nama = this.search
        params.nomor_induk_nasional = this.search
      }
      if (this.tingkatFilter) {
        params.tingkat = this.tingkatFilter
      }
      if (this.tahunFilter) {
        params.tahun_angkatan = this.tahunFilter
      }
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: `/api/siswa`,
          params,
        })
        .then((res) => {
          this.$store.commit('finishLoading')
          if (this.newFilter) {
            this.newFilter = false
            this.maxLoadedPage = 1
            this.page = 1
            this.daftarSiswa = res
            return
          }

          this.daftarSiswa = this.daftarSiswa.concat(res)
        })
        .catch(catchAndToastError(this))
    },
    getListSekolahFilter() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/sekolah/list-name',
        })
        .then((res) => {
          this.daftarSekolahId = res
          this.$store.commit('finishLoading')
        })
        .catch(catchAndToastError(this))
    },
    downloadListSiswa() {
      this.$store.commit('loading')
      const params = {}
      if (this.search) {
        params.nama = this.search
        params.nomor_induk_nasional = this.search
      }
      if (this.tingkatFilter) {
        params.tingkat = this.tingkatFilter
      }
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/siswa/download-list',
          params,
          responseType: 'blob',
        })
        .then((res) => {
          this.$store.commit('finishLoading')
          const fileURL = window.URL.createObjectURL(new Blob([res]))
          const fileLink = document.createElement('a')

          fileLink.href = fileURL
          fileLink.setAttribute('download', 'daftar-siswa.xlsx')
          document.body.appendChild(fileLink)

          fileLink.click()
        })
        .catch((_err) => {
          this.$toast.error('Error pada server, agal mengunduh daftar sekolah')
        })
    },
  },
}
</script>

<style></style>
