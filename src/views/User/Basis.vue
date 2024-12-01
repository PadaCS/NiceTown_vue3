<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';

    // ———————————————————————————————————————————————————————————
    // ——————————————————————数据回显相关功能——————————————————————
    // ———————————————————————————————————————————————————————————
    import { userInfoService } from '@/api/user'
    import type { User } from '@/Types/types'
    const userInfo = ref<User>({
        userID: 0,
        username: '',
        userType: '',
        fullName: '',
        documentType: '',
        documentID: '',
        phonenumber: '',
        introduction: '',
        registTime: '',
        lastModified: ''
    });
    
    const getUserInfo = async () => {
        let result = await userInfoService()
        userInfo.value = result.data as User;
        formData.value = {
            phoneNumber: userInfo.value.phonenumber,
            introduction: userInfo.value.introduction
        };
        return result.data;
    }

    // ——————————————————————格式化时间——————————————————————
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };
    const formatDateImpl = ()=>{
        userInfo.value.registTime = formatDate(userInfo.value.registTime);
        userInfo.value.lastModified = formatDate(userInfo.value.lastModified);
    }

    // ——————————————————————修改用户简介和电话——————————————————————
    //定义数据模型
    const formData = ref({
        phoneNumber: '',
        introduction: ''
    });
    
    import { useUserStore } from '@/stores/UserStore';
    const userStore = useUserStore()
    import { updateService } from '@/api/user'
    const submitForm = async () => {
        await updateService({phonenumber: formData.value.phoneNumber,introduction: formData.value.introduction})
        ElMessage.success('信息修改成功！');
        userStore.setUser(await getUserInfo())
        console.log("pinia的用户信息：", userStore.user)
        formatDateImpl()
    };

    // ——————————————————————生命周期函数——————————————————————
    onMounted(async () => {
        await getUserInfo()
        formatDateImpl()
    });
</script>

<template>
  <div class="user-info-container">
    <h1 class="page-title">用户信息</h1>
    <el-form ref="form" label-width="100px" class="user-info-form" :model="formData">

      <el-form-item label="姓名">
        <el-input v-model="userInfo.fullName" :disabled="true" class="input-field"></el-input>
      </el-form-item>

      <el-form-item label="证件类型">
        <el-input v-model="userInfo.documentType" :disabled="true" class="input-field"></el-input>
      </el-form-item>

      <el-form-item label="证件号">
        <el-input v-model="userInfo.documentID" :disabled="true" class="input-field"></el-input>
      </el-form-item>

      <el-form-item label="电话">
        <el-input v-model="formData.phoneNumber" class="input-field"></el-input>
      </el-form-item>

      <el-form-item label="简介">
        <el-input
            type="textarea"
            v-model="formData.introduction"
            placeholder="请输入简介"
            class="input-field"
        ></el-input>
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
//   display: flex;
//   flex-direction: column; /* 确保按钮容器能继承 */
//   align-items: center; /* 居中对齐 */
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
  width: 80%;
  max-width: 500px; /* 设置最大宽度 */
//   align-items: center;
}

// .submit-button {
//   display: flex;
//   justify-content: center; /* 居中显示提交按钮 */
//   width: auto; /* 确保按钮宽度占满整个容器 */
// }

.el-form-item {
  margin-bottom: 20px;
}

.input-field {
  max-width: 100%; /* 让输入框根据父容器的宽度自适应 */
  width: 100%; /* 确保输入框填满父容器 */
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
