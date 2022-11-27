<template>
  <div class="container">
    <div class="columns">
      <div class="column is-3 field">
        <div class="field">
          <label class="label">Nama Guru</label>
          <div class="control">
            <input
              v-model="search"
              class="input"
              type="text"
              placeholder="Cari Guru"
            />
          </div>
        </div>
      </div>
      <div class="column is-3 is-field">
        <div class="field">
          <label class="label">NUPTK Guru</label>
          <div class="control">
            <input
              v-model="nuptkFilter"
              class="input"
              type="text"
              placeholder="NUPTK Guru"
            />
          </div>
        </div>
      </div>
      <div class="column is-3 field">
        <label class="label">Tingkat Sekolah</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select
              :disabled="isProvinsiUser"
              :value="tingkatFilter"
              @change="changeTingkatSekolah($event.target.value)"
            >
              <template v-if="isProvinsiUser">
                <option value="" disabled selected>SMA / SMK</option>
              </template>
              <template v-else>
                <option value="" disabled selected>
                  Pilih Tingkat Sekolah
                </option>
                <option value="TK">TK</option>
                <option value="PAUD">PAUD</option>
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
                <option value="SMA">SMA</option>
                <option value="SMK">SMK</option>
              </template>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-3 field">
        <label class="label">Nama Sekolah</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select
              :value="sekolahIdFilter"
              @change="changeSekolahId($event.target.value)"
            >
              <option value="" disabled selected>Pilih Sekolah</option>
              <option
                v-for="item in getDropdownSekolahFilter"
                :key="item.id + '_optsekolah'"
                :value="item.id"
              >
                {{ item.nama }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-4">
        <p class="control">
          <a
            class="button is-primary"
            :class="{ 'is-loading': loading }"
            @click="getListGuru"
          >
            Cari
          </a>
        </p>
      </div>
    </div>
    <template v-if="daftarGuru.length > 0">
      <TableGuruVue
        :paginated-list-guru="paginatedListGuru"
        :page="page"
        :limit="limit"
      />
      <TablePagination
        :paginated-list="paginatedListGuru"
        :page="page"
        :limit="limit"
        @turnPage="turnPage($event)"
      />
      <div class="columns">
        <div class="column is-4">
          <p class="control">
            <a
              class="button is-primary"
              :class="{ 'is-loading': loading }"
              @click="downloadListGuru"
            >
              Download
            </a>
          </p>
        </div>
      </div>
    </template>

    <p v-else class="title is-4">
      <font-awesome-icon icon="circle-exclamation" /> Daftar Guru Kosong
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TableGuruVue from '@/components/TableGuru.vue'
import TablePagination from '@/components/TablePagination.vue'

export default {
  name: 'DaftarGuru',
  components: {
    TableGuruVue,
    TablePagination,
  },
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      daftarSekolahId: [],
      daftarGuru: [],
      page: 1,
      limit: 40,
      // filter
      search: '',
      nuptkFilter: '',
      newFilter: false,
      tingkatFilter: '',
      sekolahIdFilter: '',
    }
  },
  computed: {
    ...mapGetters(['loading', 'isProvinsiUser']),
    paginatedListGuru() {
      return this.daftarGuru.slice(
        this.limit * (this.page - 1),
        this.limit * this.page
      )
    },
    getDropdownSekolahFilter() {
      return this.daftarSekolahId.filter((sekolah) => {
        if (this.tingkat) {
          return sekolah.tingkat === this.tingkat
        }
        return true
      })
    },
  },
  watch: {
    tingkatFilter(_value) {
      this.newFilter = true
    },
    sekolahIdFilter(_value) {
      this.newFilter = true
    },
    search(_value) {
      this.newFilter = true
    },
    nuptkFilter(_value) {
      this.newFilter = true
    },
  },
  mounted() {
    this.getListGuru()
    this.getListSekolahFilter()
  },
  methods: {
    turnPage(value) {
      if (this.page + value > 0) {
        this.page += value
      }
      this.getListGuru()
    },
    changeTingkatSekolah(value) {
      this.tingkatFilter = value
    },
    changeSekolahId(value) {
      this.sekolahIdFilter = value
    },
    getListGuru() {
      this.$store.commit('loading')
      const params = {}
      if (this.search) {
        params.nama = this.search
      }
      if (this.nuptk) {
        params.nuptk = this.nuptk
      }
      if (this.sekolahId) {
        params.sekolah_id = this.sekolahIdFilter
      }
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/tenaga-guru',
          params: {
            ...params,
            page: this.page,
            limit: this.limit,
          },
        })
        .then((res) => {
          if (this.newFilter) {
            this.newFilter = false
            this.page = 1
            this.daftarGuru = res
            return
          }
          if (!res.length && this.page !== 1) {
            this.page--
            return
          }
          this.daftarGuru = this.daftarGuru.concat(res)
          this.$store.commit('finishLoading')
        })
        .catch((err) => {
          this.$store.commit('finishLoading')
          // TODO: Handle error
          console.log('ERR', err)
        })
    },
    getListSekolahFilter() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/sekolah/list-name',
        })
        .then((res) => {
          this.daftarSekolahId = res
          this.$store.commit('finishLoading')
        })
        .catch((err) => {
          this.$store.commit('finishLoading')
          // TODO: Handle error
          console.log('ERR', err)
        })
    },
    downloadListGuru() {
      // TODO: integrate with API
    },
  },
}
</script>

<style></style>
