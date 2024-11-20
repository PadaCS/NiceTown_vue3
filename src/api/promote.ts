// 导入请求工具
import request from '@/util/request'

// 查询全部宣传
export const promoteListService = (
    params:{ pageNum: number; pageSize: number; promoteType?: string }
) => {
  return request.get('/promote/list', {params});
};

// 查询我的宣传
export const viewMyService = (
  params:{ pageNum: number; pageSize: number; promoteType?: string }
) => {
return request.get('/promote/listmy', {params});
};

// 根据乡镇id匹配乡镇数据
export const townListService = (
  townIDs: number[]
) => {
  return request.post('/promote/town', townIDs);
}
