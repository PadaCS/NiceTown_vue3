import { ref } from 'vue'
import { defineStore } from 'pinia'

  //第一个参数是名字，唯一性
  //第二个参数是函数，内部可以自定义状态的所有内容

export const usePromoteStore = defineStore('promote', () => {

  //定义状态的内容

  //1. 响应式变量
  const promote = ref('')
  //2. 定义一个函数用来修改token的值
  const setPromote = (newPromote:any) => {
    promote.value = newPromote
    // console.log('PiniaPromote:', promote.value);
  }

  //3. 函数 用于移除promote的值
  const removePromote = ()=>{
    console.log('pinia中的Promote已被移除');
    promote.value = ''
  }

  const isPromoter = ref()
  const setStatus = (status:boolean) => {
    isPromoter.value = status
  }
  const removeStatus = ()=>{
    isPromoter.value = ''
  }
  return { promote, setPromote, removePromote, isPromoter, setStatus, removeStatus }
}


)
