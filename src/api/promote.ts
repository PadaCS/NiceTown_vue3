// 导入请求工具
import request from '@/util/request'

// 提供调用注册接口的函数
export const promoteListService = (
    params:{ pageNum: number; pageSize: number; promoteType?: string }
) => {
    // 返回 GET 请求
  return request.get('/promote/list', {params});
};