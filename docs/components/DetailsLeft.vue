<template>
  <div class="details-left-wrapper">
    <div class="header">
      <div class="title">{{ title }}</div>
      <slot name="header"></slot>
    </div>
    <div v-if="showSearch" class="search">
      <slot name="search"></slot>
    </div>
    <div class="car-list">
      <slot>
        <div class="empty-content">
          <a-empty
            image="/empty_images/empty_simple.png"
            :image-style="{
              width: '190px',
              height: '190px',
            }"
          >
            <template #description>
              <span style="font-size: 18px; color: #8c8c8c">暂无数据</span>
            </template>
          </a-empty>
        </div>
      </slot>
    </div>
    <pagination
      v-if="showPagination"
      :current="current"
      :style="{ margin: '18px auto 0' }"
      :total="total"
      size="small"
      :page-size="pageSize"
      @change="handlePaginationChange"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'DetailsLeft',
    props: {
      current: Number,
      pageSize: Number,
      total: Number,
      showPagination: {
        type: Boolean,
        default: true,
      },
      showSearch: {
        type: Boolean,
        default: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
    setup(_, { emit }) {
      /**
       * @description: 翻页
       * @param {*} page 当前页
       */
      function handlePaginationChange(page) {
        emit('onpagechange', page)
      }

      return {
        handlePaginationChange,
      }
    },
  })
</script>

<style lang="less" scoped>
  .details-left-wrapper {
    height: 100%;
    padding: 18px 0;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    flex-shrink: 0;
    margin-right: 30px;
    border-radius: 2px;
  }
  .header,
  .search {
    padding: 0 18px 14px;
  }
  .header {
    display: flex;
    align-items: center;
    // padding-bottom: 18px;
    .title {
      padding: 0 16px 0 14px;
      font-size: 22px;
      font-weight: 500;
      color: #303133;
      line-height: 30px;
      position: relative;
      &::before {
        content: '';
        display: block;
        position: absolute;
        width: 6px;
        height: 22px;
        background: #007aff;
        border-radius: 1px;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }
  }
  .car-list {
    width: 506px;
    padding: 4px 18px 18px;
    flex: 1;
    overflow-y: auto;
    position: relative;
    box-sizing: content-box;
    .empty-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
