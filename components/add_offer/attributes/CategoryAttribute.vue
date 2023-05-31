<template>
  <div class="category">
    <el-form-item label="Category">
      <el-cascader
        v-model="local_category"
        :options="categories"
        :props="{
          checkStrictly: true,
          value: 'value',
          label: 'label',
          children: 'options'
        }"
        clearable
        expand-trigger="hover"
        placeholder="Select options"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'CategoryAttribute',
  props: {
    rootCategories: {
      type: Array,
      default () {
        return []
      }
    },
    offerType: {
      type:String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      addOfferForm: {},
      local_category: '',
      categories: [],
    }
  },
  watch: {
    offerType (value) {
      if(value == 'rent') {
        this.categories = this.$props.rootCategories.reduce((categories, category) => {
          if( category.value === 'development-opportunity')
            return [...categories]
          else return [...categories, category]
        },[])
      } else {
        this.categories = this.$props.rootCategories.reduce((categories, category) => {
          if( category.value === 'room1')
            return [...categories]
          else return [...categories, category]
        },[])
      }
      console.log(this.categories)
    },
    local_category (value) {
      this.$emit('set-root-category', value)
    }
  },
  mounted () {
    this.addOfferForm = this.$store.state.addOfferForm;
  },
  methods: {
    handleSelect (event) {
      this.local_category = event.value
    }
  }
}
</script>

<style lang="scss">
.vcs {
  width: 20%;
}
.vcs__picker input,
.vcs__select-menu {
  background: white;
  color: black;
  z-index: 1000;
  border-color: #282b34;
}
.vcs__arrow-container {
  border-left: none !important;
}

.vcs__picker input::placeholder {
  color: #bbb;
}
.vcs__option {
  background-color: white;
  color: black;
}
</style>
