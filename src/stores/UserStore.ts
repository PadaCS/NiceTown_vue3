import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/Types/types'

  //第一个参数是名字，唯一性
  //第二个参数是函数，内部可以自定义状态的所有内容

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  //2. 定义一个函数用来修改token的值
  const setUser = (newUser:User) => {
    console.log("User set in pinia:", newUser)
    user.value = newUser
  }

  //3. 函数 用于移除token的值

  const removeUser = ()=>{
    user.value = null
  }

  return { user, setUser, removeUser }
},
{
  // @ts-ignore 报错报错报你妈呢，语法检查给你关了
  persist: true
})
