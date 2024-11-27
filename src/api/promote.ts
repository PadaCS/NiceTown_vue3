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

// 删除宣传
export const deleteService = (
  promoteID: number
) => {
  return request.put('/promote/delete', {promoteID});
}

// 发布宣传
export const createPromoteService = (
  promote: Record<string, any>
): Promise<any> => {
  // console.log("发送PUT请求的Promote参数：" + promote)
  return request.put('/promote/create', promote)
}

// 根据宣传id匹配宣传数据
export const findPromoteByIDService = (
  promoteID: number[]
) => {
  // 手动格式化查询参数
  const params = new URLSearchParams();
  promoteID.forEach(id => params.append('promoteID', id.toString()));
  // console.log("请求参数:", params.toString());  // 确保参数格式正确
  return request.get('/promote/find', {params});
}
