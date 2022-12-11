<template>
  <table class="table is-fullwidth is-bordered is-striped is-hoverable">
    <thead>
      <tr>
        <th style="width: 50px;">No.</th>
        <th style="width: 200px;">Nama</th>
        <th style="width: 150px;">Kondisi</th>
        <th>Foto Ruangan</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in paginatedListRuangan" :key="index">
        <td @click="$router.push('/ruangan/' + item.id)">
          {{ index + 1 + (page - 1) * limit }}
        </td>
        <td @click="$router.push('/ruangan/' + item.id)">
          {{ item.nama }}
        </td>
        <td @click="$router.push('/ruangan/' + item.id)">
          {{ item.kondisi }}
        </td>
        <td>
          <div class="columns is-multiline" style="height: 192px; overflow: auto;">
            <div
              v-for="(foto, indexFoto) in item.daftar_foto_url"
              :key="'foto_' + indexFoto"
              class="column is-one-third-desktop is-one-mobile"
            >
              <figure class="is-flex is-align-items-center image is-128x128">
                <img
                  style="height: 100%; object-fit: cover;"
                  :src="foto"
                  @click="$emit('previewImage', foto)"
                />
              </figure>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'TableGuru',
  props: {
    paginatedListRuangan: {
      type: Array,
      default: Array,
    },
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style></style>
