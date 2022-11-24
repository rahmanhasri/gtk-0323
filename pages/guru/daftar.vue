<template>
  <TableGuruVue
    :daftar-guru="daftarGuru"
    :page="page"
    :limit="20"
    @turnPage="turnPage($event, 'Guru')"
  />
</template>

<script>
import TableGuruVue from '@/components/TableGuru.vue'

export default {
  name: 'DaftarGuru',
  components: {
    TableGuruVue,
  },
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      daftarGuru: [],
      page: 1,
    }
  },
  methods: {
    getListGuru() {
      this.$store.commit('loading')
      const params = {}
      if (this.search) {
        params.nama = this.search
      }
      if (this.nuptk) {
        params.nuptk = this.nuptk
      }
      if (this.sekolahId) {
        params.sekolah_id = this.sekolahId
      }
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: '/api/tenaga-guru',
          params: {
            ...params,
            page: this.page,
            limit: this.limit,
          },
        })
        .then((res) => {
          this.$store.commit('finishLoading')
          if (this.newFilter) {
            this.newFilter = false
            this.page = 1
            this.daftarGuru = res
            return
          }
          if (!res.length && this.page !== 1) {
            this.page--
            return
          }
          this.daftarGuru = this.daftarGuru.concat(res)
        })
        .catch((err) => {
          this.$store.commit('finishLoading')
          // TODO: Handle error
          console.log('ERR', err)
        })
    }
  }
}
</script>

<style>

</style>