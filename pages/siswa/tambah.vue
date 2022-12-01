<template>
  <div class="container">
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': isTabInput }">
          <a @click.prevent="() => setTabActive('input')"
            >Input Siswa</a
          >
        </li>
        <li :class="{ 'is-active': isTabUnggah }">
          <a @click.prevent="() => setTabActive('upload')">Upload</a>
        </li>
      </ul>
    </div>

    <div v-if="isTabInput" class="section">
      <SiswaFormsVue
        :nama="nama"
        :nomor-induk-nasional="nomorIndukNasional"
        :nomor-induk-sekolah="nomorIndukSekolah"
        :jenis-kelamin="jenisKelamin"
        :kelas="kelas"
        :alamat="alamat"
        :no-ponsel="noPonsel"
        :tahun-angkatan="tahunAngkatan"
        :tanggal-lahir="tanggalLahir"
        :daftar-sekolah="daftarSekolah"
        @changeNama="(nama = $event)"
        @changeNomorIndukSekolah="(nomorIndukSekolah = $event)"
        @changeNomorIndukNasional="(nomorIndukNasional = $event)"
        @changeJenisKelamin="(jenisKelamin = $event)"
        @changeKelas="(kelas = $event)"
        @changeAlamat="(alamat = $event)"
        @changeNoPonsel="(noPonsel = $event)"
        @changeTahunAngkatan="(tahunAngkatan = $event)"
        @changeTanggalLahir="(tanggalLahir = $event)"
        @changeSekolahId="(sekolahId = $event)"
        @submitInsert="submitInsert"
      />
    </div>
    <div v-if="isTabUnggah" class="section">
      <div class="columns"></div>
      <div class="columns">
        <div class="column is-4 field">
          <div class="file has-name">
            <label class="file-label">
              <input
                ref="uploadFile"
                class="file-input"
                type="file"
                @change="previewFiles"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <font-awesome-icon icon="upload" />
                </span>
                <span class="file-label"> Choose a file… </span>
              </span>
              <span class="file-name">
                {{ fileName }}
              </span>
            </label>
          </div>
        </div>
        <div class="column is-offset-4 is-4 field">
          <button
            class="button is-ghost"
            :class="{ 'is-loading': loading }"
            @click.prevent="downloadTemplate"
          >
            <span class="icon">
              <font-awesome-icon icon="circle-down" />
            </span>
            <span>Download Template</span>
          </button>
        </div>
      </div>
      <div class="columns">
        <div class="column is-6 field">
          <p class="control">
            <a
              class="button is-primary"
              :class="{ 'is-loading': loading }"
              @click.prevent="submitUpload"
            >
              Upload
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SiswaFormsVue from '@/components/SiswaForms.vue'
import { catchAndToastError } from '@/utils/common'
import { EXCEL_CONTENT_TYPE } from '@/utils/constants.mjs'


export default {
  name: 'SiswaInput',
  components: {
    SiswaFormsVue,
  },
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      tabActive: 'input',
      // populate
      daftarSekolah: [],
      // forms
      nama: '',
      nomorIndukSekolah: '',
      nomorIndukNasional: '',
      jenisKelamin: 'LAKI-LAKI',
      kelas: '',
      alamat: '',
      noPonsel: '',
      tahunAngkatan: new Date().getFullYear(),
      sekolahId: '',
      tanggalLahir: '',
      // upload
      fileName: '......',
      file: null,
    }
  },
  computed: {
    ...mapGetters([
      'isProvinsiUser',
      'isDinasPendidikanUser',
      'isKemenagUser',
      'loading',
    ]),
    isTabInput() {
      return this.tabActive === 'input'
    },
    isTabUnggah() {
      return this.tabActive === 'upload'
    },
  },
  beforeMount() {
    this.getListSekolahFilter()
  },
  methods: {
    setTabActive(menu) {
      if (this.tabActive !== menu) {
        this.tabActive = menu
      }
    },
    previewFiles(e) {
      const file = e.target.files[0]
      this.fileName = file.name
    },
    populateSiswa(siswa = {}) {
      this.nama = siswa.nama || ''
      this.sekolahId = siswa.sekolah_id || ''
      this.nomorIndukNasional = siswa.nomor_induk_nasional || ''
      this.nomorIndukSekolah = siswa.nomor_induk_sekolah || ''
      this.jenisKelamin = siswa.jenis_kelamin || ''
      this.kelas = siswa.kelas || ''
      this.alamat = siswa.alamat || ''
      this.noPonsel = siswa.no_ponsel || ''
      this.tahunAngkatan = siswa.tahun_angkatan || new Date().getFullYear()
      this.tanggalLahir = siswa.tanggal_lahir || ''
    },
    // REST API
    getListSekolahFilter() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/sekolah/list-name',
        })
        .then((res) => {
          this.daftarSekolah = res
          this.$store.commit('finishLoading')
        })
        .catch((err) => {
          this.$store.commit('finishLoading')
          // TODO: Handle error
          console.log('ERR', err)
        })
    },
    downloadTemplate() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/siswa/download-template',
          responseType: 'blob',
        })
        .then((res) => {
          this.$store.commit('finishLoading')
          const fileURL = window.URL.createObjectURL(new Blob([res]))
          const fileLink = document.createElement('a')

          fileLink.href = fileURL
          fileLink.setAttribute('download', 'template-siswa.xlsx')
          document.body.appendChild(fileLink)

          fileLink.click()
        })
        .catch(catchAndToastError(this))
    },
    submitUpload() {
      if (!this.file) {
        this.$toast.error('Dibutuhkan satu file untuk upload')
        return
      }

      const formData = new FormData();
      formData.append('file', this.file)
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'POST',
          url: '/api/siswa/upload',
          headers: { 'Content-Type': 'multipart/form-data' },
          data: formData,
          responseType: 'blob',
        })
        .then(res => {
          this.$store.commit('finishLoading')
          this.$toast.success('Upload siswa berhasil')
          const fileURL = window.URL.createObjectURL(new Blob([res], { type: EXCEL_CONTENT_TYPE }))
          const fileLink = document.createElement('a')

          fileLink.href = fileURL
          fileLink.setAttribute('download', 'hasil-upload.xlsx')
          document.body.appendChild(fileLink)

          fileLink.click()
        })
        .catch(catchAndToastError(this))
    },
    submitInsert() {
      this.$store.commit('loading')
      const data = {
        nama: this.nama,
        nomor_induk_sekolah: this.nomorIndukSekolah,
        nomor_induk_nasional: this.nomorIndukNasional,
        jenis_kelamin: this.jenisKelamin,
        kelas: +this.kelas,
        alamat: this.alamat,
        no_ponsel: this.noPonsel,
        tahun_angkatan: String(this.tahunAngkatan),
        sekolah_id: this.sekolahId,
        tanggal_lahir: new Date(this.tanggalLahir)
      }

      this.$auth
        .requestWith('local', {
          method: 'POST',
          url: '/api/siswa',
          data,
        })
        .then(_res => {
          this.$toast.success('Input siswa berhasil')
          this.populateSiswa()
          this.$store.commit('finishLoading')
        })
        .catch(err => {
          this.$store.commit('finishLoading')
          // TODO: handle error
          console.error(err)
        })
    }
  },
}
</script>

<style>
</style>
