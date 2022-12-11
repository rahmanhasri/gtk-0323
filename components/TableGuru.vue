<template>
  <table class="table is-fullwidth is-bordered is-striped is-hoverable">
    <thead>
      <tr>
        <th>No.</th>
        <th>Nama</th>
        <th v-if="isGuru">Jenjang</th>
        <th>Jabatan</th>
        <th>Status</th>
        <th>Nama Sekolah</th>
        <th>Status Aktif</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in paginatedListGuru" :key="index">
        <td @click="$router.push('/guru/' + item.id)">
          {{ index + 1 + (page - 1) * limit }}
        </td>
        <td @click="$router.push(getUrlDetail(item.id))">{{ item.nama }}</td>
        <td v-if="isGuru" @click="$router.push(getUrlDetail(item.id))">{{ getTitle(item.jenjang) }}</td>
        <td @click="$router.push(getUrlDetail(item.id))">{{ item.jabatan }}</td>
        <td @click="$router.push(getUrlDetail(item.id))">{{ item.status }}</td>
        <td @click="$router.push('/sekolah/' + item?.sekolah?.id)">
          <a @click.prevent>{{ item.sekolah?.nama }}</a>
        </td>
        <td @click="$router.push(getUrlDetail(item.id))">{{ item.is_active ? 'Aktif' : 'Tidak Aktif' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import titleize from 'titleize';

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
    isGuru: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {}
  },
  methods: {
    getUrlDetail(id) {
      return this.isGuru ? `/guru/${id}` : `/tenaga-pendidik/${id}`
    },
    getTitle(str) {
      return titleize(str)
    }
  }
}
</script>

<style></style>
