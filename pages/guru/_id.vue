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
        :kategori="kategori"
        :jenjang="jenjang"
        :is-active-guru="isActive"
        :sekolah-name="sekolah.nama"
        :sekolah-id="sekolah.id"
        :is-submit="false"
        :daftar-sekolah="daftarSekolah"
        :view-only="!editable"
        :editable="editable"
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
        @changeKategori="kategori = $event"
        @changeJenjang="(jenjang = $event)"
        @changeIsActive="(isActive = $event)"
        @submitEdit="submitEdit"
        @submitDelete="submitDelete"
        @changeEditable="editable = !editable"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GuruFormsVue from '@/components/GuruForms.vue'
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
      editable: false,
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
      kategori: '',
      jenjang: '',
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
      this.kategori = guru.kategori || ''
      this.jenjang = guru.jenjang || ''
      this.isActive = guru.is_active || true
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
        .catch(catchAndToastError(this))
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
        .catch(catchAndToastError(this))
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
            kategori: this.kategori,
            jenjang: this.jenjang,
            is_active: this.isActive,
          },
        })
        .then((_res) => {
          this.$store.commit('finishLoading')
          this.$toast.success('Edit guru / tenaga pendidik berhasil')
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
                  url: '/api/tenaga-guru/' + this.$route.params.id,
                })
                .then((_res) => {
                  this.$store.commit('finishLoading')
                  this.$toast.success('Hapus guru / tenaga pendidik berhasil')
                  setTimeout(() => {
                    this.$router.replace('/guru/daftar')
                  }, 1000)
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
