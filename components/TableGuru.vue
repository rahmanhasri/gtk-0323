<template>
  <table class="table is-fullwidth is-bordered is-striped is-hoverable">
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
      <tr v-for="(item, index) in paginatedListGuru" :key="index">
        <td @click="$router.push('/guru/' + item.id)">
          {{ index + 1 + (page - 1) * limit }}
        </td>
        <td @click="$router.push('/guru/' + item.id)">{{ item.nama }}</td>
        <td @click="$router.push('/guru/' + item.id)">{{ item.nuptk }}</td>
        <td @click="$router.push('/sekolah/' + item?.sekolah?.id)">
          <a @click.prevent>{{ item.sekolah?.nama }}</a>
        </td>
        <td @click="$router.push('/guru/' + item.id)">{{ item.jabatan }}</td>
        <td @click="$router.push('/guru/' + item.id)">{{ item.status }}</td>
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
  computed: {},
}
</script>

<style></style>
