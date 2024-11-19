<script setup lang="ts">
import { ref } from 'vue';
import { User, Lock,  } from '@element-plus/icons-vue'
import { RouterLink, RouterView } from 'vue-router'

const isRegister = ref(false);

//定义数据模型
const registerData = ref({
    username:'',
    password:'',
    rePassword:''
})


</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" offset="3" class="form">
            <!-- 注册表单 -->
             <el-form ref="form" size="large" autocomplete="off" v-if="isRegister">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item>
                    <el-input :prefix-icon="User" placehplder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input :prefix-icon="Lock" placehplder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input :prefix-icon="Lock" placehplder="再次输入密码以确认"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input :prefix-icon="User" placehplder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input :prefix-icon="User" placehplder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input :prefix-icon="User" placehplder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input :prefix-icon="User" placehplder="请输入姓名"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space>注册</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false">返回</el-link>    
                </el-form-item>
             </el-form>


            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-else>
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item>
                    <el-input :prefix-icon="User" placehplder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input name="password" :prefix-icon="Lock" type="password" placehplder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space>登录</el-button>
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
