<template>
  <div class="filter">
    <label>{{ name }}</label>
    <el-select
      v-if="type === 'choice'"
      v-model="value"
      :placeholder="name"
      clearable
    >
      <el-option
        v-for="option in options"
        :key="option.slug"
        :label="option.name"
        :value="option.slug"
      />
    </el-select>
    <el-select
      v-if="type === 'multi_choice'"
      v-model="value"
      :placeholder="name"
      multiple
      collapse-tags
      clearable
    >
      <el-option
        v-for="option in options"
        :key="option.slug"
        :label="option.name"
        :value="option.slug"
      />
    </el-select>
    <el-checkbox
      v-if="type === 'boolean'"
      v-model="value"
    />
  </div>
</template>

<script>
export default {
  name: 'AttributeFilter',
  props: {
    type: {
      type: String,
      default () {
        return 'string'
      }
    },
    name: {
      type: String,
      default () {
        return 'filter name'
      }
    },
    slug: {
      type: String,
      default () {
        return 'filter-slug'
      }
    },
    options: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data: () => ({
    value: ''
  }),
  watch: {
    value () {
      this.$emit('change', this.value)
    }
  }
}
</script>

<style scoped lang="scss">
  .filter {
    display: flex;
    flex-direction: column;
    margin: 4px 15px;
    justify-content: center;

    .el-checkbox {
      text-align: center;
    }
  }
</style>
