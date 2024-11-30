import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Support } from '@/Types/types'

  //第一个参数是名字，唯一性
  //第二个参数是函数，内部可以自定义状态的所有内容

export const useSupportStore = defineStore('support', () => {

  //定义状态的内容

  //1. 响应式变量
  const support = ref<Support | null>(null);
  const fromPage = ref('');
  //2. 定义一个函数用来修改Support的值
  const setSupport = (newSupport:any) => {
    support.value = newSupport
    console.log('PiniaSupport:', support.value);
  }
  const setfromPage = (newFromPage:any) => {
    fromPage.value = newFromPage
    console.log('fromPage:', fromPage.value);
  }

  //3. 函数 用于移除Support的值
  const removeSupport = ()=>{
    console.log('pinia中的Support已被移除');
    support.value = null
  }
  const removeFromPage = ()=>{
    console.log('pinia中的fromPage已被移除');
    fromPage.value = ''
  }

  return { support, setSupport, removeSupport, fromPage, setfromPage, removeFromPage }
})
