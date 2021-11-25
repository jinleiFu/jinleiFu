<template>
  <div class="area-container">
    <a-cascader
      v-model:value="address"
      class="form-ipt"
      :options="addressOpt"
      placeholder="请选择省市区"
      v-bind="$attrs"
      @change="addressChange"
    />
  </div>
</template>

<script>

  import {
    defineComponent,
    reactive,
    toRefs,
    onMounted,
    watchEffect,
  } from 'vue'
  export default defineComponent({
    props: {
      code: [Number, String],
    },

    setup(props, { emit }) {
      const state = reactive({
        addressOpt: [], // 省市区数据
        address: [], //选中的省市区
        cityCode: '', //子节点code
      })

      onMounted(() => {
        // 获取省市区数据
        // cityCodeSearch().then((res) => {
        //   if (res.data && res.data.length) {
        //     res.data.forEach((item) => {
        //       item.value = item.cityCode
        //       item.label = item.cityName
        //       if (item.children && item.children.length) {
        //         item.children.forEach((citem) => {
        //           citem.value = citem.cityCode
        //           citem.label = citem.cityName
        //           if (citem.children && citem.children.length) {
        //             citem.children.forEach((ditem) => {
        //               ditem.value = ditem.cityCode
        //               ditem.label = ditem.cityName
        //             })
        //           }
        //         })
        //       }
        //     })
        //   }
        //   state.addressOpt = res.data
        // })
      })

      // 将选中的省市区传给父组件
      const addressChange = (val) => {
        emit('onChooseAddress', val)
      }

      // 根据子节点code查询对应的分支
      const getCityCodeSearchParents = () => {
        cityCodeSearchParents(state.cityCode).then((res) => {
          getCityCodeAll(res.data, state.address, 'code')
        })
      }

      // watchEffect(() => {
      //   if (props.code) {
      //     state.cityCode = props.code
      //     getCityCodeSearchParents()
      //   } else {
      //     state.address = []
      //   }
      // })

      return {
        ...toRefs(state),
        addressChange,
        getCityCodeSearchParents,
      }
    },
  })
</script>

<style lang="less"></style>
