<template>
  <div class="add-offer-page">
    <div class="title">
      <h1>Dodaj ogłoszenie</h1>
    </div>
    <div class="container">
      <OfferForm
        :attributes="attributes"
        :categories="categories"
        :root-categories="rootCategories"
        :loading="loading"
      />
    </div>
    <nuxt-link :to="'/kontakt'" target="_blank" class="help-link">
      Potrzebujesz pomocy graficznej?
      <img src="~/assets/lifebuoy.png" alt="">
    </nuxt-link>
  </div>
</template>
<script>
import OfferForm from '@/components/add_offer/OfferForm'
import { index } from '@/api/attributes'
import { index as categoryIndex } from '@/api/categories'

export default {
  name: 'AddOffer',
  components: {
    OfferForm
  },
  data: () => ({
    attributes: {},
    categories: {},
    rootCategories: [],
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
      const result = await categoryIndex()
      if (result.status === 200) {
        for (const category of result.data) {
          this.categories[category.slug] = category.children.map((category) => {
            return { name: category.name, value: category.slug }
          })
        }

        this.rootCategories = result.data.map((category) => {
          return { name: category.name, value: category.slug }
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

    @media only screen and (max-width: 1760px) {
      padding: 60px 0;
    }

    @media only screen and (max-width: 1600px) {
      margin: 0;
    }

    .add-offer-form {
      width: 70%;
      margin: 0 auto;
      @media only screen and (max-width: 1600px) {
        width: 90%;
      }
    }
  }
}
.help-link {
  font-size: 15px;
  border-radius: 4px;
  position: fixed;
  top: 50%;
  right: 0;
  color: #ffffff;
  padding: 10px;
  text-decoration: none;
  background: #000000;
  width: 300px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 1100px) {
    top: unset;
    bottom: 0;
  }

  img {
    height: 30px;
    width: 30px;
    margin-left: 10px;
  }
}
</style>
