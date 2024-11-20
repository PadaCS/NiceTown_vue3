// 导入pinia
import { useTokenStore } from '@/stores/token';

// 导入请求工具
import request from '@/util/request'

// Promote 数据类型
export interface Promote {
  promoteID: number;
  promotterID: number;
  townID: number;
  promoteType: string;
  theme: string;
  description: string;
  images: string;
  videos: string;
  createTime: string;
  lastModified: string;
  status: number;
}


// 后端返回的数据格式
export interface PromoteListResponse {
  code: number;
  message: string;
  data: {
    total: number;
    items: Promote[];
  };
}

// 提供调用注册接口的函数
export const promoteListService = (
    params:{ pageNum: number; pageSize: number; promoteType?: string }
) => {
    const tokenStore = useTokenStore()
    const token = tokenStore.token
    // 返回 GET 请求
  return request.get('/promote/list', {headers:{'Authorization':token}, params});
};