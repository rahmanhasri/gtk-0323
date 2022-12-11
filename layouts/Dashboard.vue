<template>
  <div style="{ height: '100%', background: 'none' }">
    <NavBar />
    <div class="container is-fluid mt-4 pt-6">
      <div class="columns">
        <div class="column is-2">
          <SideBar />
        </div>
        <div class="column is-10">
          <Nuxt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import SideBar from '@/components/SideBar'
export default {
  components: {
    NavBar,
    SideBar,
  },
}
</script>

<style></style>
