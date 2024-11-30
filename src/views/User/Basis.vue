<script setup lang="ts">
import { ref } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';

const userInfo = ref({
  fullName: '张三',
  documentType: '身份证',
  documentID: '1234567890',
  phonenumber: '13812345678',
  introduction: '这是用户的个人简介。',
  registTime: '2024-01-01 12:00:00',
  lastModified: '2024-01-20 10:30:00',
});

// 模拟提交的函数
const submitForm = () => {
  ElMessage.success('信息修改成功！');
};
</script>

<template>
  <div class="user-info-container">
    <h1 class="page-title">用户信息</h1>
    <el-form ref="form" label-width="100px" class="user-info-form">
      <!-- 姓名 -->
      <el-form-item label="姓名">
        <el-input v-model="userInfo.fullName" :disabled="true" class="input-field"></el-input>
      </el-form-item>

      <!-- 证件类型 -->
      <el-form-item label="证件类型">
        <el-input v-model="userInfo.documentType" :disabled="true" class="input-field"></el-input>
      </el-form-item>

      <!-- 证件号 -->
      <el-form-item label="证件号">
        <el-input v-model="userInfo.documentID" :disabled="true" class="input-field"></el-input>
      </el-form-item>

      <!-- 电话 -->
      <el-form-item label="电话">
        <el-input v-model="userInfo.phonenumber" class="input-field"></el-input>
      </el-form-item>

      <!-- 简介 -->
      <el-form-item label="简介">
        <el-input type="textarea" v-model="userInfo.introduction" class="input-field"></el-input>
      </el-form-item>
      
      <!-- 提交按钮 -->
      <el-form-item class="submit-button">
        <el-button type="primary" @click="submitForm">确认修改</el-button>
      </el-form-item>
    </el-form>

    <!-- 注册时间和最后修改时间 -->
    <div class="form-item">
      <div class="time-info">
        <small class="time-left">注册时间：{{ userInfo.registTime }}</small>
        <small class="time-right">最后修改时间：{{ userInfo.lastModified }}</small>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-info-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column; /* 确保按钮容器能继承 */
  align-items: center; /* 居中对齐 */
}

.page-title {
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.user-info-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 90%;
  max-width: 500px; /* 设置最大宽度 */
}

.el-form-item {
  margin-bottom: 20px;
}

.input-field {
  max-width: 85%; /* 让输入框根据父容器的宽度自适应 */
  width: 100%; /* 确保输入框填满父容器 */
}

.submit-button {
  display: flex;
  justify-content: center; /* 居中显示提交按钮 */
  width: 100%; /* 确保按钮宽度占满整个容器 */
}

.time-info {
  display: flex;
  justify-content: space-between; /* 左右对齐 */
  margin-top: 10px;
  gap: 50px;
}

.time-left, .time-right {
  font-size: 12px;
  color: #999;
}

small {
  display: block;
}
</style>
