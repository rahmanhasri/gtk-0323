<template>
  <div class="container"></div>
</template>

<script>
export default {
  layout: 'Dashboard',
  middleware: 'auth',
  data() {
    return {
      search: '',
    }
  }
}
</script>

<style>

</style>