<template>
  <div class="offer-map">
    <l-map v-if="location" :zoom="16" :center="location" class="map">
      <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
      <l-marker :lat-lng="location" />
    </l-map>
  </div>
</template>

<script>
export default {
  name: 'Map',
  props: {
    location: {
      type: Array,
      default () {
        return [0, 0]
      }
    }
  }
}
</script>

<style lang="scss">
.map {
  height: 100%;
  width: 100%;
}
</style>
