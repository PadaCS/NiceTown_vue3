<script setup lang="ts">
    import { ref } from 'vue';
    import { User, Lock, Avatar, PhoneFilled, Postcard } from '@element-plus/icons-vue'
    import { ElMessage } from 'element-plus';

    const isRegister = ref(false);

    //定义数据模型
    const registerData = ref({
        username:'',
        password:'',
        rePassword:'',
        FullName:'',
        DocumentType:'',
        DocumentID:'',
        phoneNumber:'',
    })

    const loginData = ref({
        username:'',
        password:'',
    })

    //表单数据校验规则
    const rules = {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { max: 10, message: '用户名过长', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { 
                pattern: /^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{6,}$/, 
                message: '密码至少6位，包含至少两个数字，并且不能全为大写或小写字母', 
                trigger: 'blur' 
            },
        ],
        rePassword: [
            { required: true, message: '请确认密码', trigger: 'blur' },
            {
                validator: (rule: any, value: string, callback: Function) => {
                    if (!value) {
                        callback(new Error('请再次输入密码'));
                    } else if (value !== registerData.value.password) {
                        callback(new Error('两次输入的密码不一致'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur',
            },
        ],
        FullName: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        DocumentType: [
            { required: true, message: '请选择证件类型', trigger: 'blur' },
        ],
        DocumentID: [
            { required: true, message: '请输入证件号码', trigger: 'blur' },
        ],
        phoneNumber: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { 
                pattern: /^\d{11}$/, 
                message: '手机号码必须为11位数字', 
                trigger: 'blur' 
            },
        ],
    };


    const loginrules = {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
        ],
    };


    //调用后台接口注册
    import {userRegisterService, userLoginService} from '@/api/user'

    const register = async()=>{
        let result = await userRegisterService(registerData.value);
        ElMessage.success(result.msg?result.msg:'注册成功')
    }

    //路由用
    import { useRouter } from 'vue-router'
    const router = useRouter()
    //调用后台接口登录
    const login = async()=>{
        let result = await userLoginService(loginData.value);
        ElMessage.success(result.msg?result.msg:'登录成功');
        router.push('/')
    }

</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" offset="3" class="form">
            <!-- 注册表单 -->
             <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" placeholder="再次输入密码以确认" v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <el-form-item prop="FullName">
                    <el-input :prefix-icon="Avatar" placeholder="请输入姓名" v-model="registerData.FullName"></el-input>
                </el-form-item>
                <el-form-item prop="DocumentType">
                    <el-input :prefix-icon="Postcard" placeholder="请选择证件类型" v-model="registerData.DocumentType"></el-input>
                </el-form-item >
                <el-form-item prop="DocumentID">
                    <el-input :prefix-icon="Postcard" placeholder="请输入证件号码" v-model="registerData.DocumentID"></el-input>
                </el-form-item>
                <el-form-item prop="phoneNumber">
                    <el-input :prefix-icon="PhoneFilled" placeholder="请输入手机号码" v-model="registerData.phoneNumber"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">注册</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false">返回</el-link>    
                </el-form-item>
             </el-form>


            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="loginData" :rules="loginrules">
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="loginData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
                </el-form-item>
                <el-form-item  class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true">注册</el-link>    
                </el-form-item>
             </el-form>


        </el-col>
    </el-row>

</template>

<style scoped>
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/cover.png') no-repeat 60% center / 240px auto;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}

</style>
