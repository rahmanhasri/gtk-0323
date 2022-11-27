<template>
  <aside class="menu is-hidden-mobile">
    <ul class="menu-list">
      <li>
        <NuxtLink :class="{ 'is-active': isActiveBeranda }" to="/">
          Beranda
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :class="{ 'is-active': isActiveSekolah }" to="/daftar-sekolah"
          >Sekolah
        </NuxtLink>
        <ul :class="{ 'is-hidden': !isActiveSekolah }">
          <li>
            <NuxtLink
              to="/daftar-sekolah"
              :class="{ 'is-disabled': $route.name === 'daftar-sekolah' }"
            >
              Daftar Sekolah
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/tambah-sekolah"
              :class="{ 'is-disabled': $route.name === 'tambah-sekolah' }"
            >
              Tambah Sekolah
            </NuxtLink>
          </li>
        </ul>
      </li>
      <li>
        <NuxtLink
          :class="{ 'is-active': isActiveGuru }"
          to="/guru/daftar"
          >Tenaga Kependidikan Dan Guru
        </NuxtLink>
        <ul :class="{ 'is-hidden': !isActiveGuru }">
          <li>
            <NuxtLink
              to="/guru/daftar"
              :class="{ 'is-disabled': $route.name === 'guru-daftar' }"
            >
              Daftar
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/guru/tambah"
              :class="{ 'is-disabled': $route.name === 'guru-tambah' }"
            >
              Tambah
            </NuxtLink>
          </li>
        </ul>
      </li>
      <li>
        <a
          :class="{ 'is-active': isActiveMurid }"
          to="/siswa/daftar">
          Siswa
        </a>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      menu: 'beranda',
    }
  },
  computed: {
    isActiveBeranda() {
      return this.$route.name === ''
    },
    isActiveSekolah() {
      return this.$route.name.includes('sekolah')
    },
    isActiveGuru() {
      return this.$route.name.includes('guru')
    },
    isActiveMurid() {
      return this.$route.name.includes('murid')
    },
  },
}
</script>

<style></style>
