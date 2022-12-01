<template>
  <div class="container">
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': isTabInput }">
          <a @click.prevent="() => setTabActive('input')"
            >Input Tenaga Pendidik Dan Guru</a
          >
        </li>
        <li :class="{ 'is-active': isTabUnggah }">
          <a @click.prevent="() => setTabActive('upload')">Upload</a>
        </li>
      </ul>
    </div>
    <div v-if="isTabInput" class="section">
      <GuruFormsVue
        :nama="nama"
        :no-ktp="noKtp"
        :nuptk="nuptk"
        :alamat="alamat"
        :no-ponsel="noPonsel"
        :ptk="ptk"
        :jenis-kelamin="jenisKelamin"
        :jabatan="jabatan"
        :status="status"
        :is-submit="true"
        :daftar-sekolah="daftarSekolah"
        @changeSekolahId="sekolahId = $event"
        @changeNama="nama = $event"
        @changeNoKtp="noKtp = $event"
        @changeNuptk="nuptk = $event"
        @changeAlamat="alamat = $event"
        @changeNoPonsel="noPonsel = $event"
        @changePtk="ptk = $event"
        @changeJenisKelamin="jenisKelamin = $event"
        @changeJabatan="jabatan = $event"
        @changeStatus="status = $event"
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
import GuruFormsVue from '@/components/GuruForms.vue'
import { catchAndToastError } from '@/utils/common'
import { EXCEL_CONTENT_TYPE } from '@/utils/constants.mjs'
// const guruReqDto = [
//   'tanggal_lahir', // TODO:
//   'latar_belakang', // TODO:
// ]
export default {
  name: 'GuruInput',
  components: {
    GuruFormsVue,
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
      noKtp: '',
      nuptk: '',
      alamat: '',
      noPonsel: '',
      ptk: '',
      jenisKelamin: '',
      sekolahId: '',
      jabatan: '',
      status: '',
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
    populateGuru(guru = {}) {
      this.nama = guru.nama || ''
      this.noKtp = guru.no_ktp || ''
      this.nuptk = guru.nuptk || ''
      this.alamat = guru.alamat || ''
      this.noPonsel = guru.no_ponsel || ''
      this.ptk = guru.ptk || ''
      this.jenisKelamin = guru.jenis_kelamin || ''
      this.sekolah_id = guru.sekolah_id || ''
      this.jabatan = guru.jabatan || ''
      this.status = guru.status || ''
    },
    submitInsert() {
      this.$store.commit('loading')
      const data = {
        nama: this.nama,
        no_ktp: this.noKtp,
        nuptk: this.nuptk,
        alamat: this.alamat,
        no_ponsel: this.noPonsel,
        ptk: this.ptk,
        jenis_kelamin: this.jenisKelamin,
        sekolah_id: this.sekolahId,
        jabatan: this.jabatan,
        status: this.status,
      }
      this.$auth
        .requestWith('local', {
          method: 'POST',
          url: '/api/tenaga-guru',
          data,
        })
        .then((_res) => {
          this.$toast.success('Input guru berhasil')
          this.$store.commit('finishLoading')
          this.populateGuru()
        })
        .catch((err) => {
          this.$store.commit('finishLoading')
          // TODO: Handle Error
          console.log('ERR', err)
        })
    },
    downloadTemplate() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/tenaga-guru/download-template',
          responseType: 'blob',
        })
        .then((res) => {
          this.$store.commit('finishLoading')
          const fileURL = window.URL.createObjectURL(new Blob([res]))
          const fileLink = document.createElement('a')

          fileLink.href = fileURL
          fileLink.setAttribute('download', 'template-guru.xlsx')
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
          url: '/api/tenaga-guru/upload',
          headers: { 'Content-Type': 'multipart/form-data' },
          data: formData,
          responseType: 'blob',
        })
        .then(res => {
          this.$store.commit('finishLoading')
          this.$toast.success('Upload guru berhasil')
          const fileURL = window.URL.createObjectURL(new Blob([res], { type: EXCEL_CONTENT_TYPE }))
          const fileLink = document.createElement('a')

          fileLink.href = fileURL
          fileLink.setAttribute('download', 'hasil-upload.xlsx')
          document.body.appendChild(fileLink)

          fileLink.click()
        })
        .catch(catchAndToastError(this))
    }
  },
}
</script>

<style></style>
