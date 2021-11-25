<template>
  <div class="snapshot-list-wrapper">
    <div class="range-picker-wrapper">
      <a-range-picker
        v-model:value="datesValue"
        format="YYYY-MM-DD"
        :placeholder="['开始时间', '结束时间']"
        :disabledDate="disabledDate"
        @change="handleChangeData"
        @openChange="handleOpenChange"
        @calendarChange="handleCalendarChange"
      >
        <template #suffixIcon>
          <CalendarOutlined />
        </template>
      </a-range-picker>
    </div>
    <div class="table-wrapper">
      <a-table
        bordered
        :data-source="logData"
        :pagination="false"
        :loading="logLoading"
        rowKey="snapshotId"
      >
        <a-table-column title="时间" align="center" ellipsis>
          <template #default="{ record }">
            <span>
              {{
                record.snapshotTime
                  ? dayjs(record.snapshotTime).format('YYYY-MM-DD HH:mm')
                  : '-'
              }}
            </span>
          </template>
        </a-table-column>
        <a-table-column title="操作人" align="center" ellipsis>
          <template #default="{ record }">
            <span :title="record.fullName + '(' + record.mobileNumber + ')'">
              <span>{{ record.fullName || '-' }}(</span>
              <span>{{ record.mobileNumber || '-' }})</span>
            </span>
          </template>
        </a-table-column>
        <a-table-column align="center" title="操作" ellipsis>
          <template #default="{ record }">
            <span>{{ record.opTypeStr || '-' }}</span>
          </template>
        </a-table-column>
        <a-table-column title="快照" align="center">
          <template #default="{ record }">
            <div
              style="
                color: #007aff;
                cursor: pointer;
                white-space: nowrap;
                overflow: hidden;
              "
              @click="handleClickSnapshotId(record.snapshotId)"
            >
              {{ record.snapshotId }}
            </div>
          </template>
        </a-table-column>
      </a-table>
      <div class="pagination-wrapper">
        <pagination
          v-model:current="search.pageNum"
          size="small"
          :total="logTotal"
          :page-size="search.pageSize"
          @change="getSnapshotList"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import { defineComponent, reactive, toRefs, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { CalendarOutlined } from '@ant-design/icons-vue'

  export default defineComponent({
    name: 'SnapshotList',
    components: {
      CalendarOutlined,
    },
    props: {
      snapshotTmplType: {
        type: String,
        required: true,
      },
      snapshotDataId: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const router = useRouter()

      const state = reactive({
        logData: [],
        logLoading: false,
        logTotal: 0,
        snapshotComponent: '', // 快照模板
        snapshotData: {},
        search: {
          snapshotTmplType: props.snapshotTmplType,
          snapshotDataId: props.snapshotDataId,
          pageNum: 1,
          pageSize: 30,
          startTime: null,
          endTime: null,
        },
        dates: [],
        datesValue: null,
      })

      watch(
        () => props.snapshotDataId,
        (snapshotDataId) => {
          if (snapshotDataId) {
            state.search.pageNum = 1
            state.search.startTime = null
            state.search.endTime = null
            state.datesValue = null
            state.search.snapshotDataId = snapshotDataId
            getSnapshotList()
          }
        },
        { immediate: true }
      )
      /**
       * @description: 禁用日期
       * @param {*} endDate 结束日期
       */
      function disabledDate(endDate) {
        if (!state.dates || state.dates.length === 0) {
          return false
        }

        const diffDate = endDate.diff(state.dates[0], 'days')
        return Math.abs(diffDate) > 180
      }
      /**
       * @description: 日期选择是否打开
       * @param {*} open 日期选择打开状态
       */
      function handleOpenChange(open) {
        if (open) {
          state.dates = []
        }
      }
      /**
       * @description: 日期改变
       * @param {*} val 日期数组
       * @param {*} dateArray 格式化日期数组
       */
      function handleChangeData(val, dateArray) {
        state.datesValue = val
        state.search.startTime = dateArray[0]
          ? new Date(dateArray[0]).getTime()
          : null
        state.search.endTime = dateArray[1]
          ? new Date(`${dateArray[1]} 23:59:59`).getTime()
          : null

        state.search.pageNum = 1
        getSnapshotList()
      }
      /**
       * @description: 待选日期发生变化的回调
       * @param {*} val 待选日期
       */
      function handleCalendarChange(val) {
        state.dates = val
      }

      /**
       * @description: 获取日志列表
       */
      async function getSnapshotList() {
        state.logLoading = true
        try {
          const { data, total } = await snapshotList(state.search)
          state.logData = data
          state.logTotal = total
          state.logLoading = false
        } catch (error) {
          state.logLoading = false
        }
      }
      /**
       * @description: 点击快照id
       * @param {String} snapshotId 快照id
       */
      function handleClickSnapshotId(snapshotId) {
        const routeLink = router.resolve(
          `/snapshot-details?snapshotId=${snapshotId}`
        )
        window.open(routeLink.href)
      }

      return {
        ...toRefs(state),
        handleChangeData,
        getSnapshotList,
        disabledDate,
        handleOpenChange,
        handleCalendarChange,
        handleClickSnapshotId,
        dayjs,
      }
    },
  })
</script>

<style lang="less" scoped>
  .snapshot-list-wrapper {
    border-top: 1px solid #f0f0f0;
    .range-picker-wrapper {
      padding: 17px 0;
    }
    .table-wrapper {
      max-width: 670px;
    }
    .pagination-wrapper {
      padding-top: 18px;
      text-align: right;
    }
    :deep(.ant-table-thead > tr > th) {
      background-color: #fafafa;
      padding: 9px;
    }
  }
  :deep(.ant-calendar-picker) {
    width: 224px;
  }
</style>
