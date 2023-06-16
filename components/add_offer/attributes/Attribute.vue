<template>
  <el-form-item
    :label="type === 'checkbox' ? '' : name"
    :prop="slug"
  >
    <el-input
      v-if="type === 'input' && inputMode === 'numeric'"
      :type="inputType"
      min="0"
      :disabled="disabled"
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
    <el-switch
      v-if="type === 'switch'"
      v-model="local_value">
      {{ name }}
    </el-switch>
    <el-checkbox-group
      v-if="type === 'checkbox_group'"
      v-model="local_value"
      :style="direction === 'row' ? {display: 'flex', width: '60%', flexWrap: 'wrap'}: {}"
    >
      <div
        v-for="option in options"
        :key="option.id"
      >
        <el-checkbox
          v-if="option['offer_types'].includes(addOfferForm.type)"
          :label="option.slug"
          :style="{marginRight: '20px'}"
        >
          {{ option.name }}
        </el-checkbox>
        <el-select v-if="option.slug === 'parking' && showParkingSelect" v-model="number_of_parkings" :placeholder="'Number Of Parkings'">
          <el-option v-for="(item, i) in numberOfParkingsOption" :key="i" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
    </el-checkbox-group>
    <el-radio-group
      v-if="type === 'radio_group'"
      v-model="local_value"
      :style="direction === 'row' ? {display: 'flex', paddingTop: '13px'}: {}"
    >
      <div
        v-for="option in options"
        :key="option.slug"
      >
        <el-radio
          v-if="option['offer_types'].includes(addOfferForm.type)"
          :label="option.slug"
          :style="{marginRight: '20px'}"
        >
          {{ option.name }}
        </el-radio>
      </div>
    </el-radio-group>
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
import { throwStatement } from '@babel/types'

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
    },
    direction: {
      type: String,
      default () {
        return 'column'
      }
    }
  },
  data () {
    return {
      local_value: '',
      addOfferForm: {},
      numberOfParkingsOption: [
        {label: 'Off Street', value: '0'},
        {label: '1 spaces', value: '1'},
        {label: '2 spaces', value: '2'},
        {label: '+3 spaces', value: '+3'}
      ],
      showParkingSelect: false,
      number_of_parkings: ''
    }
  },
  watch: {
    value (value) {
      this.local_value = this.value
      this.$emit('set-value', value)
    },
    local_value (value) {
      console.log(value)
      if(value && Array.isArray(value) && value.includes('parking')) this.showParkingSelect = true
      else this.showParkingSelect = false
      this.$emit('set-value', value)
    },
    number_of_parkings (value) {
      this.$emit('set-number-of-parkings', value)
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
