<template>
<div id="map-wrap" style="height: 100vh">
 <client-only>
   <l-map :zoom="11" :center="['-7.05', '113.25']">
     <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
     <l-marker :lat-lng="[-7.05, 113.25]"></l-marker>
   </l-map>
 </client-only>
</div>
</template>

<script>
export default {
  name: 'IndexPage',
  components: {
  },
  methods: {
    zoomUpdated (zoom) {
      this.zoom = zoom;
    },
    centerUpdated (center) {
      this.center = center;
    },
    boundsUpdated (bounds) {
      this.bounds = bounds;
    }
  }
}
</script>
