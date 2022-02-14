<template>
  <div class="category">
    <el-form-item label="Kategoria" prop="category">
      <el-select v-model="local_category" placeholder="Wybierz" clearable @change="setSubCategories($event)">
        <template
          v-for="rootCategory in rootCategories"
        >
          <el-option
            v-if="rootCategory['offer_types'].includes($store.state.addOfferForm.type)"
            :key="rootCategory.value"
            :label="rootCategory.name"
            :value="rootCategory.value"
        />
        </template>
      </el-select>
    </el-form-item>
    <el-form-item v-if="category" label="Pod kategoria">
      <el-select v-model="local_subcategory" placeholder="Wybierz" clearable @change="setSubCategory">
        <template
          v-for="subCat in subCategories"
        >
          <el-option
            v-if="subCat['offer_types'].includes($store.state.addOfferForm.type)"
            :key="subCat.value"
            :label="subCat.name"
            :value="subCat.value"
          />
        </template>
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
