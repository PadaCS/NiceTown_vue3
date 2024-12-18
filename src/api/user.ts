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
export const findUserByIDService = (ID:number[]) => {
  // 手动格式化查询参数
  const params = new URLSearchParams();
  ID.forEach(id => params.append('userID', id.toString()));
  return request.get('/user/get', {params});
  // return request.get('/user/get', {params:{userID: ID}} )
}


// ———————————————————————————————————————————————————
// ——————————————————获取用户详细信息——————————————————
// ———————————————————————————————————————————————————
export const userInfoService = () => {
  return request.get('/user/userinfo');
}

// ———————————————————————————————————————————————————
// ————————————————————修改用户信息————————————————————
// ———————————————————————————————————————————————————
export const updateService = (
  params:{phonenumber: string, introduction: string}
): Promise<any> => {
  // console.log("发送PUT请求的userInfo参数：" + params.introduction + params.phonenumber)
  return request.put('/user/update', params);
}

// ———————————————————————————————————————————————————
// ————————————————————修改登陆密码————————————————————
// ———————————————————————————————————————————————————
export const passwordService = (
  params:{OriginPsw: string, NewPsw: string}
): Promise<any> => {
  console.log("发送PUT请求的userInfo参数：" + params.OriginPsw + params.NewPsw)
  return request.put('/user/changePsw', params);
}
