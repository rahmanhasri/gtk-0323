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
// import 'leaflet/dist/leaflet.css'
// import { LMap } from 'vue2-leaflet-nuxt';

export default {
  name: 'IndexPage',
  components: {
    // LMap,
  },
  // mounted() {
  //   const map = L.map("map-wrap", {
  //     attributionControl: false,
  //     zoomControl: false
  //   }).setView(L.latLng(-37.79, 175.27), 12);
  //   L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  //     detectRetina: true,
  //     maxNativeZoom: 17
  //   }).addTo(map);

  //   const pruneCluster = new this.PruneClusterForLeaflet();
  //   const marker = new this.PruneCluster.Marker(59.8717, 11.1909);
  //   pruneCluster.RegisterMarker(marker);
  //   map.addLayer(pruneCluster);
  // },
  // data () {
  //   return {
  //     url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  //     attribution:
  //       '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  //     zoom: 3,
  //     center: [-7.5782556	, 109.2058436],
  //     bounds: null
  //   };
  // },
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
