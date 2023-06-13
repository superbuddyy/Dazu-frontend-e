<template>
  <div class="agents-list">
    <el-button type="primary" icon="el-icon-circle-plus-outline" class="add" @click="dialogVisible = true">
      Add Agent
    </el-button>
    <el-table
      :data="agents"
    >
      <el-table-column
        fixed
        prop="id"
        label="ID"
      />
      <el-table-column
        fixed
        prop="name"
        label="Name"
      />
      <el-table-column
        fixed
        prop="email"
        label="Email"
      />
      <el-table-column
        fixed
        prop="created_at"
        label="Data added"
      />
      <el-table-column
        fixed
        prop="status"
        label="Status"
      />
      <el-table-column
        fixed="right"
        label="Action"
      >
        <template slot-scope="scope">
          <el-popconfirm
            confirm-button-text="Tak"
            cancel-button-text="Nie"
            icon="el-icon-info"
            icon-color="red"
            title="Are you sure you want to remove the agent?"
            @onConfirm="deleteAgent(scope.row.id)"
          >
            <el-button
              slot="reference"
              type="danger"
              size="small"
            >
              Usuń
            </el-button>
          </el-popconfirm>
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
    <AddAgentDialog
      :dialog-visible="dialogVisible"
      @close-dialog="dialogVisible = false"
      @add-agent="addAgent"
    />
  </div>
</template>
<script>

import AddAgentDialog from '@/components/account/agents/AddAgentDialog'
import { getAgents, deleteAgent } from '@/api/user'

export default {
  name: 'AgentsList',
  components: {
    AddAgentDialog
  },
  data: () => ({
    dialogVisible: false,
    agents: [],
    total: 1,
    pageSize: 10,
    currentPage: 1
  }),
  mounted () {
    this.getAgents()
  },
  methods: {
    addAgent (event) {
      this.agents.push(event)
    },
    async deleteAgent (id) {
      const result = await deleteAgent(id)
      if (result.status === 204) {
        this.$message({
          message: 'The agent has been removed',
          type: 'success',
          duration: 3000
        })
        this.agents = this.agents.filter(function (agent) {
          return agent.id !== id
        })
        this.total = result.data.total
        this.currentPage = result.data.current_page
        this.pageSize = result.data.per_page
      }
    },
    async getAgents () {
      const result = await getAgents()
      if (result.status === 200) {
        this.agents = result.data.data
      }
    }
  }
}
</script>

<style lang="scss">
  .agents-list {
    width: 100%;
    margin: 0 6vw;
    .add {
      margin-bottom: 20px;
    }

    .pagination-section {
      text-align: center;
      margin-top: 20px;
    }
  }
</style>
