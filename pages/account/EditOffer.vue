<template>
  <div class="add-offer-page">
    <div class="title">
      <h1>Edytuj ogłoszenie</h1>
    </div>
    <div class="container">
      <OfferForm
        v-if="categories !== {} && rootCategories.length > 0"
        :attributes="attributes"
        :categories="categories"
        :root-categories="rootCategories"
        :root-sub-categories="rootSubCategories"
        :loading="loading"
      />
    </div>
  </div>
</template>
<script>
import OfferForm from '@/components/add_offer/OfferForm'
import { index } from '@/api/attributes'
import { index as categoryIndex } from '@/api/categories'

export default {
  name: 'EditOffer',
  components: {
    OfferForm
  },
  data: () => ({
    attributes: {},
    categories: {},
    rootCategories: [],
    rootSubCategories: [],
    loading: true
  }),
  mounted () {
    this.getCategories()
    this.getAttributes()
  },
  methods: {
    async getAttributes () {
      const result = await index()
      if (result.status === 200) {
        this.attributes = result.data
        this.loading = false
      }
    },
    async getCategories () {
      const categories = await categoryIndex()
      if (categories.status === 200) {
        for (const category of categories.data) {
          this.rootSubCategories[category.slug] = category.children.map((category) => {
            return { name: category.name, value: category.slug, id: category.id, offer_types: category.offer_types ? category.offer_types : [] }
          })
        }

        this.rootCategories = categories.data.map((category) => {
          return { name: category.name, value: category.slug, id: category.id, offer_types: category.offer_types ? category.offer_types : [] }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.add-offer-page {
  min-height: calc(100vh - 274px);

  .breadcrumbs {
    padding-top: 80px;
  }

  .title {
    width: 100%;
    padding-top: 80px;
    h1 {
      background: #f5f5f5;
      text-align: center;
      font-size: 20px;
      padding: 10px;
    }
  }

  .container {
    display: flex;
    margin: 0 6vw;
    padding: 60px;

    .add-offer-form {
      width: 70%;
      margin: 0 auto;
    }
  }
}
</style>
