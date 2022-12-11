<template>
  <ValidationObserver
    ref="observer"
    v-slot="{ validate, invalid, reset }"
    tag="form"
  >
    <div class="columns">
      <ValidationProvider
        rules="required|min:5"
        name="nama"
        tag="div"
        class="column is-8"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Nama Lengkap</label>
          <div class="control">
            <input
              v-model="form.nama"
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Nama Tenaga Pendidik Atau Guru"
              :readonly="viewOnly"
              @change="$emit('changeNama', $event.target.value)"
            />
          </div>
        </div>
      </ValidationProvider>

      <div v-if="!isSubmit && !isReadonlyUser" class="column is-2 is-offset-1">
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
        rules="required|min:5"
        name="noKtp"
        tag="div"
        class="column is-3"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">No KTP</label>
          <div class="control">
            <input
              v-model="form.noKtp"
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="No KTP"
              :readonly="viewOnly"
              @change="$emit('changeNoKtp', $event.target.value)"
            />
          </div>
        </div>
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider
        rules="required"
        name="kategori"
        tag="div"
        class="column is-4"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Kategori</label>
          <div class="control">
            <div class="select" :class="{ 'is-danger': errors[0] }">
              <select
                v-model="form.kategori"
                :disabled="viewOnly"
                @change="$emit('changeKategori', $event.target.value)"
              >
                <option value="" disabled selected>Pilih Kategori</option>
                <option value="guru">Guru</option>
                <option value="tenaga-pendidik">Tenaga Pendidik</option>
              </select>
            </div>
          </div>
        </div>
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider
        rules="required|min:5"
        name="nuptk"
        tag="div"
        class="column is-5"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">NUPTK</label>
          <div class="control">
            <input
              v-model="form.nuptk"
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Nomor Unik Pendidik dan Tenaga Kependidikan"
              :readonly="viewOnly"
              @change="$emit('changeNuptk', $event.target.value)"
            />
          </div>
        </div>
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider
        rules="required|min:7"
        name="alamat"
        tag="div"
        class="column is-8"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Alamat</label>
          <div class="control">
            <input
              v-model="form.alamat"
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Alamat Lengkap"
              :readonly="viewOnly"
              @change="$emit('changeAlamat', $event.target.value)"
            />
          </div>
        </div>
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider
        rules="required|min:5"
        name="noPonsel"
        tag="div"
        class="column is-3"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">No Ponsel</label>
          <div class="control">
            <input
              v-model="form.noPonsel"
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="No Ponsel"
              :readonly="viewOnly"
              @change="$emit('changeNoPonsel', $event.target.value)"
            />
          </div>
        </div>
      </ValidationProvider>
    </div>

    <template v-if="$route.name.includes('guru')">
      <div class="columns">
        <div class="column is-4">
          <div class="field">
            <label class="label">Jenjang (Guru)</label>
            <div class="control">
              <div class="select">
                <select
                  v-model="form.jenjang"
                  :disabled="viewOnly"
                  @change="$emit('changeJenjang', $event.target.value)"
                >
                  <option value="" disabled selected>Pilih Jenjang Guru</option>
                  <option value="guru-pertama">Guru Pertama</option>
                  <option value="guru-muda">Guru Muda</option>
                  <option value="guru-madya">Guru Madya</option>
                  <option value="guru-utama">Guru Utama</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-4">
          <div class="field">
            <label class="label">Mata Pelajaran (Guru)</label>
            <div class="control">
              <input
                v-model="form.ptk"
                class="input"
                type="text"
                placeholder="Mata Pelajaran"
                :readonly="viewOnly"
                @change="$emit('changePtk', $event.target.value)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="columns">
      <ValidationProvider
        rules="required|min:5"
        name="jenisKelamin"
        tag="div"
        class="column is-3"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Jenis Kelamin</label>
          <div class="control">
            <div class="select" :class="{ 'is-danger': errors[0] }">
              <select
                v-model="form.jenisKelamin"
                :disabled="viewOnly"
                @change="$emit('changeJenisKelamin', $event.target.value)"
              >
                <option value="" disabled selected>Pilih Jenis</option>
                <option value="LAKI-LAKI">Laki-laki</option>
                <option value="PEREMPUAN">Perempuan</option>
              </select>
            </div>
          </div>
        </div>
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider
        rules="required"
        name="sekolah_id"
        tag="div"
        class="column is-4"
      >
        <div
          slot-scope="{ errors }"
          class="dropdown"
          :class="{ 'is-active': isActiveSekolahDropdown }"
        >
          <div class="dropdown-trigger">
            <div class="field">
              <label class="label">Sekolah</label>
              <p class="control is-expanded has-icons-right">
                <input
                  v-model="searchSekolah"
                  class="input"
                  type="search"
                  placeholder="Ketik nama sekolah"
                  :class="{ 'is-danger': errors[0] }"
                  :readonly="viewOnly"
                  @focusin="isActiveSekolahDropdown = true"
                  @focusout="deactivateDropdown"
                />
                <span class="icon is-small is-right"
                  ><font-awesome-icon
                    icon="magnifying-glass"
                    style="height: 20px"
                /></span>
              </p>
            </div>
          </div>
          <div class="dropdown-menu" role="menu">
            <div class="dropdown-content">
              <a
                v-for="sekolah in limitedDaftarSekolah"
                :key="sekolah.id + '_opt'"
                class="dropdown-item"
                @click.prevent="pickSekolah(sekolah)"
              >
                {{ sekolah.nama }}
              </a>
            </div>
          </div>
        </div>
      </ValidationProvider>
    </div>

    <div class="columns">
      <div class="column is-4">
        <div class="field">
          <label class="label">Jabatan</label>
          <div class="control">
            <input
              v-model="form.jabatan"
              class="input"
              type="text"
              placeholder="Jabatan"
              :readonly="viewOnly"
              @change="$emit('changeJabatan', $event.target.value)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <ValidationProvider
        rules="required"
        name="ptk"
        tag="div"
        class="column is-4"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Status </label>
          <div class="control">
            <div class="select" :class="{ 'is-danger': errors[0] }">
              <select
                v-model="form.status"
                :disabled="viewOnly"
                @change="$emit('changeStatus', $event.target.value)"
              >
                <option value="" disabled selected>Pilih Status</option>
                <option value="PNS">PNS</option>
                <option value="PPPK">PPPK</option>
                <option v-if="form.kategori === 'GURU'" value="GTT">
                  Guru Tidak Tetap
                </option>
                <option
                  v-else-if="form.kategori === 'TENAGA-PENDIDIK'"
                  value="NON-PNS"
                >
                  Non-PNS
                </option>
              </select>
            </div>
          </div>
        </div>
      </ValidationProvider>
    </div>
    <div v-if="!isSubmit" class="columns">
      <div class="column">
        <div class="field">
          <label class="label">Status Aktif</label>
          <input
            id="switchNormal"
            type="checkbox"
            name="switchNormal"
            class="switch"
            :checked="isActiveGuru ? '1' : ''"
            :disabled="viewOnly"
            @change="$emit('changeIsActive', !isActiveGuru)"
          />
          <label for="switchNormal">Aktif</label>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-2">
        <div v-if="isSubmit" class="field">
          <div class="control">
            <button
              :class="{ 'is-loading': loading }"
              class="button is-primary"
              :disabled="invalid || isReadonlyUser"
              @click.prevent="submitInsert(reset)"
            >
              Submit
            </button>
          </div>
        </div>

        <div v-else class="field">
          <div class="control">
            <button
              :disabled="invalid || isReadonlyUser || viewOnly"
              :class="{ 'is-loading': loading }"
              class="button is-primary"
              @click.prevent="validate() && $emit('submitEdit')"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <div v-if="!isSubmit && !viewOnly" class="column is-2">
        <div class="control">
          <button
            :disabled="invalid || isReadonlyUser"
            :class="{ 'is-loading': loading }"
            class="button is-danger"
            @click.prevent="$emit('submitDelete')"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import * as constants from '@/utils/constants.mjs'

export default {
  name: 'GuruForms',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    nama: { type: String, default: '' },
    noKtp: { type: String, default: '' },
    nuptk: { type: String, default: '' },
    alamat: { type: String, default: '' },
    noPonsel: { type: String, default: '' },
    ptk: { type: String, default: '' },
    jenisKelamin: { type: String, default: '' },
    sekolahId: { type: String, default: '' },
    jabatan: { type: String, default: '' },
    status: { type: String, default: '' },
    kategori: { type: String, default: '' },
    jenjang: { type: String, default: '' },
    sekolahName: { type: String, default: '' },
    isActiveGuru: { type: Boolean, default: true },
    isSubmit: { type: Boolean, default: true },
    viewOnly: { type: Boolean, default: false },
    editable: { type: Boolean, default: false },
    daftarSekolah: { type: Array, default: Array },
  },
  data() {
    const isTenagaPendidik = !this.$route.name.includes('guru')
    return {
      isTenagaPendidik,
      isActiveSekolahDropdown: false,
      searchSekolah: this.sekolahName || '',
      searchSekolahId: '',
      form: {
        nama: this.nama,
        noKtp: this.noKtp,
        nuptk: this.nuptk,
        alamat: this.alamat,
        noPonsel: this.noPonsel,
        ptk: this.ptk,
        jenisKelamin: this.jenisKelamin,
        sekolahId: this.sekolahId,
        jabatan: this.jabatan,
        status: this.status,
        kategori: this.kategori
          ? this.kategori
          : isTenagaPendidik
          ? constants.TENAGA_PENDIDIK
          : constants.GURU,
        jenjang: this.jenjang,
      },
    }
  },
  computed: {
    limitedDaftarSekolah() {
      return this.daftarSekolah
        .filter((sekolah) =>
          sekolah.nama.toLowerCase().includes(this.searchSekolah.toLowerCase())
        )
        .slice(0, 8)
    },
    ...mapGetters([
      'isProvinsiUser',
      'isDinasPendidikanUser',
      'isKemenagUser',
      'isReadonlyUser',
      'loading',
    ]),
  },
  mounted() {},
  methods: {
    pickSekolah(value) {
      this.$emit('changeSekolahId', value.id)
      this.searchSekolah = value.nama
      this.searchSekolahId = value.id
      this.isActiveSekolahDropdown = false
    },
    async submitInsert(reset) {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        this.$emit('submitInsert')
        reset()
      }
    },
    deactivateDropdown() {
      setTimeout(() => {
        this.isActiveSekolahDropdown = false
      }, 500)
    },
  },
}
</script>

<style></style>
