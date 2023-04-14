<template>
  <el-form-item
    :label="type === 'checkbox' ? '' : name"
    :prop="slug"
  >
    <el-input
      v-if="type === 'input' && inputMode === 'numeric'"
      :type="inputType"
      min="0"
      :disabled="true"
      :inputmode="inputMode"
      v-model="local_value"
      :placeholder="placeholder"
    >
      <!-- onkeyup="value = value.replace(/[^\d]/g, 0)" -->
      <template v-if="appendInfo" slot="append">
        {{ appendInfo }}
      </template>
    </el-input>
    <el-input
      v-if="type === 'input' && inputType === 'number'"
      :type="inputType"
      min="0"
      v-model="local_value"
      :placeholder="placeholder"
      onkeyup="value = value.replace(/[^\d]/g, 0)"
    >
      <template v-if="appendInfo" slot="append">
        {{ appendInfo }}
      </template>
    </el-input>
    <el-input v-if="type === 'input' && inputMode !== 'numeric' && inputType !== 'number'" :type="inputType" v-model="local_value" :placeholder="placeholder">
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
      <div
        v-for="option in options"
        :key="option.id"
      >
        <el-checkbox
          v-if="option['offer_types'].includes(addOfferForm.type)"
          :label="option.slug"
        >
          {{ option.name }}
        </el-checkbox>
      </div>
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
      type: [String],
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
    inputType: {
      type: String,
      default () {
        return 'text'
      }
    },
    inputMode: {
      type: String,
      default () {
        return ''
      }
    },
    disabled: {
      type: Boolean,
      default () {
        return false
      }
    },
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: [Number, String, Array, Boolean]
    }
  },
  data () {
    return {
      local_value: '',
      addOfferForm: {}
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
  mounted () {
    this.addOfferForm = this.$store.state.addOfferForm;
    if (this.type === 'checkbox_group') {
      this.local_value = []
    }
  },
  methods: {
    //
  }
}
</script>

<style scoped>

</style>
