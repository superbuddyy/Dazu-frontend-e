<template>
  <div class="agents-list">
    <el-table
      :data="transactions"
    >
      <el-table-column
        fixed
        prop="created_at"
        label="Delivery dates"
      />
      <el-table-column
        fixed
        prop="number"
        label="ID"
      />
      <el-table-column
        fixed
        prop="description"
        label="Title"
      />
      <el-table-column
        fixed
        prop="total"
        label="Addition"
        :formatter="moneyFormatter"
      />
      <el-table-column
        fixed="right"
        label="Actions"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="generateInvoice(scope.row.id)"
          >
            Invoice
            <i class="el-icon-right el-icon-right" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-section">
      <el-pagination
        v-if="total > 1"
        background
        class="pagination-section"
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
      />
    </div>
  </div>
</template>

<script>
import { index, invoice } from '@/api/transaction'

export default {
  name: 'PaymentsList',
  data: () => ({
    transactions: [],
    total: 1,
    pageSize: 10,
    currentPage: 1
  }),
  mounted () {
    this.getTransactions()
  },
  methods: {
    async getTransactions () {
      const result = await index()
      this.transactions = result.data.data
      this.total = result.data.total
      this.currentPage = result.data.current_page
      this.pageSize = result.data.per_page
    },
    async generateInvoice (id) {
      const result = await invoice(id)
      window.open(result.data.url, '_blank')
    },
    moneyFormatter (value) {
      return (parseInt(value.total) / 100).toFixed(2) + ' £'
    }
  }
}
</script>

<style lang="scss">
  .agents-list {
    width: 100%;
    margin: 0 6vw;
    .pagination-section {
      text-align: center;
      margin-top: 20px;
    }
  }
</style>
