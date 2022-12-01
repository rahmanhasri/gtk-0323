<template>
  <div class="container">
    <div class="columns">
      <div class="column is-3 field">
        <div class="field">
          <label class="label">Sekolah</label>
          <div class="control">
            <input
              v-model="search"
              class="input"
              type="text"
              placeholder="Cari Sekolah"
            />
          </div>
        </div>
      </div>
      <div class="column is-3 field">
        <label class="label">Tingkat Sekolah</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model="tingkatFilter">
              <option value="">Semua tingkat</option>
              <option v-if="!isProvinsiUser" value="PAUD">PAUD</option>
              <option v-if="!isProvinsiUser" value="TK">TK</option>
              <option v-if="!isProvinsiUser" value="SD">SD</option>
              <option v-if="!isProvinsiUser" value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="SMK">SMK</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-3 field">
        <label class="label">Kecamatan</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model="kecamatanFilter">
              <option value="">Semua kecamatan</option>
              <option
                v-for="item in getListKecamatan()"
                :key="item + '_opt'"
                :value="item"
              >
                {{ item }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-3 field">
        <label class="label">Kelurahan / desa</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model="desaFilter">
              <option value="">Semua kelurahan / desa</option>
              <option
                v-for="item in selectListDesa"
                :key="item + '_desa_opt'"
                :value="item"
              >
                {{ item }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-12 field">
        <p class="control">
          <a
            class="button is-primary"
            :class="{ 'is-loading': loading }"
            @click.prevent="getListSekolah(true)"
          >
            Cari
          </a>
        </p>
      </div>
    </div>
    <progress v-if="loading" class="progress is-small is-primary" max="100" />
    <template v-else>
      <table class="table is-fullwidth is-bordered is-striped is-hoverable">
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama Sekolah</th>
            <th>Jenis</th>
            <th>Kecamatan</th>
            <th>Kelurahan / Desa</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paginatedListSekolah"
            :key="index"
            @click="$router.push('/sekolah/' + item.id)"
          >
            <td>{{ index + 1 + (page - 1) * limit }}</td>
            <td>{{ item.nama }}</td>
            <td>{{ item.jenis }}</td>
            <td>{{ item.kecamatan }}</td>
            <td>{{ item.kelurahan_atau_desa }}</td>
          </tr>
        </tbody>
      </table>
      <nav class="pagination" role="navigation" aria-label="pagination">
        <a
          class="pagination-previous"
          :class="{ 'is-disabled': page === 1 }"
          @click.prevent="turnPage(-1)"
          >Previous</a
        >
        <a
          class="pagination-next"
          :class="{ 'is-disabled': paginatedListSekolah.length < limit }"
          @click.prevent="turnPage(1)"
          >Next page</a
        >
      </nav>
      <div class="columns">
        <div class="column is-4">
          <p class="control">
            <button
              class="button is-primary"
              :class="{ 'is-loading': loading }"
              @click.prevent="downloadListSekolah"
            >
              Download
            </button>
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { LIST_KECAMATAN, LIST_DESA_BY_KECAMATAN } from '@/utils/constants.mjs'

export default {
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      search: '',
      tingkatFilter: '',
      kecamatanFilter: '',
      desaFilter: '',
      listSekolah: [],
      page: 1,
      limit: 20,
      maxLoadedPage: 1,
      //
      newFilter: false,
    }
  },
  computed: {
    selectListDesa() {
      return LIST_DESA_BY_KECAMATAN[this.kecamatanFilter] || []
    },
    loading() {
      return this.$store.state.loading
    },
    paginatedListSekolah() {
      return this.listSekolah.slice(
        this.limit * (this.page - 1),
        this.limit * this.page
      )
    },
    ...mapGetters(['isProvinsiUser']),
  },
  watch: {},
  beforeMount() {
    this.getListSekolah()
  },
  methods: {
    turnPage(value) {
      if (this.page + value > 0) {
        this.page += value
        if (this.page > this.maxLoadedPage) {
          this.maxLoadedPage++
          this.getListSekolah()
        }
      }
    },
    getListKecamatan() {
      return LIST_KECAMATAN
    },
    getListSekolah(isNewFilter = false) {
      this.newFilter = isNewFilter
      this.$store.commit('loading')
      const params = {}
      if (this.search) {
        params.nama = this.search
      }
      if (this.tingkatFilter) {
        params.tingkat = this.tingkatFilter
      }
      if (this.kecamatanFilter) {
        params.kecamatan = this.kecamatanFilter
      }
      if (this.desaFilter) {
        params.kelurahan_atau_desa = this.desaFilter
      }

      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/sekolah',
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
            this.listSekolah = res
            return
          }
          this.listSekolah = this.listSekolah.concat(res)
        })
        .catch((err) => {
          this.$store.commit('finishLoading')
          // TODO: Handle error
          console.log('ERR', err)
        })
    },
    downloadListSekolah() {
      this.$store.commit('loading')
      const params = {}
      if (this.search) {
        params.nama = this.search
      }
      if (this.tingkatFilter) {
        params.tingkat = this.tingkatFilter
      }
      if (this.kecamatanFilter) {
        params.kecamatan = this.kecamatanFilter
      }
      if (this.desaFilter) {
        params.kelurahan_atau_desa = this.desaFilter
      }
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/sekolah/download-list',
          params,
          responseType: 'blob',
        })
        .then(res => {
          this.$store.commit('finishLoading')
          const fileURL = window.URL.createObjectURL(new Blob([res]))
          const fileLink = document.createElement('a')

          fileLink.href = fileURL
          fileLink.setAttribute('download', 'daftar-sekolah.xlsx')
          document.body.appendChild(fileLink)

          fileLink.click()
        })
        .catch(_err => {
          this.$toast.error('Error pada server, agal mengunduh daftar sekolah')
        })
    }
  },
}
</script>

<style></style>
