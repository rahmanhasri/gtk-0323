<template>
  <div class="container mt-2">
    <div class="columns">
      <div class="column is-3 field">
        <div class="field">
          <label class="label">Cari {{ labelEntity }}</label>
          <div class="control">
            <input
              v-model="search"
              class="input"
              type="text"
              placeholder="Nama / NUPTK"
            />
          </div>
        </div>
      </div>

      <div class="column is-3 field">
        <label class="label">Status</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select
              :value="statusFilter"
              @change="statusFilter = $event.target.value"
            >
              <option value="" disabled selected>Pilih Status</option>
              <option value="PNS">PNS</option>
              <option value="PPPK" selected>PPPK</option>
              <option v-if="labelEntity !== 'Guru'" value="NON-PNS">
                Non-PNS
              </option>
              <option v-else value="GTT">Guru Tidak Tetap</option>
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
            @click.prevent="getListGuru(true)"
          >
            Cari
          </a>
        </p>
      </div>
    </div>
    <TableGuruVue
      :paginated-list-guru="paginatedListGuru"
      :page="page"
      :limit="limit"
      :is-guru="labelEntity === 'Guru'"
    />
    <TablePagination
      :length="paginatedListGuru.length"
      :page="page"
      :limit="limit"
      @turnPage="turnPage($event)"
    />
    <div v-if="daftarGuru.length > 0" class="columns">
      <div class="column is-4">
        <p class="control">
          <button
            class="button is-primary"
            :class="{ 'is-loading': loading }"
            @click.prevent="downloadListGuru"
          >
            Download
          </button>
        </p>
      </div>
    </div>

    <div v-if="(labelEntity !== 'Guru' && !isReadonlyUser)" class="columns">
      <div class="column is-4">
        <p class="control">
          <a
            class="button is-info"
            @click.prevent="$router.push('/tenaga-pendidik/tambah')"
          >
            Tambah Tenaga Pendidik
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as constants from '@/utils/constants.mjs'
import TableGuruVue from '@/components/TableGuru.vue'
import TablePagination from '@/components/TablePagination.vue'
import { catchAndToastError } from '@/utils/common'

export default {
  name: 'DaftarGuru',
  components: {
    TableGuruVue,
    TablePagination,
  },
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      daftarSekolahId: [],
      daftarGuru: [],
      page: 1,
      limit: 40,
      maxLoadedPage: 1,
      // filter
      search: '',
      newFilter: false,
      tingkatFilter: '',
      sekolahIdFilter: '',
      statusFilter: '',
    }
  },
  computed: {
    ...mapGetters(['loading', 'isProvinsiUser', 'isKemenagUser', 'isReadonlyUser']),
    paginatedListGuru() {
      return this.daftarGuru.slice(
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
    labelEntity() {
      return this.$route.name.includes('guru') ? 'Guru' : 'Tenaga Pendidik'
    },
  },
  beforeMount() {
    this.getListGuru()
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
    getListGuru(isNewFilter = false) {
      this.newFilter = isNewFilter
      this.$store.commit('loading')
      const params = {
        kategori:
          this.labelEntity === 'Guru'
            ? constants.GURU
            : constants.TENAGA_PENDIDIK,
      }
      if (this.search) {
        params.nama = this.search
        params.nuptk = this.search
      }
      if (this.sekolahIdFilter) {
        params.sekolah_id = this.sekolahIdFilter
      }
      if (this.statusFilter) {
        params.status = this.statusFilter
      }
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/tenaga-guru',
          params: {
            ...params,
            page: this.page,
            limit: this.limit,
          },
        })
        .then((res) => {
          this.$store.commit('finishLoading')
          if (this.newFilter) {
            this.newFilter = false
            this.maxLoadedPage = 1
            this.page = 1
            this.daftarGuru = res
            return
          }
          this.daftarGuru = this.daftarGuru.concat(res)
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
    downloadListGuru() {
      this.$store.commit('loading')

      const kategori = this.labelEntity === 'Guru' ? constants.GURU : constants.TENAGA_PENDIDIK

      const params = { kategori }

      if (this.search) {
        params.nama = this.search
        params.nuptk = this.search
      }
      if (this.sekolahIdFilter) {
        params.sekolah_id = this.sekolahIdFilter
      }
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/tenaga-guru/download-list',
          params,
          responseType: 'blob',
        })
        .then((res) => {
          this.$store.commit('finishLoading')
          const fileURL = window.URL.createObjectURL(new Blob([res]))
          const fileLink = document.createElement('a')

          fileLink.href = fileURL
          fileLink.setAttribute('download', `daftar-${kategori}.xlsx`)
          document.body.appendChild(fileLink)

          fileLink.click()
        })
        .catch((_err) => {
          this.$toast.error('Error pada server, gagal mengunduh daftar sekolah')
        })
    },
  },
}
</script>

<style></style>
