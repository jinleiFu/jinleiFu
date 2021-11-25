<template>
  <div class="details-layout">
    <slot></slot>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'DetailsLayout',
  })
</script>

<style lang="less" scoped>
  .details-layout {
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
</style>
