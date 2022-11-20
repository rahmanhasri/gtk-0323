<template>
  <nav class="navbar is-success mb-4">
    <div class="container is-fluid">
      <div class="navbar-brand">
        <a class="navbar-item brand-text"> GTK Admin </a>
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
          <a class="navbar-item" href="admin.html"> Home </a>
          <a class="navbar-item" href="admin.html"> Orders </a>
          <a class="navbar-item" @click.prevent="logout"> Logout </a>
        </div>
        <div class="navbar-end" :class="{ 'is-hidden': isActiveBurger }">
          <a class="navbar-item is-hovered" @click="logout">
            Logout
          </a>
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
    }
  },
  mounted() {
    if (process.client) {
      this.$store.commit('userScope', this.$auth.$storage.getUniversal('scopeusr'))
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
