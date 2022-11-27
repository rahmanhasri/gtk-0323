<template>
    <table
      class="table is-fullwidth is-bordered is-striped is-hoverable"
    >
      <thead>
        <tr>
          <th>No.</th>
          <th>Nama</th>
          <th>NUPTK</th>
          <th>Nama Sekolah</th>
          <th>Jabatan</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in paginatedListGuru"
          :key="index"
          @click="$router.push('/guru/' + item.id)"
        >
          <td>{{ index + 1 + (page - 1) * limit }}</td>
          <td>{{ item.nama }}</td>
          <td>{{ item.nuptk }}</td>
          <td>{{ item.sekolah?.nama }}</td>
          <td>{{ item.jabatan }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>
</template>

<script>
export default {
  name: 'TableGuru',
  props: {
    paginatedListGuru: {
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
  computed: {
  },
}
</script>

<style></style>
