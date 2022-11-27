<template>
    <table class="table is-fullwidth is-bordered is-striped is-hoverable">
      <thead>
        <tr>
          <th>No.</th>
          <th>Nama</th>
          <th>Nomor Induk Nasional</th>
          <th>Tingkat</th>
          <th>Jenis Kelamin</th>
          <th>Tahun Angkatan</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in paginatedListSiswa"
          :key="index"
          @click="$router.push('/siswa/' + item.id)"
        >
          <td>{{ index + 1 + (page - 1) * limit }}</td>
          <td>{{ item.nama }}</td>
          <td>{{ item.nomor_induk_nasional }}</td>
          <td>{{ item.tingkat }}</td>
          <td>{{ item.jenis_kelamin }}</td>
          <td>{{ item.tahun_angkatan }}</td>
        </tr>
      </tbody>
    </table>
</template>

<script>
export default {
  name: 'TableSiswa',
  props: {
    paginatedListSiswa: {
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
    }
  },
  data() {
    return {}
  },
}
</script>

<style></style>
