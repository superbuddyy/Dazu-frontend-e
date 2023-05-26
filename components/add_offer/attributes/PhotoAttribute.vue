<template>
  <el-form-item :label="fileLabel" class="upload-images">
    <el-upload
      action="#"
      :show-file-list="false"
      list-type="picture-card"
      accept="image/jpeg,image/png"
      :limit="limit"
      :multiple="true"
      :on-preview="handlePictureCardPreview"
      :on-change="handleChange"
      :on-exceed="limitExceed"
      :auto-upload="false"
      :file-list="localFileList"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <draggable v-model="localFileList" class="drag-images" @end="handleMove">
      <transition-group>
        <div v-for="(element, index) in localFileList" :key="index+1" class="img-box" :class="[ isProjectPlan === true ? 'no-bor-img-box' : '' ]">
          <i class="el-icon-delete-solid" @click="removeImage(index)" />
          <img :src="element.url" alt="test">
          <div v-if="index === 0 && isProjectPlan === false" class="name">
            Main photo
          </div>
        </div>
      </transition-group>
    </draggable>
  </el-form-item>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'PhotoAttribute',
  components: {
    draggable
  },
  props: {
    fileList: {
      type: Array,
      default () {
        return []
      }
    },
    fileLabel: {
      type: String,
      default () {
        return 'Zdjęcia'
      }
    },
    limit: {
      type: Number,
      default () {
        return 10
      }
    },
    isProjectPlan: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      localFileList: []
    }
  },
  watch: {
    async fileList (value) {
      if (value.length > 0) {
        const photos = []
        for (const file of value) {
          if ('id' in file) {
            photos.push(await this.urlToObject('/storage/' + file.path_name, file.path_name))
          }
        }
        this.localFileList = photos
        this.$emit('on-change', photos)
      }
    }
  },
  methods: {
    removeImage (index) {
      this.localFileList.splice(index, 1)
      this.$emit('on-change', this.localFileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange (file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message({
          message: 'The photo cannot be larger than 5MB',
          type: 'error',
          duration: 3000
        })
        return isLt5M
      }
      this.localFileList.push(file)
      this.$emit('on-change', this.localFileList)
    },
    handleMove (e) {
      this.$emit('on-change', this.localFileList)
    },
    limitExceed () {
      this.$message({
        message: 'You can add max ' + this.limit + ' photos!',
        type: 'warning',
        duration: 3000
      })
    },
    async urlToObject (imageUrl, id) {
      const response = await this.$axios({
        method: 'get',
        url: imageUrl,
        responseType: 'blob'
      })

      return {
        raw: new File([response.data], id, { type: response.data.type, url: imageUrl }),
        url: imageUrl
      }
    }
  }
}
</script>

<style scoped lang="scss">
.drag-images {
  display: flex;
  margin-top: 10px;

  span {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .no-bor-img-box {
    border: unset !important;
    background-color: unset !important;
  }
  .img-box {
    //overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    padding: 14px;
    width: 148px;
    //height: 148px;
    position: relative;
    margin: 0 8px 8px 0;
    display: inline-block;
    box-sizing: unset;

    &:first-child {
      background: #f1f1f1;
    }

    i {
      position: absolute;
      top: -10px;
      right: -10px;
      color: red;
      font-size: 24px;
      cursor: pointer;
    }

    img {
      width: 100%;
      height: auto;
    }

    .name {
      text-align: center;
    }
  }
}
</style>
