<template>
  <div class="details-right-wrapper">
    <div v-if="isEmpty" class="empty-content">
      <a-empty
        image="/empty_images/empty.png"
        :image-style="{
          width: '311px',
          height: '290px',
        }"
      >
        <template #description>
          <span style="font-size: 18px; color: #8c8c8c">先从左侧选择</span>
        </template>
      </a-empty>
    </div>
    <template v-else>
      <div class="header">
        <h2 class="title">{{ title }}</h2>
        <slot name="header"></slot>
      </div>
      <slot></slot>
    </template>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'DetailsRight',
    props: {
      isEmpty: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },

    setup() {
      return {}
    },
  })
</script>

<style lang="less" scoped>
  .details-right-wrapper {
    flex: 1;
    position: relative;
    padding: 18px;
    overflow-y: auto;
    background-color: #fff;
    border-radius: 2px;
    .empty-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .header {
      display: flex;
      align-items: center;
      padding-bottom: 18px;
      .title {
        font-size: 20px;
        color: #303133;
        margin: 0;
      }
      .title::before {
        content: ' ';
        width: 6px;
        height: 22px;
        background: #007aff;
        display: inline-block;
        vertical-align: -4px;
        margin-right: 6px;
        border-radius: 1px;
      }
    }
  }
</style>
