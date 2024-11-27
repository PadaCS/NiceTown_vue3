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