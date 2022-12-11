<template>
  <nav class="navbar is-success is-fixed-top">
    <div class="container is-fluid">
      <div class="navbar-brand">
        <figure class="image is-48x48" style="margin: auto; margin-top: 10px;">
          <img src="@/assets/Sampang.png"  />
        </figure>
        <NuxtLink to="/" class="navbar-item brand-text has-text-weight-bold	">SISWA PENTER</NuxtLink>
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
          <a class="navbar-item" @click.prevent="clickBurger() || $router.push('/')"> Home </a>
          <div class="navbar-item has-dropdown">
            <a class="navbar-link" @click.prevent="navSekolah = !navSekolah"> Sekolah </a>
            <div class="navbar-dropdown" :class="{'is-hidden': !navSekolah }">
              <a class="navbar-item" @click.prevent="clickBurger() || $router.push('/tambah-sekolah')">
                Tambah Sekolah
              </a>
              <a class="navbar-item" @click.prevent="clickBurger() || $router.push('/daftar-sekolah')">
                Daftar Sekolah
              </a>
            </div>
          </div>
          <div class="navbar-item has-dropdown">
            <a class="navbar-link" @click.prevent="navGuru = !navGuru"> Guru </a>
            <div class="navbar-dropdown" :class="{'is-hidden': !navGuru }">
              <a class="navbar-item" @click.prevent="clickBurger() || $router.push('/guru/daftar')">
                Daftar Guru
              </a>
              <a class="navbar-item" @click.prevent="clickBurger() || $router.push('/tenaga-pendidik/daftar')">
                Daftar Tenaga Pendidik
              </a>
              <a class="navbar-item" @click.prevent="clickBurger() || $router.push('/guru/tambah')">
                Tambah
              </a>
            </div>
          </div>
          <div class="navbar-item has-dropdown">
            <a class="navbar-link" @click="navMurid = !navMurid"> Siswa </a>
            <div class="navbar-dropdown" :class="{'is-hidden': !navMurid }">
              <a class="navbar-item" @click.prevent="clickBurger() || $router.push('/siswa/tambah')">
                Tambah Siswa
              </a>
              <a class="navbar-item" @click.prevent="clickBurger() || $router.push('/siswa/daftar')">
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
      this.$router.replace('/login')
      this.$auth.$storage.removeUniversal('scopeusr')
    },
  },
}
</script>

<style></style>
