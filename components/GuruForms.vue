<template>
  <ValidationObserver ref="observer" v-slot="{ validate, invalid, reset }" tag="form">
    <div class="columns">
      <ValidationProvider
        rules="required|min:5"
        name="nama"
        tag="div"
        class="column is-8"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Nama Tenaga Pendidik / Guru</label>
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
              @change="$emit('changeNoKtp', $event.target.value)"
            />
          </div>
        </div>
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider
        rules="required|min:5"
        name="nuptk"
        tag="div"
        class="column is-3"
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
              placeholder="Alamat Guru"
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
              @change="$emit('changeNoPonsel', $event.target.value)"
            />
          </div>
        </div>
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider
        rules="required|min:5"
        name="ptk"
        tag="div"
        class="column is-4"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Mata Pelajaran</label>
          <div class="control">
            <input
              v-model="form.ptk"
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Mata Pelajaran"
              @change="$emit('changePtk', $event.target.value)"
            />
          </div>
        </div>
      </ValidationProvider>
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
        class="column is-5"
      >
        <div slot-scope="{ errors }" class="dropdown" :class="{ 'is-active': isActiveSekolahDropdown }">
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
                  @focusin="isActiveSekolahDropdown = true"
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
      <ValidationProvider
        rules="required|min:5"
        name="ptk"
        tag="div"
        class="column is-4"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Jabatan</label>
          <div class="control">
            <input
              v-model="form.jabatan"
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Jabatan"
              @change="$emit('changeJabatan', $event.target.value)"
            />
          </div>
        </div>
      </ValidationProvider>
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
                @change="$emit('changeStatus', $event.target.value)"
              >
                <option value="" disabled selected>Pilih Status</option>
                <option value="PNS">PNS</option>
                <option value="SWASTA">Swasta</option>
                <option value="HONORER">Honorer</option>
              </select>
            </div>
          </div>
        </div>
      </ValidationProvider>
    </div>

    <div class="columns">
      <div class="column">
        <div v-if="isSubmit" class="field">
          <div class="control">
            <button
              :class="{ 'is-loading': loading }"
              class="button is-primary"
              :disabled="invalid"
              @click="validate().then(() => submitInsert(reset))"
            >
              Submit
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
// const guruReqDto = [
//   'tanggal_lahir', // TODO:
//   'latar_belakang', // TODO:
// ]
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
    sekolahName: { type: String, default: '' },
    isSubmit: { type: Boolean, default: true },
    daftarSekolah: { type: Array, default: Array },
  },
  data() {
    return {
      isActiveSekolahDropdown: false,
      searchSekolah: this.sekolahName || '',
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
      },
    }
  },
  computed: {
    limitedDaftarSekolah() {
      return this.daftarSekolah
        .filter(
          sekolah => sekolah
            .nama
            .toLowerCase()
            .includes(this.searchSekolah.toLowerCase())
        )
        .slice(0, 8)
    },
    ...mapGetters([
      'isProvinsiUser',
      'isDinasPendidikanUser',
      'isKemenagUser',
      'loading',
    ]),
  },
  mounted() { },
  methods: {
    pickSekolah(value) {
      // this.sekolahId = value
      this.$emit('changeSekolahId', value.id)
      this.searchSekolah = value.nama
      this.isActiveSekolahDropdown = false
    },
    submitInsert(reset) {
      this.$emit('submitInsert')
      reset()
    }
  },
}
</script>

<style></style>
