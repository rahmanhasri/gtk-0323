<template>
  <div class="container">
    <div class="section">
      <progress v-if="loading" class="progress is-small is-primary" max="100" />
      <SiswaFormsVue
        v-else
        :nama="nama"
        :nomor-induk-nasional="nomorIndukNasional"
        :nomor-induk-sekolah="nomorIndukSekolah"
        :jenis-kelamin="jenisKelamin"
        :kelas="String(kelas)"
        :alamat="alamat"
        :no-ponsel="noPonsel"
        :tahun-angkatan="+tahunAngkatan"
        :tanggal-lahir="tanggalLahir"
        :is-active="isActive"
        :daftar-sekolah="daftarSekolah"
        :sekolah-id="sekolah.id"
        :sekolah-name="sekolah.nama"
        :is-submit="false"
        :editable="editable"
        :view-only="!editable"
        @changeNama="nama = $event"
        @changeNomorIndukSekolah="nomorIndukSekolah = $event"
        @changeNomorIndukNasional="nomorIndukNasional = $event"
        @changeJenisKelamin="jenisKelamin = $event"
        @changeKelas="kelas = $event"
        @changeAlamat="alamat = $event"
        @changeNoPonsel="noPonsel = $event"
        @changeTahunAngkatan="tahunAngkatan = $event"
        @changeTanggalLahir="tanggalLahir = $event"
        @changeSekolahId="sekolahId = $event"
        @submitEdit="submitEdit"
        @submitDelete="submitDelete"
        @changeEditable="editable = !editable"
        @changeIsActive="isActive = $event"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SiswaFormsVue from '@/components/SiswaForms.vue'
import { catchAndToastError } from '@/utils/common'

export default {
  name: 'SiswaDetail',
  components: {
    SiswaFormsVue,
  },
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      editable: false,
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
      isActive: true,
      sekolah: {
        nama: '',
      },
      // populate
      daftarSekolah: [],
    }
  },
  computed: {
    ...mapGetters(['loading']),
  },
  beforeMount() {
    this.getDetailSiswa()
    this.getListSekolahFilter()
  },
  methods: {
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
      this.tanggalLahir =
        this.getFormatYear(new Date(siswa.tanggal_lahir)) || ''
      this.isActive = siswa.is_active
      this.sekolah = siswa.sekolah
    },
    getFormatYear(date) {
      let output = ''
      output += date.getFullYear()
      const mm = date.getMonth() + 1
      output += '-' + (mm < 10 ? `0${mm}` : mm)
      const dd = date.getDate()
      output += '-' + (dd < 10 ? `0${dd}` : dd)
      return output
    },
    getListSekolahFilter() {
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/sekolah/list-name',
        })
        .then((res) => {
          this.daftarSekolah = res
        })
        .catch(catchAndToastError(this))
    },
    getDetailSiswa() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: `/api/siswa/${this.$route.params.id}`,
        })
        .then((res) => {
          this.populateSiswa(res)
          this.$store.commit('finishLoading')
        })
        .catch(catchAndToastError(this))
    },
    submitEdit() {
      this.$store.commit('loading')
      const data = {
        id: this.$route.params.id,
        nama: this.nama,
        nomor_induk_sekolah: this.nomorIndukSekolah,
        nomor_induk_nasional: this.nomorIndukNasional,
        jenis_kelamin: this.jenisKelamin,
        kelas: +this.kelas,
        alamat: this.alamat,
        no_ponsel: this.noPonsel,
        tahun_angkatan: String(this.tahunAngkatan),
        sekolah_id: this.sekolahId,
        tanggal_lahir: new Date(this.tanggalLahir),
        is_active: this.isActive,
      }

      this.$auth
        .requestWith('local', {
          method: 'PUT',
          url: '/api/siswa',
          data,
        })
        .then((_res) => {
          this.$store.commit('finishLoading')
          this.$toast.success('Edit siswa berhasil')
        })
        .catch(catchAndToastError(this))
    },
    submitDelete() {
      this.$toast.error('Anda yakin ?', {
        action: [
          {
            text: 'Tidak',
            onClick: (_e, toastObject) => {
              toastObject.goAway(0)
            },
          },
          {
            text: 'Ya',
            onClick: (_e, toastObject) => {
              this.$store.commit('loading')
              this.$auth
                .requestWith('local', {
                  method: 'DELETE',
                  url: '/api/siswa/' + this.$route.params.id,
                })
                .then((_res) => {
                  this.$store.commit('finishLoading')
                  this.$toast.success('Hapus siswa berhasil')
                  this.$router.replace('/siswa/daftar')
                })
                .catch(catchAndToastError(this))
              toastObject.goAway(0)
            },
          },
        ],
      })
    },
  },
}
</script>

<style></style>

</style>