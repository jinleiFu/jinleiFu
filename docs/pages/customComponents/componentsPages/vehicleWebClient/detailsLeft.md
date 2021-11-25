---
prev:
  text: DetailsLayout 详情布局
  link: ./detailsLayout.md
next:
  text: DetailsRight 详情右侧
  link: ./detailsRight.md
---

## 说明
该组件用于详情左侧
<div style="height:600px;">
  <details-layout>
    <details-left
      title="车辆管理"
      :current="search.pageNum"
      :total="total"
      :pageSize="search.pageSize"
    >
    <template #header>
      <a-button type="primary" size="large" @click="handleAddVehicle">
        新增
      </a-button>
    </template>
    <template #search>
      <a-input-search
        v-model:value="search.vehiclePlateNo"
        placeholder="车牌号"
        style="width: 253px"
        @search="handleSearch"
      />
      <a-select
        v-model:value="vehicleTeamName"
        show-search
        allow-clear
        placeholder="车队名"
        :options="vehicleTeamNameOpt"
        style="width: 241px; margin-left: 12px"
      />
    </template>
    </details-left>
  </details-layout>
</div>


<script>
  import { message } from 'ant-design-vue';
  import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
  export default defineComponent({
    setup(_, { emit }) {
      // 数据源
      const state = reactive({
        total: 0,
        carList: [],
        vehicleTeamName: undefined, //车队名称
        vehicleTeamNameOpt: [
          {
          value: 'vehicleTeam1',
          label: '酷酷的服务站1',
          },
          {
          value: 'vehicleTeam2',
          label: '酷酷的服务站2',
          },
        ], //车队名称集合
        search: {
          pageNum: 1,
          pageSize: 30,
          vehiclePlateNo: '',
          agencyId: '', //车队id
        },
      })

      /**
       * @description: 搜索号码号牌
       */
      function handleSearch() {
        message.info(`搜索${state.search.vehiclePlateNo}`);      
      }


      /**
       * @description: 点击添加车辆
       */
      function handleAddVehicle() {
        message.info('点击添加车辆');      
      }

      return {
        ...toRefs(state),
        handleAddVehicle,
        handleSearch
      }
    },
  })
</script>
<style lang="less" scoped>
  :deep(.ant-btn-lg) {
    height: 30px;
    padding: 4px 22px;
    font-size: 14px;
    border-radius: 2px;
  }
</style>

::: details 点击查看代码
```vue
<div style="height:600px;">
  <details-layout>
    <details-left
      title="车辆管理"
      :current="search.pageNum"
      :total="total"
      :pageSize="search.pageSize"
    >
    <template #header>
      <a-button type="primary" size="large" @click="handleAddVehicle">
        新增
      </a-button>
    </template>
    <template #search>
      <a-input-search
        v-model:value="search.vehiclePlateNo"
        placeholder="车牌号"
        style="width: 253px"
        @search="handleSearch"
      />
      <a-select
        v-model:value="vehicleTeamName"
        show-search
        allow-clear
        placeholder="车队名"
        :options="vehicleTeamNameOpt"
        style="width: 241px; margin-left: 12px"
      />
    </template>
    </details-left>
  </details-layout>
</div>


<script>
  import { message } from 'ant-design-vue';
  import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
  export default defineComponent({
    setup(_, { emit }) {
      // 数据源
      const state = reactive({
        total: 0,
        carList: [],
        vehicleTeamName: undefined, //车队名称
        vehicleTeamNameOpt: [
          {
          value: 'vehicleTeam1',
          label: '酷酷的服务站1',
          },
          {
          value: 'vehicleTeam2',
          label: '酷酷的服务站2',
          },
        ], //车队名称集合
        search: {
          pageNum: 1,
          pageSize: 30,
          vehiclePlateNo: '',
          agencyId: '', //车队id
        },
      })

      /**
       * @description: 搜索号码号牌
       */
      function handleSearch() {
        message.info(`搜索${state.search.vehiclePlateNo}`);      
      }


      /**
       * @description: 点击添加车辆
       */
      function handleAddVehicle() {
        message.info('点击添加车辆');      
      }

      return {
        ...toRefs(state),
        handleAddVehicle,
        handleSearch
      }
    },
  })
</script>
```
:::

## API


**Props**

| 参数           | 说明         | 类型    | 默认值 |
| -------------- | ------------ | ------- | ------ |
| title          | 标题（必填） | String  |        |
| current        | 当前页码     | Number  |        |
| pageSize       | 每页大小     | Number  | 默认30 |
| total          | 总数         | Number  |        |
| showPagination | 是否显示分页 | Boolean | true   |
| showSearch     | 是否显示搜索 | Boolean | true   |

**Events**

| 名称         | 说明       | 参数     |
| ------------ | ---------- | -------- |
| onpagechange | 翻页时触发 | 当前页码 |