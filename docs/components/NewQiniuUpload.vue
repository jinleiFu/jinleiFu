<template>
  <div class="clearfix qiniu-upload">
    <a-upload
      :file-list="fileList"
      :disabled="!displayUpload"
      action="https://upload-cn-east-2.qiniup.com"
      :data="{ token: token }"
      accept="image/jpeg,image/jpg,image/png"
      list-type="picture-card"
      multiple
      @preview="previewImage"
      @change="changeFiles"
    >
      <div v-if="displayUpload && fileList.length < limit">
        <slot>
          <plus-outlined />
          <div class="ant-upload-text">上传照片</div>
        </slot>
      </div>
    </a-upload>
    <a-modal
      centered
      :visible="previewShow"
      :footer="null"
      @cancel="previewHide"
    >
      <img style="width: 100%" :src="imgUrl" />
    </a-modal>
  </div>
</template>
<script>
  // import { qiniuUploadToken, qiniuFileUrlList } from '@/api/qiniu.js'
  import { PlusOutlined } from '@ant-design/icons-vue'
  import {
    defineComponent,
    ref,
    onMounted,
    reactive,
    toRefs,
    computed,
    watch,
  } from 'vue'

  // 图片格式转化
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  export default defineComponent({
    components: {
      PlusOutlined,
    },

    props: {
      // 文件key
      keys: {
        type: Array,
        default: () => [],
      },
      // 错误文件key
      errorKeys: {
        type: Array,
        default: () => [],
      },
      // 是否显示上传控件
      show: Boolean,
      // 上传数量限制
      limit: {
        type: Number,
        default: Infinity,
      },
    },

    setup(props, { emit }) {
      const previewShow = ref(false) // 预览图片弹窗是否可见
      const imgUrl = ref('') // 预览图片的url
      const displayUpload = ref(props.show) //是否显示上传控件
      const token = ref('') //七牛云token
      const state = reactive({
        fileList: [], // 图片列表
        urlLoaded: false, // 是否已通过key换取URL
      })

      // onMounted(() => {
      //   // 获取七牛云token
      //   qiniuUploadToken().then((res) => {
      //     token.value = res.data
      //   })
      // })

      // 文件key
      const fileKeys = computed(() => [...props.keys, ...props.errorKeys])

      watch(
        fileKeys,
        (value) => {
          getFileList(value)
        },
        { immediate: true }
      )

      /**
       * @description: 获取文件列表
       * @param {Array} fileKeys 文件key列表
       */
      async function getFileList(fileKeys) {
        if (!fileKeys.length || state.urlLoaded) return
        const fileList = []
        const { data } = await qiniuFileUrlList({ fileKeys })
        Object.keys(data).forEach((key, idx) => {
          const status = props.errorKeys.includes(key) ? 'error' : 'done'
          const url = data[key]
          fileList.push({ fileKey: key, url, status, uid: `${idx}${key}` })
        })
        state.fileList = fileList
        state.urlLoaded = true
      }

      // 关闭预览
      const previewHide = () => {
        previewShow.value = false
      }

      // 预览图片
      const previewImage = async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj)
        }
        imgUrl.value = file.url || file.preview
        previewShow.value = true
      }

      // 选择图片
      const changeFiles = (val) => {
        const { file } = val
        let resFileList = [...val.fileList]

        if (file.status === 'removed') {
          // 删除图片
          const { uid } = file
          const idx = state.fileList.findIndex((item) => item.uid === uid)
          state.fileList.splice(idx, 1)
        } else if (props.limit !== Infinity) {
          // 限制上传数量（保留最新上传的图片）
          state.fileList = resFileList.slice(-props.limit)
        } else {
          state.fileList = resFileList
        }
        /**
         *  ant design组件每次上传会触发多次change事件
         *  为了防止触发多次，当文件列表状态全不为‘uploading’时在触发自定义事件
         */
        if (resFileList.every((item) => item.status !== 'uploading')) {
          const keys = []
          resFileList.forEach((res) => {
            if (res.fileKey) {
              keys.push(res.fileKey)
            } else if (res.response) {
              keys.push(res.response.key)
            }
          })
          emit('revise', { keys, fileList: resFileList })
        }
      }

      // 清空图片列表
      const clearFiles = () => {
        state.fileList = []
      }

      return {
        previewShow,
        imgUrl,
        displayUpload,
        token,
        ...toRefs(state),
        previewHide,
        previewImage,
        changeFiles,
        clearFiles,
      }
    },
  })
</script>
<style lang="less">
  .qiniu-upload {
    .ant-upload-select-picture-card i {
      font-size: 32px;
      color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
      margin-top: 8px;
      color: #666;
    }

    .ant-upload.ant-upload-select-picture-card {
      width: 192px;
      height: 136px;
      margin: 0 30px 18px 0;
    }

    .ant-upload-list-picture-card-container {
      width: 192px;
      height: 136px;
      margin: 0 20px 20px 0;
      border-radius: 6px;
    }

    .ant-upload-list-picture-card .ant-upload-list-item {
      width: 192px;
      height: 136px;
      margin: 0 20px 20px 0;
      border-radius: 6px;
    }

    .ant-upload-list-picture-card .ant-upload-list-item-info {
      border-radius: 6px;
    }

    .ant-btn {
      padding: 0 0 0 0;
    }
  }
</style>
