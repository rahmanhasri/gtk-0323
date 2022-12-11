<template>
  <aside id="sidebar" class="is-hidden-mobile">
    <div class="menu">
      <ul class="menu-list">
        <li>
          <NuxtLink :class="{ 'is-active': isActiveBeranda }" to="/">
            Beranda
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :class="{ 'is-active': isActiveSekolah }"
            to="/daftar-sekolah"
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
            <li v-if="!isReadonlyUser">
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
          <NuxtLink :class="{ 'is-active': isActiveGuru }" to="/guru/daftar"
            >Tenaga Kependidikan Dan Guru
          </NuxtLink>
          <ul :class="{ 'is-hidden': !isActiveGuru }">
            <li>
              <NuxtLink
                to="/guru/daftar"
                :class="{ 'is-disabled': $route.name === 'guru-daftar' }"
              >
                Daftar Guru
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/tenaga-pendidik/daftar"
                :class="{
                  'is-disabled': $route.name === 'tenaga-pendidik-daftar',
                }"
              >
                Daftar Tenaga Pendidik
              </NuxtLink>
            </li>
            <li v-if="!isReadonlyUser">
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
          <NuxtLink to="/siswa/daftar" :class="{ 'is-active': isActiveMurid }">
            Siswa
          </NuxtLink>
          <ul :class="{ 'is-hidden': !isActiveMurid }">
            <li>
              <NuxtLink
                to="/siswa/daftar"
                :class="{ 'is-disabled': $route.name === 'siswa-daftar' }"
              >
                Daftar
              </NuxtLink>
            </li>
            <li v-if="!isReadonlyUser">
              <NuxtLink
                to="/siswa/tambah"
                :class="{ 'is-disabled': $route.name === 'siswa-tambah' }"
              >
                Tambah
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
import { mapGetters } from 'vuex'

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
      return (
        this.$route.name.includes('sekolah') ||
        this.$route.name.includes('ruangan')
      )
    },
    isActiveGuru() {
      return (
        this.$route.name.includes('guru') ||
        this.$route.name.includes('tenaga-pendidik')
      )
    },
    isActiveMurid() {
      return this.$route.name.includes('siswa')
    },
    ...mapGetters(['isReadonlyUser']),
  },
}
</script>

<style>
</style>
