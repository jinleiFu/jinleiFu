<template>
  <a-pagination :show-total="(total) => `共 ${total} 条`" v-bind="$attrs" />
</template>

<script>
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'Pagination',
    setup() {
      return {}
    },
  })
</script>
<style lang="less" scoped>
  :deep(.ant-pagination-total-text) {
    color: rgba(0, 0, 0, 0.65);
  }
</style>
