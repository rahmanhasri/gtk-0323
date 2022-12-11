<template>
  <table class="table is-fullwidth is-bordered is-striped is-hoverable">
    <thead>
      <tr>
        <th>No.</th>
        <th>Nama</th>
        <th>Nomor Induk Nasional</th>
        <th>Jenis Kelamin</th>
        <th>Tahun Angkatan</th>
        <th>Nama Sekolah</th>
        <th>Status Aktif</th>
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
        <td>{{ item.jenis_kelamin }}</td>
        <td>{{ item.tahun_angkatan }}</td>
        <td @click="$router.push('/sekolah/' + item?.sekolah?.id)">
          <a @click.prevent>{{ item.sekolah?.nama }}</a>
        </td>
        <td>{{ item.is_active ? 'Aktif' : 'Tidak Aktif' }}</td>
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
    },
  },
  data() {
    return {}
  },
}
</script>

<style></style>
