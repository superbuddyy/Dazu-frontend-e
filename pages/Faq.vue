<template>
  <div class="faq-page">
    <h1>FAQ</h1>
    <h3>Najczęściej zadawane pytania</h3>
    <el-collapse v-model="activeTab" class="faq-collapse" :accordion="true">
      <FaqItem
        v-for="(item, index) in faqItems"
        :key="index"
        :title="item.title"
        :content="item.content"
      />
    </el-collapse>
  </div>
</template>

<script>
import FaqItem from '../components/faq/FaqItem'
import { getFaqItems } from '~/api/faq'

export default {
  name: 'Faq',
  components: {
    FaqItem
  },
  data: () => {
    return {
      faqItems: [],
      activeTab: ''
    }
  },
  mounted () {
    this.getFaqItems()
  },
  methods: {
    async getFaqItems () {
      const result = await getFaqItems()
      if (result.status === 200) {
        this.faqItems = result.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .faq-page {
    min-height: calc(100vh - 274px);
    margin: 0 4vw;
    padding: 80px 0 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h3 {
      font-weight: normal;
    }

    .faq-collapse {
      margin-top: 20px;
      width: 50%;
    }
  }
</style>
