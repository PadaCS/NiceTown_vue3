import request from '@/util/request'

// ———————————————————————————————————————————————————
// ——————————————————————注册接口——————————————————————
// ———————————————————————————————————————————————————
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


// ———————————————————————————————————————————————————
// ——————————————————————登录接口——————————————————————
// ———————————————————————————————————————————————————
export const userLoginService = (loginData: Record<string, any>): Promise<any> => {
  // 借助于 URLSearchParams 完成传递
  console.log("我点击了登录按钮")
  const params = new URLSearchParams();
  for (const key in loginData) {
    if (Object.prototype.hasOwnProperty.call(loginData, key)) {
      params.append(key, loginData[key]);
    }
  }

  // 返回 POST 请求
  return request.post('/user/login', params);
};

// ———————————————————————————————————————————————————
// —————————————————————获取用户名—————————————————————
// ———————————————————————————————————————————————————
export const findUserByIDService = (ID:number) => {
  console.log("我找我找我找，你是谁！！！")
  return request.get('/user/get', {params:{userID: ID}} )
}