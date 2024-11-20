// 导入请求工具
import request from '@/util/request'

// 提供调用list接口的函数
export const promoteListService = (
    params:{ pageNum: number; pageSize: number; promoteType?: string }
) => {
    // 返回 GET 请求
  return request.get('/promote/list', {params});
};

// 提供调用匹配乡镇接口的函数
export const townListService = (
  townIDs: number[]
) => {
  return request.post('/promote/town', townIDs);
}

// 提供调用listmy接口的函数
export const viewMyService = (
  params:{ pageNum: number; pageSize: number; promoteType?: string }
) => {
  // 返回 GET 请求
return request.get('/promote/listmy', {params});
};