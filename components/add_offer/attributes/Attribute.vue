<template>
  <el-form-item
    :label="type === 'checkbox' ? '' : name"
    :prop="slug"
  >
    <el-input v-if="type === 'input'" v-model="local_value" :placeholder="placeholder">
      <template v-if="appendInfo" slot="append">
        {{ appendInfo }}
      </template>
    </el-input>
    <el-checkbox
      v-if="type === 'checkbox'"
      v-model="local_value"
    >
      {{ name }}
    </el-checkbox>
    <el-checkbox-group
      v-if="type === 'checkbox_group'"
      v-model="local_value"
    >
      <el-checkbox
        v-for="option in options"
        :key="option.id"
        :label="option.slug"
      >
        {{ option.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-select
      v-if="type === 'select'"
      v-model="local_value"
      :placeholder="placeholder"
      clearable
    >
      <el-option
        v-for="option in options"
        :key="option.id"
        :label="option.name"
        :value="option.slug"
      />
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  name: 'Attribute',
  props: {
    name: {
      type: String,
      default () {
        return ''
      }
    },
    slug: {
      type: String,
      default () {
        return ''
      }
    },
    placeholder: {
      type: String,
      default () {
        return ''
      }
    },
    type: {
      type: [Number, String, Array],
      default () {
        return 'input'
      }
    },
    appendInfo: {
      type: String,
      default () {
        return ''
      }
    },
    options: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      local_value: ''
    }
  },
  watch: {
    value (value) {
      this.local_value = this.value
      this.$emit('set-value', value)
    },
    local_value (value) {
      this.$emit('set-value', value)
    }
  },
  methods: {
    //
  }
}
</script>

<style scoped>

</style>
