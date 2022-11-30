<template>
  <div class="container">
    <div class="section">
      <progress v-if="loading" class="progress is-small is-primary" max="100" />
      <GuruFormsVue
        v-else
        :nama="nama"
        :no-ktp="noKtp"
        :nuptk="nuptk"
        :alamat="alamat"
        :no-ponsel="noPonsel"
        :ptk="ptk"
        :jenis-kelamin="jenisKelamin"
        :jabatan="jabatan"
        :status="status"
        :sekolah-name="sekolah.nama"
        :sekolah-id="sekolah.id"
        :is-submit="false"
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
        @submitEdit="submitEdit"
      />
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GuruFormsVue from '@/components/GuruForms.vue';
import { catchAndToastError } from '@/utils/common'

export default {
  name: 'GuruDetail',
  components: {
    GuruFormsVue,
  },
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
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
    this.getDetailGuru()
    this.getListSekolahFilter()
  },
  methods: {
    populateGuru(guru = {}) {
      this.nama = guru.nama || ''
      this.noKtp = guru.no_ktp || ''
      this.nuptk = guru.nuptk || ''
      this.alamat = guru.alamat || ''
      this.noPonsel = guru.no_ponsel || ''
      this.ptk = guru.ptk || ''
      this.jenisKelamin = guru.jenis_kelamin || ''
      this.sekolahId = guru.sekolah_id || ''
      this.jabatan = guru.jabatan || ''
      this.status = guru.status || ''
      this.sekolah = guru.sekolah
    },
    // REST API
    getListSekolahFilter() {
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/sekolah/list-name',
        })
        .then((res) => {
          this.daftarSekolah = res
        })
        .catch((err) => {
          // TODO: Handle error
          console.log('ERR', err)
        })
    },
    getDetailGuru() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: `/api/tenaga-guru/${this.$route.params.id}`,
        })
        .then((res) => {
          this.populateGuru(res)
          this.$store.commit('finishLoading')
        })
        .catch((err) => {
          this.$store.commit('finishLoading')
          // TODO: Handle error
          console.log('ERR', err)
        })
    },
    submitEdit() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'PUT',
          url: '/api/tenaga-guru',
          data: {
            id: this.$route.params.id,
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
          },
        })
        .then((_res) => {
          this.$store.commit('finishLoading')
          this.$toast.success('Edit sekolah berhasil')
        })
        .catch(catchAndToastError(this))
    },
  }
}
</script>

<style>

</style>