<template>
  <div class="container">
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': isTabInput }">
          <a @click.prevent="() => setTabActive('input')">Input Sekolah</a>
        </li>
        <li :class="{ 'is-active': isTabUnggah }">
          <a @click.prevent="() => setTabActive('unggah')">Unggah Sekolah</a>
        </li>
      </ul>
    </div>
    <div v-if="isTabInput" class="columns">
      <div class="column is-1"></div>
      <ValidationObserver ref="observer" slim>
        <div slot-scope="{ invalid, validate }" class="column is-8">
          <ValidationProvider rules="required|min:5" name="nama">
            <div slot-scope="{ errors }" class="field">
              <label class="label">Nama Sekolah</label>
              <div class="control">
                <input
                  v-model="nama"
                  :class="{ 'is-danger': errors[0] }"
                  class="input"
                  type="text"
                  placeholder="Nama Sekolah"
                />
              </div>
            </div>
          </ValidationProvider>

          <ValidationProvider rules="required" name="kecamatan">
            <div slot-scope="{ errors }" class="field">
              <label class="label">Kecamatan</label>
              <div class="control">
                <div class="select" :class="{ 'is-danger': errors[0] }">
                  <select v-model="kecamatan">
                    <option value="" disabled selected>Pilih Kecamatan</option>
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
            <!-- <span><p class="is-danger">{{ errors[0] }}</p></span> -->
          </ValidationProvider>

          <ValidationProvider rules="required" name="desa">
            <div slot-scope="{ errors }" class="field">
              <label class="label">Kelurahan / desa</label>
              <div class="control">
                <div class="select" :class="{ 'is-danger': errors[0] }">
                  <select v-model="desa">
                    <option value="" disabled selected>
                      Pilih Kelurahan / Desa
                    </option>
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
          </ValidationProvider>

          <div class="field">
            <label class="label">Kategori Sekolah</label>
            <input
              id="switchNormal"
              v-model="is_madrasah"
              type="checkbox"
              name="switchNormal"
              class="switch"
              :disabled="isKemenagUser || isDinasPendidikanUser"
            />
            <label for="switchNormal">Madrasah</label>
          </div>

          <ValidationProvider rules="required" name="tingkat">
            <div slot-scope="{ errors }" class="field">
              <label class="label">Tingkat</label>
              <div class="control">
                <div class="select" :class="{ 'is-danger': errors[0] }">
                  <select v-model="tingkat" :disabled="isProvinsiUser">
                    <option value="" disabled selected>
                      Pilih Tingkat Sekolah
                    </option>
                    <option value="TK">TK</option>
                    <option value="PAUD">PAUD</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="SMK">SMK</option>
                  </select>
                </div>
              </div>
            </div>
          </ValidationProvider>

          <ValidationProvider rules="required|min:4" name="npsn">
            <div slot-scope="{ errors }" class="field">
              <label class="label">Nomor Pokok Sekolah Nasional</label>
              <div class="control">
                <input
                  v-model="npsn"
                  label="npsn"
                  class="input"
                  :class="{ 'is-danger': errors[0] }"
                  type="text"
                  placeholder="NPSN"
                />
              </div>
            </div>
          </ValidationProvider>

          <div class="field">
            <label class="label">Message</label>
            <div class="control">
              <textarea
                v-model="profil"
                class="textarea"
                placeholder="Profil Sekolah"
              ></textarea>
            </div>
          </div>

          <div class="field">
            <label class="label">Jenis Sekolah</label>
            <label for="switchNormal2">Swasta</label>
            <input
              id="switchNormal2"
              v-model="is_negeri"
              type="checkbox"
              name="switchNormal2"
              class="switch"
            />
            <label for="switchNormal2">Negeri</label>
          </div>
          <client-only>
            <div id="map-wrap" style="height: 300px" class="column is-12">
              <l-map :zoom="zoomMap" :center="koordinat">
                <l-tile-layer
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                ></l-tile-layer>
                <l-marker
                  :lat-lng="koordinat"
                  draggable
                  @dragend="onDragEnd"
                ></l-marker>
              </l-map>
            </div>
          </client-only>
          <div class="field">
            <div class="control">
              <button
                :class="{ 'is-loading': loading }"
                class="button is-primary"
                :disabled="invalid"
                @click="validate().then(submitInsert)"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </ValidationObserver>
    </div>

    <div v-else-if="isTabUnggah" class="container">
      <div class="columns">
        <div class="column is-4 field">
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
        <div class="column is-8 field">
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
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapGetters } from 'vuex'
import {
  LIST_KECAMATAN,
  LIST_DESA_BY_KECAMATAN,
  LIST_KOOR_KECAMATAN,
  DEFAULT_KOOR_SAMPANG,
} from '@/utils/constants.mjs'
import { catchAndToastError } from '@/utils/common'

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
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
      is_madrasah: false,
      tingkat: '',
      profil: '',
      is_negeri: false,
      koordinat: DEFAULT_KOOR_SAMPANG || [],
      // map
      zoomMap: 13,
      // upload
      fileName: '......',
    }
  },
  computed: {
    isTabInput() {
      return this.tabActive === 'input'
    },
    isTabUnggah() {
      return this.tabActive === 'unggah'
    },
    selectListDesa() {
      return LIST_DESA_BY_KECAMATAN[this.kecamatan] || []
    },
    ...mapGetters([
      'isProvinsiUser',
      'isDinasPendidikanUser',
      'isKemenagUser',
      'loading',
    ]),
  },
  watch: {
    kecamatan(value) {
      this.koordinat = LIST_KOOR_KECAMATAN[value] || DEFAULT_KOOR_SAMPANG
    },
  },
  mounted() {
    this.is_madrasah = this.isKemenagUser
    this.tingkat = this.isProvinsiUser ? 'SMA' : ''
  },
  methods: {
    getListKecamatan() {
      return LIST_KECAMATAN
    },
    setTabActive(menu) {
      if (this.tabActive !== menu) {
        this.tabActive = menu
      }
    },
    onDragEnd(marker) {
      const { lat, lng } = marker.target._latlng
      this.koordinat = [lat, lng]
    },
    populateSekolah(sekolah = {}) {
      this.nama = sekolah.nama || ''
      this.npsn = sekolah.npsn || ''
      this.kecamatan = sekolah.kecamatan || ''
      this.desa = sekolah.desa || ''
      this.is_madrasah = sekolah.is_madrasah || false
      this.tingkat = sekolah.tingkat || ''
      this.profil = sekolah.profil || ''
      this.is_negeri = sekolah.negeri || false
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
            is_madrasah: this.is_madrasah,
            tingkat: this.tingkat,
            profil: this.profil,
            jenis: this.is_negeri ? 'negeri' : 'swasta',
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
    },
    submitUpload() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'POST',
          url: '/api/sekolah/upload',
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
          this.$store.commit('finishLoading')
          this.$toast.success('Upload sekolah berhasil')
          const fileURL = window.URL.createObjectURL(new Blob([res]))
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
