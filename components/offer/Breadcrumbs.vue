<template>
  <div class="breadcrumbs">
    <div class="line">
      <p>
        <span v-for="(element, index) in pathElements" :key="element">
          {{ element }} <span v-if="index + 1 !== pathElements.length"> > </span>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  props: {
    pathElements: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style lang="scss">
.breadcrumbs {
  .line {
    background: #f5f5f5;

    p {
      margin: 0 6vw;
      padding: 10px 10px 10px 40px;
    }
  }
}
</style>
