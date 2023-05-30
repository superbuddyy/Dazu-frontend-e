<template>
  <div class="category">
    <el-form-item label="Category" prop="category">
      <vue-cascader-select
        :options="rootCategories"
        @clear="(val) => value = ''"
        @select="(selected) => value = selected.value"
        :value="value"
      />
      <!-- <el-select v-model="local_category" placeholder="Choose" clearable @change="setSubCategories($event)">
        <template
          v-for="rootCategory in rootCategories"
        >
          <el-option
            v-if="rootCategory['offer_types'].includes(addOfferForm.type)"
            :key="rootCategory.value"
            :label="rootCategory.name"
            :value="rootCategory.value"
        />
        </template>
      </el-select>
    </el-form-item>
    <el-form-item v-if="category" label="Sub category">
      <el-select v-model="local_subcategory" placeholder="Choose" clearable @change="setSubCategory">
        <template
          v-for="subCat in subCategories"
        >
          <el-option
            v-if="subCat['offer_types'].includes(addOfferForm.type)"
            :key="subCat.value"
            :label="subCat.name"
            :value="subCat.value"
          />
        </template>
      </el-select> -->
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
      addOfferForm: {},
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
    this.addOfferForm = this.$store.state.addOfferForm;
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
