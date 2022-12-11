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
          <label class="label">Nama Siswa</label>
          <div class="control">
            <input
              v-model="form.nama"
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Nama"
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
        rules="required|min:4"
        name="noIndukSekolah"
        tag="div"
        class="column is-3"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Nomor Induk Sekolah</label>
          <div class="control">
            <input
              v-model="form.nomorIndukSekolah"
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Nomor Induk Sekolah"
              :readonly="viewOnly"
              @change="$emit('changeNomorIndukSekolah', $event.target.value)"
            />
          </div>
        </div>
      </ValidationProvider>

      <div class="column is-3">
        <div class="field">
          <label class="label">Nomor Induk Nasional</label>
          <div class="control">
            <input
              v-model="form.nomorIndukNasional"
              class="input"
              type="text"
              placeholder="Nomor Induk Nasional"
              :readonly="viewOnly"
              @change="$emit('changeNomorIndukNasional', $event.target.value)"
            />
          </div>
        </div>
      </div>
    </div>

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
        name="tanggalLahir"
        tag="div"
        class="column is-2"
      >
        <div class="control">
          <label class="label">Tanggal Lahir</label>
          <input
            v-model="form.tanggalLahir"
            class="input"
            type="date"
            :readonly="viewOnly"
            @change="$emit('changeTanggalLahir', $event.target.value)"
          />
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
      <div class="column is-4 field">
        <div class="field">
          <label class="label">Kelas</label>
          <div class="control">
            <input
              v-model="form.kelas"
              class="input"
              type="text"
              placeholder="Kelas"
              :readonly="viewOnly"
              @change="$emit('changeKelas', $event.target.value)"
            />
          </div>
        </div>
      </div>
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
              placeholder="Alamat Siswa"
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
        class="column is-5"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">No Telepon</label>
          <div class="control">
            <input
              v-model="form.noPonsel"
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Nomor Telepon Wali / Orang Tua / Siswa"
              :readonly="viewOnly"
              @change="$emit('changeNoPonsel', $event.target.value)"
            />
          </div>
        </div>
      </ValidationProvider>
    </div>

    <div class="columns">
      <div class="column is-4 field">
        <div class="field">
          <label class="label">Tahun Angkatan</label>
          <div class="control">
            <input
              v-model="form.tahunAngkatan"
              class="input"
              type="number"
              placeholder="Tahun Angkatan"
              :readonly="viewOnly"
              @change="$emit('changeTahunAngkatan', $event.target.value)"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isSubmit" class="columns">
      <div class="column">
        <div class="field">
          <label class="label">Status</label>
          <input
            id="switchNormal"
            type="checkbox"
            name="switchNormal"
            class="switch"
            :checked="isActive ? '1' : ''"
            :disabled="viewOnly"
            @change="$emit('changeIsActive', !isActive)"
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
              :disabled="(invalid || isReadonlyUser || viewOnly)"
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

export default {
  name: 'SiswaForms',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    nama: { type: String, default: '' },
    nomorIndukNasional: { type: String, default: '' },
    nomorIndukSekolah: { type: String, default: '' },
    kelas: { type: String, default: '' },
    alamat: { type: String, default: '' },
    noPonsel: { type: String, default: '' },
    tahunAngkatan: { type: Number, default: 2022 },
    jenisKelamin: { type: String, default: '' },
    tanggalLahir: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    sekolahName: { type: String, default: '' },
    isSubmit: { type: Boolean, default: true },
    editable: { type: Boolean, default: false },
    viewOnly: { type: Boolean, default: false },
    daftarSekolah: { type: Array, default: Array },
  },
  data() {
    return {
      isActiveSekolahDropdown: false,
      searchSekolah: this.sekolahName || '',
      searchSekolahId: '',
      form: {
        nama: this.nama,
        nomorIndukNasional: this.nomorIndukNasional,
        nomorIndukSekolah: this.nomorIndukSekolah,
        kelas: this.kelas,
        alamat: this.alamat,
        noPonsel: this.noPonsel,
        tahunAngkatan: this.tahunAngkatan,
        jenisKelamin: this.jenisKelamin,
        tanggalLahir: this.tanggalLahir,
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
  watch: {
    sekolahName(value) {
      this.searchSekolah = value
    },
  },
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
