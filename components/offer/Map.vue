<template>
  <div class="offer-map">
    <l-map v-if="location" :zoom="16" :center="location" class="map">
      <l-tile-layer :url="mapStyle" />
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
  },
  computed: {
    mapStyle () {
      return process.env.VUE_APP_MAP_STYLE
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
