// 导入请求工具
import request from '@/util/request'

// 查询全部助力
export const supportListService = (
    params:{ promoteID: number }
) => {
    const result = request.get('/support/list', {params})
    // console.log("查询全部助力：", result )
    return result;
};

// 查询我的助力
export const viewMyService = () => {
    return request.get('/support/listmy');
};

// 发布助力申请
export const createSupportService = (
    support: Record<string, any>
): Promise<any> => {
    const result = request.put('/support/create', support)
    console.log("发布助力申请：", result )
    return result;
}

// 接受/拒绝助力申请
export const operateService = ( Data: Record<string, any> ) => {
    const params = new URLSearchParams();
    for (const key in Data) {
      if (Object.prototype.hasOwnProperty.call(Data, key)) {
        params.append(key, Data[key]);
      }
    }
    console.log("params:", params)
        
    return request.put('/support/operate', params);
}
