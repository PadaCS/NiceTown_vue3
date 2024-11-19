//定制请求实例

// 导入 axios 和 AxiosInstance、AxiosResponse 类型
import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';

// 定义公共前缀 baseURL
const baseURL: string = '/api';

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL,
});

// 添加响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    //判断业务状态码
    if(response.data.code === 0){
      // 返回响应数据
      return response.data;
    }

    //操作失败
    ElMessage.error(response.data.msg?response.data.msg:'服务异常')
    return Promise.reject(response.data);
  },
  (error) => {
    // 错误处理
    ElMessage.error('服务异常');
    // 返回一个失败的 Promise
    return Promise.reject(error);
  }
);

export default instance;
