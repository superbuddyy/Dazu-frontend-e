<template>
  <el-dialog
    title="Save search to favorites"
    :visible.sync="visible"
    class="save-filters"
    :modal="showBg"
    :before-close="handleClose"
  >
    <div v-if="filters.location">
      Location: <b>{{ filters.location.display_name }}</b>
    </div>
    <div v-if="filters.type">
      Type of ad: <b>{{ filters.type }}</b>
    </div>
    <div v-if="filters.category">
      Category: <b>{{ filters.category }}</b>
    </div>
    <div v-if="filters.price && filters.price.min">
      Price: from <b>{{ filters.price.min }}</b> to <b>{{ filters.price.max }}</b>
    </div>
    <div v-if="filters.meter && filters.meter.min">
      Sq.m: from <b>{{ filters.meter.min }}</b> to <b>{{ filters.meter.max }}</b>
    </div>
    <div v-if="filters['rachunki-wliczone']">
      Bills included: <b>Yes</b>
    </div>
    <div v-if="filters['na-raty']">
      In installments: <b>Yes</b>
    </div>
    <div v-if="filters.dodatkowe.garage">
      Garage: <b>Yes</b>
    </div>
    <div v-if="filters.dodatkowe.umeblowane">
      Furnished: <b>Yes</b>
    </div>
    <div v-if="filters.dodatkowe.parking">
      Parking: <b>Yes</b>
    </div>
    <div class="notifi-buttons">
      <b>Notify me:</b>
      <div class="buttons">
        <el-button
          :class="[ selectedPeriod === null ? 'active' : '' ]"
          @click="select(null)"
        >
          right away
        </el-button>
        <el-button
          :class="[ selectedPeriod === 1 ? 'active' : '' ]"
          @click="select(1)"
        >
          every day
        </el-button>
        <el-button
          :class="[ selectedPeriod === 3 ? 'active' : '' ]"
          @click="select(3)"
        >
          3 days
        </el-button>
        <!-- <el-button
          :class="[ selectedPeriod === 7 ? 'active' : '' ]"
          @click="select(7)"
        >
         7 days
        </el-button>
        <el-button
          :class="[ selectedPeriod === 14 ? 'active' : '' ]"
          @click="select(14)"
        >
          14 days
        </el-button>
        <el-button
          :class="[ selectedPeriod === 30 ? 'active' : '' ]"
          @click="select(30)"
        >
          30 days
        </el-button> -->
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-checkbox v-model="notification" class="notifications-checkbox">
        Email me if have matched properties
      </el-checkbox>
      <el-button type="primary" @click="save">Save</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { fromSearchQueryStringToFromData } from '@/helpers'
import { store } from '@/api/filters'

export default {
  name: 'SaveFilters',
  props: {
    visible: {
      type: Boolean,
      default () {
        return false
      }
    },
    showBg: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    return {
      notification: true,
      selectedPeriod: null
    }
  },
  computed: {
    filters () {
      return fromSearchQueryStringToFromData(this.$route.query)
    }
  },
  methods: {
    select (days) {
      this.selectedPeriod = days
    },
    handleClose () {
      this.$emit('close')
    },
    async save () {
      const result = await store({ filters: this.$route.query, period: this.selectedPeriod, notification: this.notification })
      if (result.status === 201) {
        this.$message({
          message: 'Added to favorites',
          type: 'success',
          duration: 3000
        })
        this.handleClose()
      }
    }
  }
}
</script>

<style lang="scss">
  .save-filters {
    .v-modal {
      display: none;
    }
    .el-dialog {
      width: 40%;
    }
    .notifications-checkbox {
      float: left;
    }

    .notifi-buttons {
      margin-top: 20px;
      .buttons {
        margin-top: 4px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .active {
          color: #ff19b7;
          border-color: #ceefdd;
          background-color: #effaf4;
        }
      }
    }
  }
</style>
