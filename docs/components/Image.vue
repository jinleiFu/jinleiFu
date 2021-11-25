<template>
  <a-image v-bind="$attrs" :src="url" />
</template>

<script>
  // import { qiniuFileUrl } from '@/api/qiniu.js'

  import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
  export default defineComponent({
    name: 'Image',
    props: {
      src: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const state = reactive({
        url: '',
      })

      // onBeforeMount(async () => {
      //   if (_isUrl(props.src)) {
      //     state.url = props.src
      //     return
      //   }
      //   const { data } = await qiniuFileUrl(props.src)
      //   state.url = data
      // })

      /**
       * @description: 判断是否为http/https的url
       * @param {String} str
       */
      function _isUrl(str) {
        return ['http', 'https'].some((item) => str.indexOf(item) === 0)
      }

      return {
        ...toRefs(state),
      }
    },
  })
</script>

<style lang="less" scoped></style>
