<template>
  <div class="section">
    <table v-if="daftarGuru.length > 0" class="table is-fullwidth is-bordered is-striped is-hoverable">
      <thead>
        <tr>
          <th>No.</th>
          <th>Nama</th>
          <th>Nomor Unik Pendidik dan Tenaga Kependidikan</th>
          <th>Jabatan</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in paginatedListSiswa"
          :key="index"
          @click="$router.push('/guru/' + item.id)"
        >
          <td>{{ index + 1 + (page - 1) * limit }}</td>
          <td>{{ item.nama }}</td>
          <td>{{ item.nuptk }}</td>
          <td>{{ item.jabatan }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>
    <nav v-if="daftarGuru.length > 0" class="pagination" role="navigation" aria-label="pagination">
      <a
        class="pagination-previous"
        :class="{ 'is-disabled': page === 1 }"
        @click.prevent="$emit('turnPage', -1)"
        >Previous</a
      >
      <a
        class="pagination-next"
        :class="{ 'is-disabled': paginatedListGuru.length < limit }"
        @click.prevent="$emit('turnPage', 1)"
        >Next page</a
      >
    </nav>
    <p class="title is-4"><font-awesome-icon icon="circle-exclamation" /> Daftar Guru Kosong</p>
  </div>
</template>

<script>
export default {
  name: 'TableGuru',
  props: {
    daftarGuru: {
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
    paginatedListGuru() {
      return this.daftarGuru.slice(this.limit * (this.page - 1), this.limit * this.page)
    },
  }
}
</script>

<style></style>
