<template>
  <div class="breadcrumbs">
    <div class="line">
      <p>
        <template v-if="pathElements && pathElements.length">
          <span v-for="(element, index) in pathElements" :key="index">
            <template v-if="element && typeof element.name !== 'undefined'">
              <nuxt-link :to="'/szukaj?typ=' + element.link" > {{ element.name }} </nuxt-link><span v-if="index + 1 !== pathElements.length"> > </span>
            </template>
            <template v-else>
              {{ element }} <span v-if="index + 1 !== pathElements.length"> > </span>
            </template>
          </span>
        </template>
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
