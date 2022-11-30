<template>
  <div class="container">
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': isTabEdit }">
          <a @click.prevent="() => setTabActive('detail')">Input Sekolah</a>
        </li>
        <li :class="{ 'is-active': isTabSiswa }">
          <a @click.prevent="() => setTabActive('daftar-siswa')"
            >Daftar Siswa</a
          >
        </li>
        <li :class="{ 'is-active': isTabGuru }">
          <a @click.prevent="() => setTabActive('daftar-guru')"
            >Daftar Pendidik</a
          >
        </li>
      </ul>
    </div>
    <div v-if="isTabEdit" class="section">
      <progress v-if="loading" class="progress is-small is-primary" max="100" />

      <SekolahFormsVue
        v-else
        :nama="nama"
        :npsn="npsn"
        :kecamatan="kecamatan"
        :desa="desa"
        :is-madrasah="isMadrasah"
        :tingkat="tingkat"
        :profil="profil"
        :is-negeri="isNegeri"
        :koordinat="koordinat"
        :is-submit="false"
        :view-only="!editable"
        :editable="editable"
        @changeNama="nama = $event"
        @changeNpsn="npsn = $event"
        @changeKecamatan="kecamatan = $event"
        @changeDesa="desa = $event"
        @changeIsMadrasah="isMadrasah = $event"
        @changeTingkat="tingkat = $event"
        @changeProfil="profil = $event"
        @changeIsNegeri="isNegeri = $event"
        @changeKoordinat="koordinat = $event"
        @changeEditable="editable = !editable"
        @submitEdit="submitEdit"
      />
    </div>

    <div v-else-if="isTabSiswa" class="section">
      <div class="columns">
        <div class="column is-4 field">
          <div class="field">
            <label class="label">Cari Siswa</label>
            <div class="control">
              <input
                v-model="searchSiswa"
                class="input"
                type="text"
                placeholder="Nama / Nomor Induk Nasional"
              />
            </div>
          </div>
        </div>
        <div class="column is-4 field">
          <div class="field">
            <label class="label">Tahun Angkatan</label>
            <div class="control">
              <input
                v-model="tahunAngkatanFilter"
                class="input"
                type="number"
                placeholder="Tahun Angkatan"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-4">
          <p class="control">
            <a
              class="button is-primary"
              :class="{ 'is-loading': loadingSiswa }"
              @click="() => getListSiswa(true)"
            >
              Cari
            </a>
          </p>
        </div>
      </div>
      <div class="container">
        <TableSiswaVue
          :paginated-list-siswa="paginatedListSiswa"
          :page="pageSiswa"
          :limit="limitSiswa"
        />
        <TablePagination
          :length="paginatedListSiswa.length"
          :page="pageGuru"
          :limit="limitGuru"
          @turnPage="turnPage($event, 'Siswa')"
        />
      </div>
    </div>
    <div v-else-if="isTabGuru" class="section">
      <div class="columns">
        <div class="column is-3 field">
          <label class="label">Cari Pendidik</label>
          <div class="field">
            <div class="control">
              <input
                v-model="searchGuru"
                class="input"
                type="text"
                placeholder="Nama / NUPTK"
              />
            </div>
          </div>
        </div>
        <div class="column is-3 field">
          <label class="label">Status Pendidik</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select
                :value="statusGuruFilter"
                @change="statusGuruFilter = $event.target.value"
              >
                <option value="" disabled selected>Pilih Status</option>
                <option value="PNS">PNS</option>
                <option value="SWASTA">Swasta</option>
                <option value="HONORER">Honorer</option>
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
              :class="{ 'is-loading': loadingGuru }"
              @click="() => getListGuru(true)"
            >
              Cari
            </a>
          </p>
        </div>
      </div>
      <div class="container">
        <TableGuruVue
          :paginated-list-guru="paginatedListGuru"
          :page="pageGuru"
          :limit="limitGuru"
        />
        <TablePagination
          :length="paginatedListGuru.length"
          :page="pageGuru"
          :limit="limitGuru"
          @turnPage="turnPage($event, 'Guru')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SekolahFormsVue from '@/components/SekolahForms.vue'
import TableSiswaVue from '@/components/TableSiswa.vue'
import TableGuruVue from '@/components/TableGuru.vue'
import { catchAndToastError } from '@/utils/common'

export default {
  name: 'SekolahDetail',
  components: {
    SekolahFormsVue,
    TableSiswaVue,
    TableGuruVue,
  },
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      tabActive: 'detail',
      editable: false,
      loadingSekolah: false,
      loadingGuru: false,
      loadingSiswa: false,
      // forms
      nama: '',
      npsn: '',
      kecamatan: '',
      desa: '',
      isMadrasah: false,
      tingkat: '',
      profil: '',
      isNegeri: false,
      koordinat: [],
      // tables
      daftarSiswa: [],
      pageSiswa: 1,
      limitSiswa: 40,
      maxLoadedPageSiswa: 1,
      daftarGuru: [],
      pageGuru: 1,
      limitGuru: 40,
      maxLoadedPageGuru: 1,
      daftarSaranaPrasarana: [],
      pageSarana: 1,
      // input
      searchGuru: '',
      statusGuruFilter: '',
      newFilterGuru: false,
      searchSiswa: '',
      tahunAngkatanFilter: '',
      newFilterSiswa: false,
    }
  },
  computed: {
    isTabEdit() {
      return this.tabActive === 'detail'
    },
    isTabSiswa() {
      return this.tabActive === 'daftar-siswa'
    },
    isTabGuru() {
      return this.tabActive === 'daftar-guru'
    },
    paginatedListGuru() {
      return this.daftarGuru.slice(
        this.limitGuru * (this.pageGuru - 1),
        this.limitGuru * this.pageGuru
      )
    },
    paginatedListSiswa() {
      return this.daftarSiswa.slice(
        this.limitSiswa * (this.pageSiswa - 1),
        this.limitSiswa * this.pageSiswa
      )
    },
    loading() {
      return this.loadingGuru || this.loadingSekolah || this.loadingSiswa
    }
  },
  watch: {},
  beforeMount() {
    this.getDetailSekolah()
    this.getListGuru()
    this.getListSiswa()
  },
  methods: {
    setTabActive(menu) {
      if (this.tabActive !== menu) {
        this.tabActive = menu
      }
    },
    turnPage(value, type) {
      if (this[`page${type}`] + value > 0) {
        this[`page${type}`] += value
        if (
          type === 'Guru' &&
          this.pageGuru > this.maxLoadedPageGuru
        ) {
          this.maxLoadedPageGuru++
          this.getListGuru()
        } else if (
          type === 'Siswa' &&
          this.pageSiswa  > this.maxLoadedPageSiswa
        ) {
          this.maxLoadedPageSiswa++
          this.getListSiswa()
        }
      }
    },
    populateSekolah(sekolah = {}) {
      this.nama = sekolah.nama || ''
      this.npsn = sekolah.npsn || ''
      this.kecamatan = sekolah.kecamatan || ''
      this.desa = sekolah.kelurahan_atau_desa || ''
      this.isMadrasah = sekolah.is_madrasah || false
      this.tingkat = sekolah.tingkat || ''
      this.profil = sekolah.profil || ''
      this.isNegeri = sekolah.negeri || false
      this.koordinat = sekolah.koordinat || []
    },
    getDetailSekolah() {
      this.loadingSekolah = true
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: `/api/sekolah/${this.$route.params.id}`,
        })
        .then((res) => {
          this.populateSekolah(res)
          this.loadingSekolah = false
        })
        .catch((err) => {
          this.loadingSekolah = false
          // TODO: Handle error
          console.log('ERR', err)
        })
    },
    getListGuru(isNewFilter = false) {
      this.newFilterGuru = isNewFilter
      this.loadingGuru = true
      const params = {
        sekolah_id: this.$route.params.id,
        page: this.pageGuru,
        limit: this.limitGuru,
      }
      if (this.searchGuru) {
        params.nama = this.searchGuru
        params.nuptk = this.searchGuru
      }
      if (this.statusGuruFilter) {
        params.status = this.statusGuruFilter
      }
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: `/api/tenaga-guru`,
          params,
        })
        .then((res) => {
          this.loadingGuru = false
          if (this.newFilterGuru) {
            this.newFilterGuru = false
            this.pageGuru = 1
            this.maxLoadedPageGuru = 1
            this.daftarGuru = res
            return
          }
          if (!res.length && this.pageGuru !== 1) {
            this.pageGuru--
            return
          }
          this.daftarGuru = this.daftarGuru.concat(res)
        })
        .catch((err) => {
          this.loadingGuru = false
          // TODO: Handle error
          console.log('ERR', err)
        })
    },
    getListSiswa(isNewFilter = false) {
      this.newFilterSiswa = isNewFilter
      this.loadingSiswa = true
      const params = {
        sekolah_id: this.$route.params.id,
        nama: this.searchSiswa,
        nomor_induk_nasional: this.searchSiswa,
      }
      if (this.tahunAngkatanFilter) {
        params.tahun_angkatan = this.tahunAngkatanFilter
      }
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: `/api/siswa`,
          params,
        })
        .then((res) => {
          this.loadingSiswa = false
          if (this.newFilterSiswa) {
            this.newFilterSiswa = false
            this.maxLoadedPageSiswa = 1
            this.pageSiswa = 1
            this.daftarSiswa = res
            return
          }

          this.daftarSiswa = this.daftarSiswa.concat(res)
        })
        .catch((err) => {
          this.loadingSiswa = false
          // TODO: Handle error
          console.log('ERR', err)
        })
    },
    submitEdit() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'PUT',
          url: '/api/sekolah',
          data: {
            id: this.$route.params.id,
            nama: this.nama,
            npsn: this.npsn,
            kecamatan: this.kecamatan,
            kelurahan_atau_desa: this.desa,
            is_madrasah: this.isMadrasah,
            tingkat: this.isProvinsiUser ? 'SMA' : this.tingkat,
            profil: this.profil,
            jenis: this.isNegeri ? 'negeri' : 'swasta',
            koordinat: this.koordinat,
          },
        })
        .then((_res) => {
          this.$store.commit('finishLoading')
          this.$toast.success('Edit sekolah berhasil')
        })
        .catch(catchAndToastError(this))
    },
  },
}
</script>

<style></style>
