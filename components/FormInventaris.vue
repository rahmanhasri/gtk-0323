<template>
  <ValidationObserver
    ref="observer"
    v-slot="{ validate, invalid, reset }"
    tag="form"
  >
    <div class="columns">
      <ValidationProvider
        rules="required"
        name="nama"
        tag="div"
        class="column is-8"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Nama Inventori</label>
          <div class="control">
            <input
              v-model="nama"
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Nama"
            />
          </div>
        </div>
      </ValidationProvider>
    </div>

    <div class="columns">
      <ValidationProvider
        rules="required"
        name="nama"
        tag="div"
        class="column is-8"
      >
        <div slot-scope="{ errors }" class="field">
          <label class="label">Kode Inventori</label>
          <div class="control">
            <input
              v-model="kodeInventaris"
              :class="{ 'is-danger': errors[0] }"
              class="input"
              type="text"
              placeholder="Kode inventori"
            />
          </div>
        </div>
      </ValidationProvider>
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
              <select v-model="kondisi">
                <option value="" disabled selected>Pilih Kondisi</option>
                <option value="bagus">Bagus</option>
                <option value="cukup">Cukup</option>
                <option value="kurang">Kurang</option>
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
        class="column is-4"
      >
        <ImageCardVue
          :foto="daftarFotoUrl[index - 1]"
          @editImage="editImage($event)"
        />
      </div>
    </div>

    <div class="columns">
      <div class="column is-3">
        <button
          class="button is-success"
          :disabled="invalid || isReadonlyUser"
          :class="{ 'is-loading': loading }"
          @click.prevent="validate() && submitInventaris()"
        >
          Save Changes
        </button>
      </div>
      <div class="column is-2">
        <button
          class="button"
          :class="{ 'is-loading': loading }"
          @click.prevent="exitForm(reset)"
        >
          Cancel
        </button>
      </div>
      <div class="column is-offset-4 is-3">
        <button
          :disabled="isReadonlyUser"
          class="button is-danger"
          :class="{ 'is-loading': loading }"
          @click.prevent="deleteInventaris"
        >
          Delete
        </button>
      </div>
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
  name: 'InventarisForms',
  components: {
    ValidationObserver,
    ValidationProvider,
    ImageCardVue,
  },
  props: {
    initNama: { type: String, default: '' },
    initKodeInventaris: { type: String, default: '' },
    initKondisi: { type: String, default: '' },
    daftarFotoUrl: { type: Array, default: Array },
  },
  data() {
    return {
      nama: this.initNama,
      kodeInventaris: this.initKodeInventaris,
      kondisi: this.initKondisi,
    }
  },
  computed: {
    ...mapGetters(['loading', 'isReadonlyUser']),
  },
  methods: {
    exitForm(reset) {
      reset()
      this.$emit('closeModal')
    },
    previewFile(e) {
      // upload file
      const file = e.target.files[0]
      const folder = '/inventori'

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      this.$store.commit('loading')
      // this.$emit('addFoto', "https://sampang-bucket.s3.ap-southeast-1.amazonaws.com/media/ruangan/logo-1670436124156.png")
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
                this.$emit('removeFotoInventaris', imageUrl)
                // this.daftarFotoUrl = this.daftarFotoUrl.filter(foto => foto !== imageUrl)
                toastObject.goAway(0)
              },
            },
          ],
        })
      }
    },
    submitInventaris() {
      this.$emit('submitInventaris', {
        nama: this.nama,
        kondisi: this.kondisi,
        kodeInventaris: this.kodeInventaris,
      })
    },
    deleteInventaris() {
      this.$toast.error('Anda yakin ?', {
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
              this.$emit('deleteInventaris')
              toastObject.goAway(0)
            },
          },
        ],
      })
    },
  },
}
</script>

<style></style>
