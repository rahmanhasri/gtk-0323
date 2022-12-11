<template>
  <div class="container">
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': isTabEdit }">
          <a @click.prevent="() => setTabActive('detail')">Data Sekolah</a>
        </li>
        <li :class="{ 'is-active': isTabSiswa }">
          <a @click.prevent="() => setTabActive('daftar-siswa')"
            >Daftar Siswa</a
          >
        </li>
        <li :class="{ 'is-active': isTabGuru }">
          <a @click.prevent="() => setTabActive('daftar-guru')">Daftar Guru</a>
        </li>
        <li :class="{ 'is-active': isTabPendidik }">
          <a @click.prevent="() => setTabActive('daftar-pendidik')"
            >Daftar Tenaga Pendidik</a
          >
        </li>
        <li :class="{ 'is-active': isTabRuangan }">
          <a @click.prevent="() => setTabActive('daftar-ruangan')">Ruangan</a>
        </li>
      </ul>
    </div>
    <div v-if="isTabEdit" class="section">
      <progress
        v-if="loadingSekolah"
        class="progress is-small is-primary"
        max="100"
      />
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
              @click.prevent="() => getListSiswa(true)"
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
        <div v-if="!isReadonlyUser" class="columns">
          <div class="column is-4">
            <p class="control">
              <a
                class="button is-info"
                @click.prevent="
                  $router.push(`/siswa/tambah?sekolah-id=${$route.params.id}`)
                "
              >
                Tambah Siswa
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="isTabGuru" class="section">
      <div class="columns">
        <div class="column is-3 field">
          <label class="label">Cari Guru</label>
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
          <label class="label">Status Guru</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select
                :value="statusGuruFilter"
                @change="statusGuruFilter = $event.target.value"
              >
                <option value="" disabled selected>Pilih Status</option>
                <option value="PNS">PNS</option>
                <option value="PPPK">PPPK</option>
                <option value="GTT">Guru Tidak Tetap</option>
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
              @click.prevent="() => getListGuru(true)"
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
        <div v-if="!isReadonlyUser" class="columns">
          <div class="column is-4">
            <p class="control">
              <NuxtLink
                class="button is-info"
                :to="'/guru/tambah?' + `sekolah-id=${$route.params.id}`"
              >
                Tambah Guru
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="isTabPendidik" class="section">
      <div class="columns">
        <div class="column is-3 field">
          <label class="label">Cari Tenaga Pendidik</label>
          <div class="field">
            <div class="control">
              <input
                v-model="searchTenagaPendidik"
                class="input"
                type="text"
                placeholder="Nama / NUPTK"
              />
            </div>
          </div>
        </div>
        <div class="column is-3 field">
          <label class="label">Status Tenaga Pendidik</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select
                :value="statusTenagaPendidikFilter"
                @change="statusTenagaPendidikFilter = $event.target.value"
              >
                <option value="" disabled selected>Pilih Status</option>
                <option value="PNS">PNS</option>
                <option value="PPPK">PPPK</option>
                <option value="NON-PNS">Non-PNS</option>
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
              :class="{ 'is-loading': loadingTenagaPendidik }"
              @click.prevent="() => getListTenagaPendidik(true)"
            >
              Cari
            </a>
          </p>
        </div>
      </div>
      <div class="container">
        <TableGuruVue
          :paginated-list-guru="paginatedListTenagaPendidik"
          :page="pageGuru"
          :limit="limitGuru"
          :is-guru="false"
        />
        <TablePagination
          :length="paginatedListTenagaPendidik.length"
          :page="pageGuru"
          :limit="limitGuru"
          @turnPage="turnPage($event, 'TenagaPendidik')"
        />
        <div v-if="!isReadonlyUser" class="columns">
          <div class="column is-4">
            <p class="control">
              <NuxtLink
                class="button is-info"
                :to="
                  '/tenaga-pendidik/tambah?' + `sekolah-id=${$route.params.id}`
                "
              >
                Tambah Tenaga Pendidik
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="isTabRuangan" class="section">
      <div class="container">
        <TableRuanganVue
          :paginated-list-ruangan="paginatedListRuangan"
          :page="pageRuangan"
          :limit="limitRuangan"
          @previewImage="previewImage($event)"
        />
        <TablePagination
          :length="paginatedListRuangan.length"
          :page="pageRuangan"
          :limit="limitRuangan"
          @turnPage="turnPage($event, 'Ruangan')"
        />
        <div v-if="!isReadonlyUser" class="columns">
          <div class="column is-4">
            <p class="control">
              <a
                class="button is-info"
                @click.prevent="
                  $router.push(
                    `/ruangan/tambah?sekolahId=${$route.params.id}&sekolahName=${nama}`
                  )
                "
              >
                Tambah Ruangan
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <client-only>
      <div :class="{ 'is-active': imageActive }" class="modal">
        <div class="modal-background" @click="imageActive = false"></div>
        <div style="width: 65%" class="modal-content">
          <figure class="image is-4by3">
            <img style="height: 100%" :src="imageRuangan" alt="" />
          </figure>
        </div>
        <button
          class="modal-close"
          aria-label="close"
          @click.prevent="imageActive = false"
        ></button>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SekolahFormsVue from '@/components/SekolahForms.vue'
import TableSiswaVue from '@/components/TableSiswa.vue'
import TableGuruVue from '@/components/TableGuru.vue'
import TableRuanganVue from '@/components/TableRuangan.vue'
import { catchAndToastError } from '@/utils/common'
import * as constants from '@/utils/constants.mjs'

export default {
  name: 'SekolahDetail',
  components: {
    SekolahFormsVue,
    TableSiswaVue,
    TableGuruVue,
    TableRuanganVue,
  },
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      tabActive: 'detail',
      editable: false,
      loadingSekolah: true,
      loadingGuru: false,
      loadingSiswa: false,
      loadingTenagaPendidik: false,
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
      daftarTenagaPendidik: [],
      pageTenagaPendidik: 1,
      limitTenagaPendidik: 40,
      maxLoadedPageTenagaPendidik: 1,
      daftarRuangan: [],
      pageRuangan: 1,
      limitRuangan: 40,
      // input
      searchGuru: '',
      statusGuruFilter: '',
      newFilterGuru: false,
      //
      searchSiswa: '',
      tahunAngkatanFilter: '',
      newFilterSiswa: false,
      //
      searchTenagaPendidik: '',
      statusTenagaPendidikFilter: '',
      newFilterTenagaPendidik: false,
      //
      imageActive: false,
      imageRuangan: '',
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
    isTabPendidik() {
      return this.tabActive === 'daftar-pendidik'
    },
    isTabRuangan() {
      return this.tabActive === 'daftar-ruangan'
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
    paginatedListTenagaPendidik() {
      return this.daftarTenagaPendidik.slice(
        this.limitTenagaPendidik * (this.pageTenagaPendidik - 1),
        this.limitTenagaPendidik * this.pageTenagaPendidik
      )
    },
    paginatedListRuangan() {
      return this.daftarRuangan.slice(
        this.limitRuangan * (this.pageRuangan - 1),
        this.limitRuangan * this.pageRuangan
      )
    },
    loading() {
      return this.loadingGuru || this.loadingSekolah || this.loadingSiswa
    },
    ...mapGetters(['isReadonlyUser']),
  },
  watch: {},
  beforeMount() {
    this.getDetailSekolah()
    this.getListGuru()
    this.getListTenagaPendidik()
    this.getListSiswa()
    if (this.$route.hash) {
      this.setTabActive(this.$route.hash.slice(1))
    }
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
        if (type === 'Guru' && this.pageGuru > this.maxLoadedPageGuru) {
          this.maxLoadedPageGuru++
          this.getListGuru()
        } else if (
          type === 'Siswa' &&
          this.pageSiswa > this.maxLoadedPageSiswa
        ) {
          this.maxLoadedPageSiswa++
          this.getListSiswa()
        } else if (
          type === 'TenagaPendidik' &&
          this.pageTenagaPendidik > this.maxLoadedPageTenagaPendidik
        ) {
          this.maxLoadedPageTenagaPendidik++
          this.getListTenagaPendidik()
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
      this.daftarRuangan = sekolah.daftar_sarana_prasarana.filter(
        (s) => s.jenis === constants.RUANGAN
      )
    },
    previewImage(url) {
      this.imageActive = true
      this.imageRuangan = url
    },
    // REST API
    getDetailSekolah() {
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
          catchAndToastError(this)(err)
        })
    },
    getListTenagaPendidikDanGuru(params, page, limit) {
      return this.$auth
        .requestWith('local', {
          method: 'GET',
          url: `/api/tenaga-guru`,
          params: {
            ...params,
            page,
            limit,
          },
        })
        .catch((err) => {
          this.loadingGuru = false
          this.loadingTenagaPendidik = false
          catchAndToastError(this)(err)
        })
    },
    getListGuru(isNewFilter = false) {
      this.newFilterGuru = isNewFilter
      this.loadingGuru = true
      const params = {
        sekolah_id: this.$route.params.id,
        kategori: constants.GURU,
      }
      if (this.searchGuru) {
        params.nama = this.searchGuru
        params.nuptk = this.searchGuru
      }
      if (this.statusGuruFilter) {
        params.status = this.statusGuruFilter
      }
      this.getListTenagaPendidikDanGuru(
        params,
        this.pageGuru,
        this.limitGuru
      ).then((res) => {
        if (!res) {
          return
        }
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
    },
    getListTenagaPendidik(isNewFilter = false) {
      this.newFilterTenagaPendidik = isNewFilter
      this.loadingTenagaPendidik = true
      const params = {
        sekolah_id: this.$route.params.id,
        kategori: constants.TENAGA_PENDIDIK,
      }
      if (this.searchTenagaPendidik) {
        params.nama = this.searchTenagaPendidik
        params.nuptk = this.searchTenagaPendidik
      }
      if (this.statusTenagaPendidikFilter) {
        params.status = this.statusTenagaPendidikFilter
      }
      this.getListTenagaPendidikDanGuru(
        params,
        this.pageTenagaPendidik,
        this.limitTenagaPendidik
      ).then((res) => {
        if (!res) {
          return
        }
        this.loadingTenagaPendidik = false
        if (this.newFilterTenagaPendidik) {
          this.newFilterTenagaPendidik = false
          this.pageTenagaPendidik = 1
          this.maxLoadedPageTenagaPendidik = 1
          this.daftarTenagaPendidik = res
          return
        }
        if (!res.length && this.pageTenagaPendidik !== 1) {
          this.pageTenagaPendidik--
          return
        }
        this.daftarTenagaPendidik = this.daftarTenagaPendidik.concat(res)
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
          catchAndToastError(this)(err)
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
