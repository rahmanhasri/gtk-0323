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
          <a @click.prevent="() => setTabActive('daftar-guru')">Daftar Guru</a>
        </li>
      </ul>
    </div>
    <div v-if="isTabEdit" class="section">
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
      />
    </div>

    <template v-if="isTabSiswa">
      <TableSiswaVue
        :daftar-siswa="daftarSiswa"
        :page="pageSiswa"
        :limit="20"
        @turnPage="turnPage($event, 'Siswa')"
      />
    </template>
    <template v-if="isTabGuru">
      <TableGuruVue
      :daftar-guru="daftarGuru"
      :page="pageGuru"
      :limit="20"
      @turnPage="turnPage($event, 'Guru')"
      />
    </template>
  </div>
</template>

<script>
import SekolahFormsVue from '@/components/SekolahForms.vue'
import TableSiswaVue from '@/components/TableSiswa.vue'
import TableGuruVue from '@/components/TableGuru.vue'

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
      daftarGuru: [],
      pageGuru: 1,
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
  },
  async mounted() {
    await this.getDetailSekolah()
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
      this.daftarGuru = sekolah.daftar_guru || []
      this.daftarSiswa = sekolah.daftar_siswa
    },
    getDetailSekolah() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: `/api/sekolah/${this.$route.params.id}`,
        })
        .then((res) => {
          this.populateSekolah(res)
          this.$store.commit('finishLoading')
        })
        .catch((err) => {
          this.$store.commit('finishLoading')
          // TODO: Handle error
          console.log('ERR', err)
        })
    },
    turnPage(value, type) {
      if (this[`page${type}`] + value > 0) {
        this[`page${type}`] += value
      }
    },
  },
}
</script>

<style></style>
