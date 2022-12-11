<template>
  <nav class="pagination" role="navigation" aria-label="pagination">
    <a
      class="pagination-previous"
      :class="{ 'is-disabled': page === 1 }"
      @click.prevent="$emit('turnPage', -1)"
      >Previous</a
    >
    <a
      class="pagination-next"
      :class="{ 'is-disabled': length < limit }"
      @click.prevent="$emit('turnPage', 1)"
      >Next page</a
    >
  </nav>
</template>

<script>
export default {
  name: 'TablePagination',
  props: {
    length: {
      type: Number,
      default: 0,
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
}
</script>

<style></style>
