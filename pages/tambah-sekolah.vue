<template>
  <div class="container">
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': isTabInput }">
          <a @click.prevent="() => setTabActive('input')">Input Data</a>
        </li>
        <li :class="{ 'is-active': isTabUnggah }">
          <a @click.prevent="() => setTabActive('unggah')">Unggah Data</a>
        </li>
      </ul>
    </div>
    <div v-if="isTabInput" class="columns">
      <form>
        <div class="field">
          <label class="label">Nama Sekolah</label>
          <div class="control">
            <input
              v-model="nama"
              class="input"
              type="text"
              placeholder="Nama Sekolah"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Kecamatan</label>
          <div class="control">
            <div class="select">
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

        <div class="field">
          <label class="label">Kelurahan / desa</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="desaFilter">
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

        <div class="field">
          <label class="label">Kategori Sekolah</label>
          <input
            id="switchNormal"
            v-model="is_madrasah"
            type="checkbox"
            name="switchNormal"
            class="switch"
          />
          <label for="switchNormal">Madrasah</label>
        </div>

        <div class="field">
          <!-- tingkat dropdown -->
        </div>

        <div class="field">
          <!-- profil text -->
        </div>

        <div class="field">
          <!-- jenis  radiobutton-->
        </div>

        <!-- Koordinat use leaflet and use default from kecamatan -->
      </form>
    </div>
    <div v-else-if="isTabUnggah" class="columns"></div>
  </div>
</template>

<script>
import { LIST_KECAMATAN, LIST_DESA_BY_KECAMATAN } from '@/utils/constants'

export default {
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      tabActive: 'input',
      // forms
      nama: '',
      kecamatan: '',
      is_madrasah: false,
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
  },
}
</script>

<style></style>
