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
      console.log(guru)
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

    },
  }
}
</script>

<style>

</style>