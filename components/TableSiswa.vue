<template>
  <div class="section">
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
    <nav class="pagination" role="navigation" aria-label="pagination">
      <a
        class="pagination-previous"
        :class="{ 'is-disabled': page === 1 }"
        @click.prevent="$emit('turnPage', -1)"
        >Previous</a
      >
      <a
        class="pagination-next"
        :class="{ 'is-disabled': paginatedListSiswa.length < limit }"
        @click.prevent="$emit('turnPage', 1)"
        >Next page</a
      >
    </nav>
  </div>
</template>

<script>
export default {
  name: 'TableSiswa',
  props: {
    daftarSiswa: {
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
    return {
      
    }
  },
  computed: {
    paginatedListSiswa() {
      return this.daftarSiswa.slice(this.limit * (this.page - 1), this.limit * this.page)
    },
  }
}
</script>

<style></style>
