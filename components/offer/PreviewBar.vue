<template>
  <div class="preview-bar">
    <div class="preview-container">
      <div class="text">
        <i class="el-icon-warning-outline"></i>
        <p>
          Announcement preview. Check all data and save the ad.
        </p>
      </div>
      <div class="buttons">
        <el-button type="plain" class="preview-btn" icon="el-icon-edit" @click="edit">
          Edit
        </el-button>
        <el-button v-if="$store.state.user.isLogged" type="primary" class="preview-btn" icon="el-icon-check" @click="save">
          Save
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewBar',
  props: {
    offerSlug: {
      type: String,
      default () {
        return ''
      }
    }
  },
  methods: {
    edit () {
      if (this.$store.state.user.isLogged) {
        this.$router.push('/moje-ogloszenia/edytuj-ogloszenie/' + this.offerSlug)
      } else {
        this.$router.push('/moje-ogloszenia/edytuj-ogloszenie/' + this.offerSlug + '?preview=true')
      }
    },
    save () {
      this.$router.push('/moje-ogloszenia')
    }
  }
}
</script>

<style lang="scss" scoped>
  .preview-bar {
    position: fixed;
    bottom: 0;
    padding: 10px 0;
    background: #041e15d6;
    width: 100%;
    z-index: 9999;

    .preview-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin: 0 4vw;
      .buttons {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 40%;

        .preview-btn {
          width: 140px;
        }
      }

      .text {
        width: 60%;
        text-align: left;
        color: #ffffff;
        display: flex;
        align-items: center;

        i {
          font-size: 35px;
          font-family: 'Inconsolata';
          color: red;
          margin-right: 10px;
        }
      }
    }
  }
</style>
