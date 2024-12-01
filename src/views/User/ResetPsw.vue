<script setup lang="ts">
    import { ref } from 'vue';
    import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';

    // ——————————————————————修改登陆密码——————————————————————
    //定义数据模型
    const formData = ref({
        OriginPsw: '',
        NewPsw: '',
        NewPswConfirm: ''
    });
    
    import { useRouter } from 'vue-router'
    const router = useRouter()
    import { passwordService } from '@/api/user'
    const submitForm = async () => {
        await passwordService({OriginPsw: formData.value.OriginPsw, NewPsw: formData.value.NewPsw})
        ElMessage.success('密码更改成功，请重新登录');
        formData.value = {
            OriginPsw: '',
            NewPsw: '',
            NewPswConfirm: ''
        }
        router.push('/login')
    };
    
</script>

<template>
  <div class="user-info-container">
    <h1 class="page-title">修改登陆密码</h1>
    <el-form ref="form" label-width="100px" class="user-info-form" :model="formData">

      <el-form-item label="原密码">
        <el-input v-model="formData.OriginPsw" 
            placeholder="请输入旧密码" 
            class="input-field"
        ></el-input>
      </el-form-item>

      <el-form-item label="新密码">
        <el-input v-model="formData.NewPsw" 
            placeholder="新密码不少于 6 位，必须含有两个数字，不能全大写/小写" 
            class="input-field"
        ></el-input>
      </el-form-item>

      <el-form-item label="确认密码">
        <el-input v-model="formData.NewPswConfirm" placeholder="请再次确认新密码" class="input-field"></el-input>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item class="submit-button">
        <el-button type="primary" @click="submitForm">确认修改</el-button>
      </el-form-item>
    </el-form>
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