<!-- eslint-disable vue/attributes-order -->
<template>
  <div class="container">
    <div class="columns">
      <div class="column is-3 field">
        <div class="field">
          <label class="label">Sekolah</label>
          <div class="control">
            <input class="input" type="text" placeholder="Cari Sekolah" />
          </div>
        </div>
      </div>
      <div class="column is-3 field">
        <label class="label">Tingkat Sekolah</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model="tingkatFilter">
              <option value="">Semua tingkat</option>
              <option v-if="!isProvinsiUser" value="PAUD">PAUD</option>
              <option v-if="!isProvinsiUser" value="TK">TK</option>
              <option v-if="!isProvinsiUser" value="SD">SD</option>
              <option v-if="!isProvinsiUser" value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="SMK">SMK</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column is-3 field">
        <label class="label">Kecamatan</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model="kecamatanFilter">
              <option value="">Semua kecamatan</option>
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
      <div class="column is-3 field">
        <label class="label">Kelurahan / desa</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model="desaFilter">
              <option value="">Semua kelurahan / desa</option>
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
    </div>
    <div class="columns">
      <div class="column is-12 field">
        <p class="control">
          <a class="button is-primary" @click="getListSekolah"> Cari </a>
        </p>
      </div>
    </div>
    <table class="table is-fullwidth is-bordered is-striped is-hoverable">
      <thead>
        <tr>
          <th>No.</th>
          <th>Nama Sekolah</th>
          <th>Jenis</th>
          <th>Kecamatan</th>
          <th>Kelurahan / Desa</th>
        </tr>
      </thead>
      <tbody>
          <tr v-for="(item, index) in listSekolah" :key="index" @click="$router.push('/sekolah/' + item.id)">
            <td>{{ index + 1 + (page - 1) * limit }}</td>
            <td>{{ item.nama }}</td>
            <td>{{ item.jenis }}</td>
            <td>{{ item.kecamatan }}</td>
            <td>{{ item.kelurahan_atau_desa }}</td>
          </tr>
      </tbody>
    </table>
    <!-- <nav class="pagination" role="navigation" aria-label="pagination">
      <a class="pagination-previous" :class="{ 'is-disabled': page === 1 }" @click.prevent="">Previous</a>
      <a class="pagination-next">Next page</a>
    </nav> -->
  </div>
</template>

<script>
import { LIST_KECAMATAN, LIST_DESA_BY_KECAMATAN } from '@/utils/constants'

export default {
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      search: '',
      tingkatFilter: '',
      kecamatanFilter: '',
      desaFilter: '',
      listSekolah: [],
      page: 1,
      limit: 20,
    }
  },
  computed: {
    selectListDesa() {
      return LIST_DESA_BY_KECAMATAN[this.kecamatanFilter] || []
    },
    isProvinsiUser() {
      return this.$auth.$storage.getUniversal('scopeusr') === 'dinasprov'
    },
    loading() {
      return this.$store.state.loading
    },
  },
  mounted() {
    this.getListSekolah()
  },
  methods: {
    getListKecamatan() {
      return LIST_KECAMATAN
    },
    getListSekolah() {
      this.$store.commit('loading')
      const params = {}
      if (this.search) {
        params.nama = this.search
      }
      if (this.tingkatFilter) {
        params.tingkat = this.tingkatFilter
      }
      if (this.kecamatanFilter) {
        params.kecamatan = this.kecamatanFilter
      }
      if (this.desaFilter) {
        params.desa = this.desaFilter
      }

      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/sekolah',
          params: {
            ...params,
            // TODO: add pagination
            // page: this.page,
            // limit: this.limit,
          },
        })
        .then((res) => {
          this.$store.commit('finishLoading')
          this.listSekolah = res
        })
        .catch((err) => {
          this.$store.commit('finishLoading')
          // TODO: Handle error
          console.log('ERR', err)
        })
    },
  },
}
</script>

<style></style>
