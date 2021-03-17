<template>
  <el-dialog
    title="Zapisz filtry do ulubionych"
    :visible.sync="visible"
    class="save-filters"
    :modal="showBg"
    :before-close="handleClose"
  >
    <div v-if="filters.location">
      Lokalizacja: <b>{{ filters.location.display_name }}</b>
    </div>
    <div v-if="filters.type">
      Typ: <b>{{ filters.type }}</b>
    </div>
    <div v-if="filters.category">
      Kategoria: <b>{{ filters.category }}</b>
    </div>
    <div v-if="filters.price && filters.price.min">
      Cena: od <b>{{ filters.price.min }}</b> do <b>{{ filters.price.max }}</b>
    </div>
    <div v-if="filters.metraz && filters.metraz.min">
      Metraż: od <b>{{ filters.metraz.min }}</b> do <b>{{ filters.metraz.max }}</b>
    </div>
    <div v-if="filters['rachunki-wliczone']">
      Rachunki wliczone: <b>Tak</b>
    </div>
    <div v-if="filters['na-raty']">
      Na raty: <b>Tak</b>
    </div>
    <div v-if="filters.dodatkowe.garaz">
      Garaż: <b>Tak</b>
    </div>
    <div v-if="filters.dodatkowe.umeblowane">
      Umeblowane: <b>Tak</b>
    </div>
    <div v-if="filters.dodatkowe.parking">
      Parking: <b>Tak</b>
    </div>
    <div class="notifi-buttons">
      <b>Powiadom mnie:</b>
      <div class="buttons">
        <el-button
          :class="[ selectedPeriod === null ? 'active' : '' ]"
          @click="select(null)"
        >
          od razu
        </el-button>
        <el-button
          :class="[ selectedPeriod === 1 ? 'active' : '' ]"
          @click="select(1)"
        >
          codziennie
        </el-button>
        <el-button
          :class="[ selectedPeriod === 3 ? 'active' : '' ]"
          @click="select(3)"
        >
          3 dni
        </el-button>
        <el-button
          :class="[ selectedPeriod === 7 ? 'active' : '' ]"
          @click="select(7)"
        >
          7 dni
        </el-button>
        <el-button
          :class="[ selectedPeriod === 14 ? 'active' : '' ]"
          @click="select(14)"
        >
          14 dni
        </el-button>
        <el-button
          :class="[ selectedPeriod === 30 ? 'active' : '' ]"
          @click="select(30)"
        >
          30 dni
        </el-button>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-checkbox v-model="notification" class="notifications-checkbox">
        Powiadomienia email
      </el-checkbox>
      <el-button type="primary" @click="save">Zapisz</el-button>
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
          message: 'Dodano do ulubionych',
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
          color: #009E79;
          border-color: #ceefdd;
          background-color: #effaf4;
        }
      }
    }
  }
</style>
