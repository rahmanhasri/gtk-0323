<template>
  <table class="table is-fullwidth is-bordered is-striped is-hoverable">
    <thead>
      <tr>
        <th style="width: 50px;">No.</th>
        <th style="width: 200px;">Nama</th>
        <th style="width: 150px;">Kode Inventaris</th>
        <th>Foto Inventaris</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in paginatedListInventaris" :key="index">
        <td @click="$emit('clickInventaris', item)">
          {{ index + 1 + (page - 1) * limit }}
        </td>
        <td @click="$emit('clickInventaris', item)">
          {{ item.nama }}
        </td>
        <td @click="$emit('clickInventaris', item)">
          {{ item.kode_inventaris }}
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
                  style="height: 100%; object-fit: cover"
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
  name: 'TableInventaris',
  props: {
    paginatedListInventaris: {
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
  }
}
</script>

<style>

</style>