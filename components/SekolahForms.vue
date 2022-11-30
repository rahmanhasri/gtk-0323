<template>
  <ValidationObserver
    ref="observer"
    v-slot="{ validate, invalid, reset }"
  >
    <div class="columns">
      <ValidationProvider
        v-slot="{ errors }"
        rules="required|min:5"
        name="nama"
        tag="div"
        class="column is-8"
      >
        <div class="field">
          <label class="label">Nama Sekolah</label>
          <div class="control">
            <input
              v-model="form.nama"
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Nama Sekolah"
              :readonly="viewOnly"
              @change="$emit('changeNama', $event.target.value)"
            />
          </div>
        </div>
      </ValidationProvider>

      <div v-if="!isSubmit" class="column is-2 is-offset-1">
        <div class="field">
          <label class="label"> Edit </label>
          <input
            id="switchNormal3"
            type="checkbox"
            name="switchNormal3"
            class="switch"
            :checked="editable ? '1' : ''"
            @change="$emit('changeEditable')"
          />
          <label for="switchNormal3"></label>
        </div>
      </div>
    </div>

    <div class="columns">
      <ValidationProvider
        rules="required"
        name="kecamatan"
        tag="div"
        class="column is-12"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Kecamatan</label>
          <div class="control">
            <div class="select" :class="{ 'is-danger': errors[0] }">
              <select
                v-model="form.kecamatan"
                :disabled="viewOnly"
                @change="changeKecamatan($event.target.value)"
              >
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
        <!-- <span><p class="is-danger">{{ errors[0] }}</p></span> -->
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider rules="required" name="desa" tag="div" class="column">
        <div slot-scope="{ errors }" class="field">
          <label class="label">Kelurahan / desa</label>
          <div class="control">
            <div class="select" :class="{ 'is-danger': errors[0] }">
              <select
                v-model="form.desa"
                :disabled="viewOnly"
                @change="$emit('changeDesa', $event.target.value)"
              >
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
      </ValidationProvider>
    </div>

    <div class="columns">
      <div class="column">
        <div class="field">
          <label class="label">Kategori Sekolah</label>
          <input
            id="switchNormal"
            type="checkbox"
            name="switchNormal"
            class="switch"
            :checked="isMadrasah ? '1' : ''"
            :disabled="isKemenagUser || isDinasPendidikanUser || viewOnly"
            @change="$emit('changeIsMadrasah', !isMadrasah)"
          />
          <label for="switchNormal">Madrasah</label>
        </div>
      </div>
    </div>

    <div class="columns">
      <ValidationProvider
        rules="required"
        name="tingkat"
        tag="div"
        class="column"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Tingkat</label>
          <div class="control">
            <div class="select" :class="{ 'is-danger': errors[0] }">
              <select
                v-model="form.tingkat"
                :disabled="isProvinsiUser || viewOnly"
                @change="$emit('changeTingkat', $event.target.value)"
              >
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
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider
        rules="required|min:4"
        name="npsn"
        tag="div"
        class="column is-6"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Nomor Pokok Sekolah Nasional</label>
          <div class="control">
            <input
              v-model="form.npsn"
              label="npsn"
              class="input"
              :class="{ 'is-danger': errors[0] }"
              type="text"
              placeholder="NPSN"
              :readonly="viewOnly"
              @change="$emit('changeNpsn', $event.target.value)"
            />
          </div>
        </div>
      </ValidationProvider>
    </div>

    <div class="columns">
      <div class="column is-6">
        <div class="field">
          <label class="label">Profil Sekolah</label>
          <div class="control">
            <textarea
              v-model="form.profil"
              class="textarea"
              placeholder="Profil Sekolah"
              :readonly="viewOnly"
              @change="$emit('changeProfil', $event.target.value)"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <div class="field">
          <label class="label">Jenis Sekolah</label>
          <label for="switchNormal2">Swasta</label>
          <input
            id="switchNormal2"
            type="checkbox"
            name="switchNormal2"
            class="switch"
            :checked="isNegeri ? '1' : ''"
            :disabled="viewOnly"
            @change="$emit('changeIsNegeri', !isNegeri)"
          />
          <label for="switchNormal2">Negeri</label>
        </div>
      </div>
    </div>

    <div class="columns">
      <client-only>
        <div id="map-wrap" style="height: 300px" class="column is-10">
          <l-map :zoom="13" :center="koordinat">
            <l-tile-layer
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            ></l-tile-layer>
            <l-marker
              :lat-lng="koordinat"
              draggable
              @dragend="onDragEnd"
            ></l-marker>
          </l-map>
        </div>
      </client-only>
    </div>
    <div class="columns">
      <div class="column">
        <div v-if="isSubmit" class="field">
          <div class="control">
            <button
              :disabled="invalid"
              :class="{ 'is-loading': loading }"
              class="button is-primary"
              @click="submitInsert(reset)"
            >
              Submit
            </button>
          </div>
        </div>
        <div v-else class="field">
          <div class="control">
              <!-- :disabled="invalid" -->
            <button
              :disabled="invalid"
              :class="{ 'is-loading': loading }"
              class="button is-primary"
              @click="validate() && submitEdit()"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

import {
  LIST_KECAMATAN,
  LIST_DESA_BY_KECAMATAN,
  DEFAULT_KOOR_SAMPANG,
  LIST_KOOR_KECAMATAN,
} from '@/utils/constants.mjs'

export default {
  name: 'SekolahForms',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    nama: { type: String, default: '' },
    npsn: { type: String, default: '' },
    kecamatan: { type: String, default: '' },
    desa: { type: String, default: '' },
    isMadrasah: { type: Boolean, default: false },
    tingkat: { type: String, default: 'SMA' },
    profil: { type: String, default: '' },
    isNegeri: { type: Boolean, default: false },
    // menu
    isSubmit: { type: Boolean, default: true },
    viewOnly: { type: Boolean, default: false },
    editable: { type: Boolean, default: false }
  },
  data() {
    return {
      koordinat: DEFAULT_KOOR_SAMPANG || [],
      form: {
        nama: this.nama,
        npsn: this.npsn,
        kecamatan: this.kecamatan,
        desa: this.desa,
        isMadrasah: this.isMadrasah,
        tingkat: this.tingkat,
        isNegeri: this.isNegeri,
      }
    }
  },
  computed: {
    selectListDesa() {
      return LIST_DESA_BY_KECAMATAN[this.kecamatan] || []
    },
    ...mapGetters([
      'isProvinsiUser',
      'isDinasPendidikanUser',
      'isKemenagUser',
      'loading',
    ]),
  },
  mounted() {

  },
  methods: {
    getListKecamatan() {
      return LIST_KECAMATAN
    },
    changeKecamatan(value) {
      this.$emit('changeKecamatan', value)
      this.koordinat = LIST_KOOR_KECAMATAN[value]
    },
    onDragEnd(marker) {
      const { lat, lng } = marker.target._latlng
      this.koordinat = [String(lat), String(lng)]
      this.$emit('changeKoordinat', [String(lat), String(lng)])
    },
    async submitInsert(reset) {
      const isValid = await this.$refs.observer.validate();
      if (isValid) {
        this.$emit('submitInsert')
        this.form = {
          nama: '',
          npsn: '',
          kecamatan: '',
          desa: '',
          isMadrasah: false,
          tingkat: this.tingkat,
          isNegeri: false,
        }
        reset()
      }
    },
  },
}
</script>

<style></style>
