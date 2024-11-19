// 导入请求工具
import request from '@/util/request'

// 提供调用注册接口的函数
export const userRegisterService = (registerData: Record<string, any>): Promise<any> => {
  // 借助于 URLSearchParams 完成传递
  const params = new URLSearchParams();
  for (const key in registerData) {
    if (Object.prototype.hasOwnProperty.call(registerData, key)) {
      params.append(key, registerData[key]);
    }
  }

  // 返回 POST 请求
  return request.post('/user/register', params);
};
