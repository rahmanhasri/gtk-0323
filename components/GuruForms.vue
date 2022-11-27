<template>
  <ValidationObserver
    ref="observer"
    v-slot="{ validate, invalid }"
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
          <label class="label">Nama Tenaga Pendidik / Guru</label>
          <div class="control">
            <input
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Nama"
              :value="nama"
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
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="No KTP"
              :value="noKtp"
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
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Nomor Unik Pendidik dan Tenaga Kependidikan"
              :value="nuptk"
              @change="$emit('changeNuptk', $event.target.value)"
            />
          </div>
        </div>
      </ValidationProvider>
    </div>


    <div class="columns">
      <ValidationProvider
        rules="required|min:5"
        name="alamat"
        tag="div"
        class="column is-8"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Alamat</label>
          <div class="control">
            <input
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Alamat Guru"
              :value="alamat"
              @change="$emit('changeAlamatGuru', $event.target.value)"
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
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="No Ponsel"
              :value="noPonsel"
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
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Mata Pelajaran"
              :value="ptk"
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
        <div slot-scope="{ }" class="field">
          <label class="label">Jenis Kelamin</label>
          <div class="control">
            <div class="select" :class="{ 'is-danger': errors[0] }">
              <select
                :value="jenisKelamin"
                @change="$emit('changeJenisKelamin', $event.target.value)"
              >
                <option value="" disabled selected>
                  Pilih Jenis
                </option>
                <option value="LAKI-LAKI">Laki-laki</option>
                <option value="PEREMPUAN">Perempuan</option>
              </select>
            </div>
          </div>
        </div>
      </ValidationProvider>
    </div>

    <!-- TODO: DROPDOWN SEKOLAH -->

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
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Jabatan"
              :value="jabatan"
              @change="$emit('changeJabatan', $event.target.value)"
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
          <label class="label">Status </label>
          <div class="control">
            <div class="select" :class="{ 'is-danger': errors[0] }">
              <select
                :value="status"
                @change="$emit('changeStatus', $event.target.value)"
              >
                <option value="" disabled selected>
                  Pilih Status
                </option>
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
              @click="validate().then(() => $emit('submitInsert'))"
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
//   'id',
//   'nama',
//   'no_ktp',
//   'nuptk',
//   'alamat',
//   'no_ponsel',
//   'ptk',
//   'jenis_kelamin',
//   'tanggal_lahir', // TODO:
//   'sekolah_id',
//   'latar_belakang', // TODO:
//   'jabatan',
//   'status',
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
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'isProvinsiUser',
      'isDinasPendidikanUser',
      'isKemenagUser',
      'loading',
    ]),
  }
}
</script>

<style>

</style>