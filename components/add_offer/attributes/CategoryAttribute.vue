<template>
  <div class="category">
    <el-form-item label="Kategoria" prop="category">
      <el-select v-model="local_category" placeholder="Wybierz" clearable @change="setSubCategories($event)">
        <el-option
          v-for="rootCategory in rootCategories"
          :key="rootCategory.value"
          :label="rootCategory.name"
          :value="rootCategory.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="category" label="Pod kategoria">
      <el-select v-model="local_subcategory" placeholder="Wybierz" clearable @change="setSubCategory">
        <el-option
          v-for="subCat in subCategories"
          :key="subCat.value"
          :label="subCat.name"
          :value="subCat.value"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'CategoryAttribute',
  props: {
    category: {
      type: String,
      default () {
        return ''
      }
    },
    subcategory: {
      type: String,
      default () {
        return ''
      }
    },
    rootCategories: {
      type: Array,
      default () {
        return []
      }
    },
    rootSubCategories: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      subCategories: {},
      local_category: '',
      local_subcategory: ''
    }
  },
  watch: {
    category (value) {
      this.local_category = value
      this.setSubCategories(value)
    },
    subcategory (value) {
      this.local_subcategory = value
    },
    rootSubCategories (value) {
      this.subCategories = value
    }
  },
  mounted () {
    this.category = this.local_category
    this.subcategory = this.local_subcategory
  },
  methods: {
    setSubCategories (e) {
      this.subCategories = this.rootSubCategories[e]
      this.$emit('set-root-category', e)
    },
    setSubCategory (e) {
      this.$emit('set-sub-category', e)
    }
  }
}
</script>

<style scoped>

</style>
