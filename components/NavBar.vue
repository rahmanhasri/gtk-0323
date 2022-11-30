<template>
  <nav class="navbar is-success mb-4">
    <div class="container is-fluid">
      <div class="navbar-brand">
        <a class="navbar-item brand-text" @click="$router.push('/')"> GTK Admin </a>
        <a
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': isActiveBurger }"
          aria-label="menu"
          aria-expanded="false"
          @click="clickBurger"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div
        id="nav-links"
        class="navbar-menu"
        :class="{ 'is-active': isActiveBurger }"
      >
        <div class="navbar-end" :class="{ 'is-hidden': !isActiveBurger }">
          <a class="navbar-item" @click="$router.push('/')"> Home </a>
          <div class="navbar-item has-dropdown">
            <a class="navbar-link" @click="navSekolah = !navSekolah"> Sekolah </a>
            <div class="navbar-dropdown" :class="{'is-hidden': !navSekolah }">
              <a class="navbar-item" @click="$router.push('/tambah-sekolah')">
                Tambah Sekolah
              </a>
              <a class="navbar-item" @click="$router.push('/daftar-sekolah')">
                Daftar Sekolah
              </a>
            </div>
          </div>
          <div class="navbar-item has-dropdown">
            <a class="navbar-link" @click="navGuru = !navGuru"> Guru </a>
            <div class="navbar-dropdown" :class="{'is-hidden': !navGuru }">
              <a class="navbar-item" @click="$router.push('/guru/tambah')">
                Tambah Guru
              </a>
              <a class="navbar-item" @click="$router.push('/guru/daftar')">
                Daftar Guru
              </a>
            </div>
          </div>
          <div class="navbar-item has-dropdown">
            <a class="navbar-link" @click="navMurid = !navMurid"> Siswa </a>
            <div class="navbar-dropdown" :class="{'is-hidden': !navMurid }">
              <a class="navbar-item" @click="$router.push('/siswa/tambah')">
                Tambah Siswa
              </a>
              <a class="navbar-item" @click="$router.push('/siswa/daftar')">
                Daftar Siswa
              </a>
            </div>
          </div>
          <a class="navbar-item" @click.prevent="logout"> Logout </a>
        </div>
        <div class="navbar-end" :class="{ 'is-hidden': isActiveBurger }">
          <a class="navbar-item is-hovered" @click="logout"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isActiveBurger: false,
      navSekolah: false,
      navGuru: false,
      navMurid: false,
    }
  },
  mounted() {
    if (process.client) {
      this.$store.commit(
        'userScope',
        this.$auth.$storage.getUniversal('scopeusr')
      )
    }
  },
  methods: {
    clickBurger() {
      this.isActiveBurger = !this.isActiveBurger
    },
    logout() {
      this.$auth.logout()
      this.$auth.$storage.removeUniversal('scopeusr')
    },
  },
}
</script>

<style></style>
