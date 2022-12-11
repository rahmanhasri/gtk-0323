<template>
  <div class="container">
    <div v-if="isEdit" class="tabs">
      <ul>
        <li :class="{ 'is-active': isTabInput }">
          <a @click.prevent="() => setTabActive('input')">Input Ruangan</a>
        </li>
        <li :class="{ 'is-active': isTabInventaris }">
          <a @click.prevent="() => setTabActive('inventaris')">Inventori</a>
        </li>
      </ul>
    </div>

    <div v-if="isTabInput" class="section">
      <progress v-if="loading" class="progress is-small is-primary" max="100" />
      <RuanganFormsVue
        v-else
        :nama="nama"
        :jenis="'ruangan'"
        :kondisi="kondisi"
        :daftar-foto-url="daftarFotoUrl"
        :is-submit="!isEdit"
        :sekolah-id="sekolahId"
        :sekolah-name="sekolahName"
        @changeNama="nama = $event"
        @changeKondisi="kondisi = $event"
        @submitInsert="submitInsert"
        @submitEdit="submitEdit"
        @removeFoto="removeFoto($event)"
        @deleteRuangan="deleteRuangan"
      />
    </div>

    <div v-if="isTabInventaris" class="section">
      <!-- Search nama or kode -->
      <div class="columns">
        <div class="column is-3 field">
          <div class="field">
            <label class="label">Cari Inventori</label>
            <div class="control">
              <input
                v-model="cariInventaris"
                class="input"
                type="text"
                placeholder="Nama / Kode"
              />
            </div>
          </div>
        </div>
        <div class="column is-1">
          <p class="control">
            <label class="label has-text-white">-</label>
            <button class="button is-primary" @click.prevent="filterInventaris">
              Cari
            </button>
          </p>
        </div>
      </div>
      <TableInventarisVue
        :paginated-list-inventaris="paginatedListInventaris"
        :page="pageInventaris"
        :limit="limitInventaris"
        @previewImage="previewImage($event)"
        @clickInventaris="showModalInput($event)"
      />
      <TablePagination
        :length="paginatedListInventaris.length"
        :page="pageInventaris"
        :limit="limitInventaris"
        @turnPage="pageInventaris += $event"
      />
      <div class="field">
        <p class="control">
          <button class="button is-info" @click.prevent="showModalInput()">
            Tambah
          </button>
        </p>
      </div>
      <client-only>
        <div :class="{ 'is-active': imageActive }" class="modal">
          <div class="modal-background" @click="imageActive = false"></div>
          <div style="width: 65%" class="modal-content">
            <figure class="image is-4by3">
              <img style="object-fit: cover" :src="imageInventaris" alt="" />
            </figure>
          </div>
          <button
            class="modal-close"
            aria-label="close"
            @click.prevent="imageActive = false"
          ></button>
        </div>

        <div
          v-if="modalInputActive"
          :class="{ 'is-active': modalInputActive }"
          class="modal"
        >
          <div class="modal-background" @click="modalInputActive = false"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Input Inventori</p>
            </header>
            <section class="modal-card-body">
              <InventarisFormsVue
                :init-nama="inventaris.nama"
                :init-kode-inventaris="inventaris.kode_inventaris"
                :init-kondisi="inventaris.kondisi"
                :daftar-foto-url="inventaris.daftar_foto_url"
                @closeModal="modalInputActive = false"
                @removeFotoInventaris="removeFotoInventaris($event)"
                @submitInventaris="submitInventaris($event)"
                @deleteInventaris="deleteInventaris"
              />
            </section>
          </div>
        </div>
      </client-only>
    </div>
  </div>
</template>

<script>
import RuanganFormsVue from '@/components/RuanganForms.vue'
import TableInventarisVue from '@/components/TableInventaris.vue'
import TablePagination from '@/components/TablePagination.vue'
import InventarisFormsVue from '@/components/FormInventaris.vue'
import { catchAndToastError } from '@/utils/common'

export default {
  name: 'RuanganInput',
  components: {
    RuanganFormsVue,
    TableInventarisVue,
    TablePagination,
    InventarisFormsVue,
  },
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      tabActive: 'input',
      isEdit: false,
      loading: true,
      // ruangan
      nama: '',
      kondisi: '',
      daftarFotoUrl: [],
      sekolahId: '',
      sekolahName: '',
      // inventaris
      daftarInventaris: [],
      pageInventaris: 1,
      limitInventaris: 20,
      search: '',
      cariInventaris: '',
      // inventaris input
      loadingInventaris: false,
      modalInputActive: false,
      imageActive: false,
      imageInventaris: '',
      inventaris: {
        id: '',
        nama: '',
        kode_nventaris: '',
        kondisi: '',
        daftar_foto_url: [],
      },
    }
  },
  computed: {
    isTabInput() {
      return this.tabActive === 'input'
    },
    isTabInventaris() {
      return this.tabActive === 'inventaris'
    },
    paginatedListInventaris() {
      const a = this.limitInventaris * (this.pageInventaris - 1)
      const b = this.limitInventaris * this.pageInventaris
      return this.daftarInventaris
        .filter((inv) => {
          if (this.search) {
            const search = this.search.toLowerCase()
            return (
              inv.nama.toLowerCase().includes(search) ||
              inv.kode_inventaris.toLowerCase().includes(search)
            )
          }
          return true
        })
        .slice(a, b)
    },
  },
  created() {
    if (this.$route.params?.id) {
      this.isEdit = true
      this.detailRuangan(this.$route.params?.id)
    } else {
      this.loading = false
    }

    if (this.$route.query) {
      this.sekolahId = this.$route.query.sekolahId
      this.sekolahName = this.$route.query.sekolahName
    }
  },
  methods: {
    setTabActive(value) {
      this.tabActive = value
    },
    populateRuangan(ruangan = {}) {
      this.nama = ruangan.nama || ''
      this.kondisi = ruangan.kondisi || ''
      this.daftarFotoUrl = ruangan.daftar_foto_url || []
      this.sekolahId = ruangan.sekolah_id || ''
      this.sekolahName = ruangan.sekolah?.nama || ''
      this.daftarInventaris = ruangan.daftar_inventori || []
    },
    removeFoto(url) {
      this.daftarFotoUrl = this.daftarFotoUrl.filter((foto) => foto !== url)
    },
    previewImage(url) {
      this.imageActive = true
      this.imageInventaris = url
    },
    removeFotoInventaris(url) {
      this.inventaris.daftar_foto_url = this.inventaris.daftar_foto_url.filter(
        (foto) => foto !== url
      )
    },
    filterInventaris() {
      this.pageInventaris = 1
      this.search = this.cariInventaris
    },
    populateInventaris(inventaris = {}) {
      this.inventaris = inventaris
    },
    showModalInput(inventaris = {}) {
      this.populateInventaris(inventaris)
      this.modalInputActive = true
    },
    // REST API
    detailRuangan(id) {
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: `/api/sarana/${id}`,
        })
        .then((res) => {
          this.populateRuangan(res)
          this.loading = false
        })
        .catch(catchAndToastError(this))
    },
    submitInsert() {
      this.loading = true
      const data = {
        nama: this.nama,
        kondisi: this.kondisi,
        daftar_foto_url: this.daftarFotoUrl,
        sekolah_id: this.sekolahId,
        jenis: 'ruangan',
      }
      this.$auth
        .requestWith('local', {
          method: 'POST',
          url: '/api/sarana',
          data,
        })
        .then((_res) => {
          const sekolahId = this.sekolahId
          this.populateRuangan()
          this.loading = false
          this.$toast.success('Submit Ruangan berhasil')
          this.$router.push('/sekolah/' + sekolahId + '#daftar-ruangan')
        })
        .catch(catchAndToastError(this))
    },
    submitEdit() {
      this.loading = true
      const data = {
        id: this.$route.params.id,
        nama: this.nama,
        kondisi: this.kondisi,
        daftar_foto_url: this.daftarFotoUrl,
      }
      this.$auth
        .requestWith('local', {
          method: 'PUT',
          url: '/api/sarana',
          data,
        })
        .then((_res) => {
          this.$toast.success('Edit Ruangan berhasil')
          this.loading = false
        })
        .catch(catchAndToastError(this))
    },
    submitInventaris(inventaris = {}) {
      this.$store.commit('loading')
      const url = '/api/sarana/inventaris'
      let method = 'POST'
      const data = {
        nama: inventaris.nama,
        kode_inventaris: inventaris.kode_inventaris,
        kondisi: inventaris.kondisi,
        daftar_foto_url: this.inventaris.daftar_foto_url,
        sarana_prasarana_id: this.$route.params.id,
      }
      if (this.inventaris.id) {
        data.id = this.inventaris.id
        method = 'PUT'
      }

      this.$auth
        .requestWith('local', {
          method,
          url,
          data,
        })
        .then((res) => {
          if (!this.inventaris.id) {
            this.daftarInventaris.push(res)
          }
          this.populateInventaris()
          this.$toast.success('Save Inventori berhasil')
          this.$store.commit('finishLoading')
          this.modalInputActive = false
        })
        .catch((err) => {
          this.$store.commit('finishLoading')
          this.$toast.error('Ada kesalahan di server')
          console.log('ERR', err)
        })
    },
    deleteRuangan() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'DELETE',
          url: '/api/sarana/' + this.$route.params.id,
        })
        .then((_res) => {
          this.$toast.success('Hapus Ruangan berhasil')
          setTimeout(() => {
            this.$router.replace(
              '/sekolah/' + this.sekolahId + '#daftar-ruangan'
            )
            this.$store.commit('finishLoading')
          }, 1000)
        })
        .catch((err) => {
          this.$store.commit('finishLoading')
          this.$toast.error('Ada kesalahan di server')
          console.log('ERR', err)
        })
    },
    deleteInventaris() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'DELETE',
          url: '/api/sarana/inventaris/' + this.inventaris.id,
        })
        .then((_res) => {
          this.daftarInventaris = this.daftarInventaris.filter(
            (inv) => inv.id !== this.inventaris.id
          )
          this.$toast.success('Hapus Inventori berhasil')
          setTimeout(() => {
            this.modalInputActive = false
            this.$store.commit('finishLoading')
          }, 1000)
        })
        .catch((err) => {
          this.$store.commit('finishLoading')
          this.$toast.error('Ada kesalahan di server')
          console.log('ERR', err)
        })
    },
  },
}
</script>

<style></style>
