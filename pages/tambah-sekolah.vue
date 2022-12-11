<template>
  <div class="container">
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': isTabInput }">
          <a @click.prevent="() => setTabActive('input')">Input Sekolah</a>
        </li>
        <li :class="{ 'is-active': isTabUnggah }">
          <a @click.prevent="() => setTabActive('upload')">Upload Sekolah</a>
        </li>
      </ul>
    </div>
    <div v-if="isTabInput" class="section">
      <SekolahFormsVue
        :nama="nama"
        :npsn="npsn"
        :kecamatan="kecamatan"
        :desa="desa"
        :is-madrasah="isMadrasah"
        :tingkat="tingkat"
        :profil="profil"
        :is-negeri="isNegeri"
        :koordinat="koordinat"
        @changeNama="nama = $event"
        @changeNpsn="npsn = $event"
        @changeKecamatan="kecamatan = $event"
        @changeDesa="desa = $event"
        @changeIsMadrasah="isMadrasah = $event"
        @changeTingkat="tingkat = $event"
        @changeProfil="profil = $event"
        @changeIsNegeri="isNegeri = $event"
        @changeKoordinat="koordinat = $event"
        @submitInsert="submitInsert"
      />
    </div>

    <div v-else-if="isTabUnggah" class="section">
      <div class="columns">
      </div>
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
            <button
              class="button is-primary"
              :disabled="isReadonlyUser"
              :class="{ 'is-loading': loading }"
              @click.prevent="submitUpload"
            >
              Upload
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import SekolahFormsVue from '../components/SekolahForms.vue'
import {
  LIST_KOOR_KECAMATAN,
  DEFAULT_KOOR_SAMPANG,
  EXCEL_CONTENT_TYPE,
} from '@/utils/constants.mjs'
import { catchAndToastError } from '@/utils/common'

export default {
  name: 'SekolahInput',
  components: {
    SekolahFormsVue,
  },
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      tabActive: 'input',
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
      // upload
      fileName: '......',
      file: null,
    }
  },
  computed: {
    isTabInput() {
      return this.tabActive === 'input'
    },
    isTabUnggah() {
      return this.tabActive === 'upload'
    },
    ...mapGetters([
      'isProvinsiUser',
      'isDinasPendidikanUser',
      'isKemenagUser',
      'isReadonlyUser',
      'loading',
    ]),
  },
  watch: {
    kecamatan(value) {
      this.koordinat = LIST_KOOR_KECAMATAN[value] || DEFAULT_KOOR_SAMPANG
    },
  },
  beforeMount() {
    this.is_madrasah = this.isKemenagUser
  },
  methods: {
    setTabActive(menu) {
      if (this.tabActive !== menu) {
        this.tabActive = menu
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
    },
    submitInsert() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'POST',
          url: '/api/sekolah',
          data: {
            nama: this.nama,
            npsn: this.npsn,
            kecamatan: this.kecamatan,
            kelurahan_atau_desa: this.desa,
            is_madrasah: this.isMadrasah,
            tingkat: this.tingkat,
            profil: this.profil,
            jenis: this.isNegeri ? 'negeri' : 'swasta',
            koordinat: this.koordinat,
          },
        })
        .then((_res) => {
          this.$store.commit('finishLoading')
          this.$toast.success('Input sekolah berhasil')
          this.populateSekolah()
        })
        .catch(catchAndToastError(this))
    },
    downloadTemplate() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/sekolah/download-template',
          responseType: 'blob',
        })
        .then((res) => {
          this.$store.commit('finishLoading')
          const fileURL = window.URL.createObjectURL(new Blob([res]))
          const fileLink = document.createElement('a')

          fileLink.href = fileURL
          fileLink.setAttribute('download', 'template-sekolah.xlsx')
          document.body.appendChild(fileLink)

          fileLink.click()
        })
        .catch(catchAndToastError(this))
    },
    previewFiles(e) {
      const file = e.target.files[0]
      this.fileName = file.name
      this.file = file
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
          url: '/api/sekolah/upload',
          headers: { 'Content-Type': 'multipart/form-data' },
          data: formData,
          responseType: 'blob',
        })
        .then(res => {
          this.$store.commit('finishLoading')
          this.$toast.success('Upload sekolah berhasil')
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
