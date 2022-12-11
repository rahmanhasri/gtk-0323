<template>
  <div class="card tile is-child is-shadowless">
    <div
      style="border: 2px dotted rgb(0, 209, 178)"
      :style="{ 'background-color': isHover ? 'rgba(0, 209, 178, 0.1)' : '' }"
      class="card-content is-64x64"
      @mouseover="toggleHover(true)"
      @mouseleave="toggleHover(false)"
      @click="$emit('editImage', foto)"
    >
      <template v-if="foto">
        <figure class="is-flex is-align-items-center image">
          <img
            style="height: 100%; object-fit: cover"
            :src="foto"
          />
        </figure>
      </template>
      <div v-else class="level is-mobile">
        <div class="level-item has-widget-icon">
          <div class="is-widget-icon">
            <span class="icon has-text-primary is-large"
              ><i class="mdi mdi-image mdi-48px"></i
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageCard',
  props: {
    foto: { type: String, default: '' },
  },
  data() {
    return {
      isHover: false,
    }
  },
  methods: {
    toggleHover(value) {
      this.isHover = value
    },
  }
}
</script>

<style></style>
