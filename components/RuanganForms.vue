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
          <label class="label">Nama Ruangan</label>
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
      <div class="column is-3 field">
        <label class="label">Nama Sekolah</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select :value="sekolahId">
              <option :value="sekolahId">
                {{ sekolahName }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <ValidationProvider
        rules="required"
        name="kondisi"
        tag="div"
        class="column"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Kondisi</label>
          <div class="control">
            <div class="select" :class="{ 'is-danger': errors[0] }">
              <select
                v-model="form.kondisi"
                @change="$emit('changeKondisi', $event.target.value)"
              >
                <option value="" disabled selected>Pilih Kondisi</option>
                <option value="tidak-layak">Tidak Layak</option>
                <option value="layak">Layak</option>
                <option value="sangat-baik">Sangat Baik</option>
              </select>
            </div>
          </div>
        </div>
      </ValidationProvider>
    </div>

    <div class="columns is-multiline">
      <div
        v-for="index in daftarFotoUrl.length + 1"
        :key="index + '_img_card'"
        class="column is-2 is-half-mobile"
      >
        <ImageCardVue
          :foto="daftarFotoUrl[index - 1]"
          @editImage="editImage($event)"
        />
      </div>
    </div>

    <div class="columns">
      <div  v-if="isSubmit" class="column is-2">
        <div class="field">
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
      </div>

      <template v-else>
        <div class="column is-2">
          <div class="control">
            <button
              :disabled="invalid || isReadonlyUser"
              :class="{ 'is-loading': loading }"
              class="button is-primary"
              @click.prevent="validate() && $emit('submitEdit')"
            >
              Save
            </button>
          </div>
        </div>
        <div class="column is-2">
          <div class="control">
            <button
              :disabled="isReadonlyUser"
              :class="{ 'is-loading': loading }"
              class="button is-danger"
              @click.prevent="deleteRuangan"
            >
              Delete
            </button>
          </div>
        </div>
      </template>
    </div>
    <div class="is-hidden">
      <input ref="uploadImage" type="file" @change="previewFile" />
    </div>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import ImageCardVue from './ImageCard.vue'
import { catchAndToastError } from '@/utils/common'

export default {
  name: 'RuanganForms',
  components: {
    ValidationObserver,
    ValidationProvider,
    ImageCardVue,
  },
  props: {
    nama: { type: String, default: '' },
    jenis: { type: String, default: '' },
    kondisi: { type: String, default: '' },
    sekolahId: { type: String, default: '' },
    sekolahName: { type: String, default: '' },
    daftarFotoUrl: { type: Array, default: Array },
    isSubmit: { type: Boolean, default: true },
  },
  data() {
    return {
      form: {
        nama: this.nama,
        kondisi: this.kondisi,
        // jenis,
        // daftarFotoUrl,
      },
      isHover: false,
    }
  },
  computed: {
    ...mapGetters(['loading', 'isReadonlyUser']),
  },
  methods: {
    toggleHover(value) {
      this.isHover = value
    },
    editImage(imageUrl) {
      if (!imageUrl) {
        // popup select file
        this.$refs.uploadImage.click()
      } else {
        this.$toast.error('Anda yakin mau menghapus foto ini ?', {
          action: [
            {
              text: 'Tidak',
              onClick: (_e, toastObject) => {
                toastObject.goAway(0)
              },
            },
            {
              text: 'Ya',
              onClick: (_e, toastObject) => {
                this.$emit('removeFoto', imageUrl)
                toastObject.goAway(0)
              },
            },
          ],
        })
      }
    },
    previewFile(e) {
      // upload file
      const file = e.target.files[0]
      const folder = '/ruangan'

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'POST',
          url: '/api/sarana/upload-image',
          headers: { 'Content-Type': 'multipart/form-data' },
          data: formData,
        })
        .then((res) => {
          // eslint-disable-next-line vue/no-mutating-props
          this.daftarFotoUrl.push(res.fileURL)
          this.$store.commit('finishLoading')
        })
        .catch(catchAndToastError(this))
    },
    async submitInsert(reset) {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        this.$emit('submitInsert')
        reset()
      }
    },
    deleteRuangan() {
      this.$toast.error(
        'Anda yakin mau menghapus ruangan ini dan inventorinya ?',
        {
          action: [
            {
              text: 'Tidak',
              onClick: (_e, toastObject) => {
                toastObject.goAway(0)
              },
            },
            {
              text: 'Ya',
              onClick: (_e, toastObject) => {
                this.$emit('deleteRuangan')
                toastObject.goAway(0)
              },
            },
          ],
        }
      )
    },
  },
}
</script>

<style></style>
