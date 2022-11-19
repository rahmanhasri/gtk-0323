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
      <div class="column is-1"></div>
      <form class="column is-8">
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
            <div class="select">
              <select v-model="desa">
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
          <label class="label">Tingkat</label>
          <div class="control">
            <div class="select">
              <select v-model="tingkat">
                <option value="" disabled selected>
                  Pilih Tingkat Sekolah
                </option>
                <option value="TK">TK</option>
                <option value="PAUD">PAUD</option>
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
                <option value="SMA">SMA</option>
                <option value="SMK">SMK</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">Nomor Pokok Sekolah Nasional</label>
          <div class="control">
            <input
              v-model="npsn"
              class="input"
              type="text"
              placeholder="NPSN"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Message</label>
          <div class="control">
            <textarea
              v-model="profil"
              class="textarea"
              placeholder="Profil Sekolah"
            ></textarea>
          </div>
        </div>

        <div class="field">
          <label class="label">Jenis Sekolah</label>
          <label for="switchNormal2">Swasta</label>
          <input
            id="switchNormal2"
            v-model="is_negeri"
            type="checkbox"
            name="switchNormal2"
            class="switch"
          />
          <label for="switchNormal2">Negeri</label>
        </div>
          <client-only>
        <div id="map-wrap" style="height: 300px" class="column is-12">
            <l-map :zoom="zoomMap" :center="koordinatKecamatan">
              <l-tile-layer
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
              ></l-tile-layer>
              <l-marker :lat-lng="koordinatKecamatan"></l-marker>
            </l-map>
        </div>
          </client-only>
        <!-- Koordinat use leaflet and use default from kecamatan -->
      </form>
    </div>
    <div v-else-if="isTabUnggah" class="columns"></div>
  </div>
</template>

<script>
import { LIST_KECAMATAN, LIST_DESA_BY_KECAMATAN, LIST_KOOR_KECAMATAN } from '@/utils/constants'

export default {
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      tabActive: 'input',
      // forms
      nama: '',
      npsn: '',
      kecamatan: '',
      desa: '',
      is_madrasah: false,
      tingkat: '',
      profil: '',
      is_negeri: false,
      zoomMap: 13,
    };
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
    koordinatKecamatan() {
      return LIST_KOOR_KECAMATAN[this.kecamatan] || ['-7.05', '113.25']
    }
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
