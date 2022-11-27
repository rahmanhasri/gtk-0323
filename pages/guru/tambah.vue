<template>
  <div class="container">
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': isTabInput }">
          <a @click.prevent="() => setTabActive('input')">Input Tenaga Pendidik Dan Guru</a>
        </li>
        <li :class="{ 'is-active': isTabUnggah }">
          <a @click.prevent="() => setTabActive('unggah')">Unggah</a>
        </li>
      </ul>
    </div>
    <div class="section">
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
      />
      <!-- TODO: SEKOLAH DROPDOWN -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GuruFormsVue from '@/components/GuruForms.vue'
// const guruReqDto = [
//   'id',
//   'nama',
//   'no_ktp',
//   'nuptk',
//   'alamat',
//   'no_ponsel',
//   'ptk',
//   'jenis_kelamin',
//   'tanggal_lahir', // TODO:
//   'sekolah_id',
//   'latar_belakang', // TODO:
//   'jabatan',
//   'status',
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
      return this.tabActive === 'unggah'
    }
  },
  mounted() {

  },
  methods: {
    setTabActive(menu) {
      if (this.tabActive !== menu) {
        this.tabActive = menu
      }
    }
  }
}
</script>

<style></style>
