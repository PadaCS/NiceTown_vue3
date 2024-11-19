//定制请求实例

//导入axios
import axios from 'axios';
import { error } from 'console';
//定义公共前缀，baseURL
const baseURL = 'http://localhost:8080';
const instance = axios.create(baseURL);


//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        return result.data;
    },
    err=>{
        alert('服务异常');
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;