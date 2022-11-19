<template>
  <div></div>
</template>

<script>
export default {
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      isEdit: false,
      dataSekolah: {
        nama: '',
        kecamatan: '',
        desa: '',
        is_madrasah: false,
        tingkat: '',
        profil: '',
        is_negeri: false,
      },
      zoomMap: 13,
    }
  },
  mounted() {
    // console.log(this.$route.params.id)
    this.getDetailSekolah()
  },
  methods: {
    getDetailSekolah() {
      this.$store.commit('loading')
      this.$auth
        .requestWith('local', {
          method: 'GET',
          url: `/api/sekolah/${this.$route.params.id}`,
        })
        .then((res) => {
          this.$store.commit('finishLoading')
          this.sekolahData = res.data
          console.log(res)
        })
        .catch((err) => {
          this.$store.commit('finishLoading')
          // TODO: Handle error
          console.log('ERR', err)
        })
    }
  },
}
</script>

<style>
</style>