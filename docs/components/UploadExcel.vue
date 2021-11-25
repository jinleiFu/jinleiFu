<template>
  <div class="upload-excel">
    <a-modal
      :visible="importVisible"
      title="导入数据"
      width="432px"
      centered
      @cancel="closeImportModel"
    >
      <div class="download-wrap">
        <div class="icon-wrap">
          <img src="/upload/download_icon.png" class="icon" />
        </div>
        <div class="content-wrap">
          <div class="title">下载模版</div>
          <div class="tips">
            为提高导入的成功率，请下载并使用系统提供的模版。
          </div>
          <a-button type="primary" ghost @click="downloadTemplate">
            下载模版
          </a-button>
        </div>
      </div>

      <div class="upload-wrap">
        <div class="icon-wrap">
          <img src="/upload/upload_icon.png" class="icon" />
        </div>
        <div class="content-wrap">
          <div class="title">上传文件</div>
          <div class="tips">仅支持XLSX，XLS，CSV，文件大小≤4M。</div>
          <a-upload
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            :file-list="excelList"
            :remove="handleRemoveExcel"
            :before-upload="beforeUploadExcel"
          >
            <a-button type="primary" ghost>选取文件</a-button>
          </a-upload>
        </div>
      </div>

      <template #footer>
        <a-button
          type="primary"
          style="color: #fff"
          :loading="loadingImport"
          :disabled="excelList.length === 0"
          @click="handleImport"
        >
          {{ loadingImport ? '导入中' : '开始导入' }}
        </a-button>
      </template>
    </a-modal>

    <a-modal
      :visible="importCompleted"
      width="317px"
      centered
      :closable="false"
      @cancel="() => (importCompleted = false)"
    >
      <div class="completed-wrap">
        <div class="completed-item">
          <span>导入成功：</span>
          <span class="success">2</span>
          <span>条</span>
        </div>
        <div class="completed-item">
          <span>导入失败：</span>
          <span class="dander">1</span>
          <span>条</span>
        </div>
        <div class="completed-item">
          <span
            class="dander"
            style="cursor: pointer"
            @click="downloadFailedData"
          >
            下载导入失败数据
          </span>
        </div>
      </div>
      <template #title>
        <div style="display: flex; align-items: center">
          <CheckCircleFilled
            :style="{
              fontSize: '18px',
              color: '#17BE6B',
            }"
          />
          <span style="margin-left: 12px">导入完成</span>
        </div>
      </template>
      <template #footer>
        <a-button
          type="primary"
          style="color: #fff"
          @click="() => (importCompleted = false)"
        >
          知道了
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import { defineComponent, reactive, toRefs, watch, toRaw } from 'vue'
  import xlsx from 'xlsx'
  import { message } from 'ant-design-vue'
  import { CheckCircleFilled } from '@ant-design/icons-vue'
  export default defineComponent({
    name: 'UploadExcel',
    components: { CheckCircleFilled },
    props: {
      // 是否显示导入弹窗
      visible: {
        type: Boolean,
        default: false,
      },
      // 导入地址
      action: {
        type: String,
        default: '',
      },
      // 导入模板下载地址
      templateUrl: {
        type: String,
        default: '',
      },
      // 导入数据配置 数据格式[ {title:'名称', key:'name'} ]
      columns: {
        type: Array,
        default: () => [],
      },
      // 表头的起始行
      headerIndex: {
        type: Number,
        default: 0,
      },
      // 导入失败数据的excel名称
      failedName: {
        type: String,
        default: '导入失败数据',
      },
    },
    setup(props, { emit }) {
      const state = reactive({
        importVisible: false, // 显示导入弹窗
        loadingImport: false, // 导入中
        importCompleted: false, // 导入完成
        excelList: [], // excel文件列表
        excelData: [], // 需导入的excel数据
        failedExceData: [], // 导入失败excel数据
      })

      watch(
        () => props.visible,
        (val) => {
          state.importVisible = val
        }
      )

      /**
       * @description: 处理导入
       */
      async function handleImport() {
        const jsonData = await excelToJson(state.excelList[0])
        const convertData = convertKeys({
          columns: toRaw(props.columns),
          excelData: jsonData,
          targetType: 'en',
        })
        state.excelData = convertData
        console.log('导入数据', convertData)
        const failedExceData = await sendExcelData(convertData)
        state.failedExceData = failedExceData
        console.log('导入失败数据', failedExceData)
      }
      /**
       * @description: 发送excel数据
       * @param {Array} excelData
       * @return {Array} 导入失败的excel数据
       */
      async function sendExcelData(excelData) {
        return new Promise((resolve) => {
          // 模拟网络请求
          state.loadingImport = true
          setTimeout(() => {
            closeImportModel()
            state.loadingImport = false
            state.importCompleted = true
            resolve(excelData.slice(2))
          }, 1500)
        })
      }

      /**
       * @description: 下载导入失败数据
       */
      function downloadFailedData() {
        const convertData = convertKeys({
          columns: toRaw(props.columns),
          excelData: state.failedExceData,
          targetType: 'zh',
        })
        exportExcelFile(convertData)
      }

      /**
       * @description: 导出 excel 文件
       * @param {Array} excelData
       * @return {File} excel文件
       */
      function exportExcelFile(excelData) {
        // 设置header使用传入的列顺序
        const jsonWorkSheet = xlsx.utils.json_to_sheet(excelData, {
          header: props.columns.map((item) => item.title),
        })
        const workBook = {
          SheetNames: ['Sheet1'],
          Sheets: {
            ['Sheet1']: jsonWorkSheet,
          },
        }
        return xlsx.writeFile(workBook, `${props.failedName}.xlsx`)
      }

      /**
       * @description: excel转json
       * @param {File} file excel文件
       */
      function excelToJson(file) {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const data = e.target.result
            const workbook = xlsx.read(data, { type: 'binary' })
            const sheetNames = workbook.SheetNames
            const sheet1 = workbook.Sheets[sheetNames[0]]
            const jsonData = xlsx.utils.sheet_to_json(sheet1, {
              range: props.headerIndex, // 使用工作表范围
            })
            resolve(jsonData)
          }
          reader.readAsBinaryString(file)
        })
      }

      /**
       * @description: 中英文key转换
       * @param {Array} columns key的配置项
       * @param {Array} excelData 表格数据
       * @param {String} targetType 目标key的类型
       * @return {Array} 转换后数据
       */
      function convertKeys({
        columns = [],
        excelData = [],
        targetType = 'en',
      } = {}) {
        return excelData.map((excelItem) => {
          return Object.entries(excelItem).reduce((prev, current) => {
            const [currentKey, currentValue] = current
            // 更新 key
            let mappedKey = ''
            if (targetType === 'en') {
              const mapped =
                columns.find((item) => item.title === currentKey) || {}
              mappedKey = mapped?.key
            } else if (targetType === 'zh') {
              const mapped =
                columns.find((item) => item.key === currentKey) || {}
              mappedKey = mapped?.title
            }
            if (mappedKey) {
              prev[mappedKey] = currentValue
            }

            return prev
          }, {})
        })
      }

      /**
       * @description: 关闭导入弹窗
       */
      function closeImportModel() {
        state.excelList = []
        state.importVisible = false
        emit('update:visible', false)
      }

      /**
       * @description: 下载模板
       */
      function downloadTemplate() {
        if (!props.templateUrl) {
          message.warning('暂无模板可供下载')
          return
        }
        const link = document.createElement('a')
        link.href = props.templateUrl
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
      /**
       * @description: 移除excel
       * @param {File} file 移除的文件
       */
      function handleRemoveExcel(file) {
        const index = state.excelList.indexOf(file)
        state.excelList.splice(index, 1)
      }
      /**
       * @description: 上传excel前
       * @param {File} file 上传的文件
       */
      function beforeUploadExcel(file) {
        // 限制只能上传一个excel
        state.excelList = [file]
        return false
      }

      return {
        ...toRefs(state),
        handleImport,
        closeImportModel,
        downloadTemplate,
        handleRemoveExcel,
        beforeUploadExcel,
        downloadFailedData,
      }
    },
  })
</script>

<style lang="less" scoped>
  .download-wrap,
  .upload-wrap {
    display: flex;

    .icon-wrap {
      padding-right: 12px;
      .icon {
        width: 25px;
        height: 25px;
      }
    }
    .title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
      padding-bottom: 13px;
    }
    .tips {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 22px;
      padding-bottom: 18px;
    }
  }
  .download-wrap {
    padding-bottom: 24px;
  }
  .upload-wrap {
    padding-bottom: 5px;
  }
  .completed-wrap {
    padding: 0 35px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    .completed-item + .completed-item {
      margin-top: 12px;
    }
    .success {
      color: #17be6b;
    }
    .dander {
      color: #f35151;
    }
  }
</style>
