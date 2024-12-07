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

//表单数据校验规则
const rules = {
  NewPsw: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^(?=.*\d.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{6,}$/,
      message: '密码至少6位，包含至少两个数字，并且不能全为大写或小写字母',
      trigger: 'blur'
    },
  ],
  NewPswConfirm: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (!value) {
          callback(new Error('请再次输入密码'));
        } else if (value !== formData.value.NewPsw) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};

import { useRouter } from 'vue-router'
const router = useRouter()
import { passwordService } from '@/api/user'

// 使用 ref 来获取表单实例
const formRef = ref(null);

// 提交表单
const submitForm = async () => {
  // 使用 formRef 来触发表单验证
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 如果验证通过，提交表单
      passwordService({ OriginPsw: formData.value.OriginPsw, NewPsw: formData.value.NewPsw })
        .then(() => {
          ElMessage.success('密码更改成功，请重新登录');
          formData.value = {
            OriginPsw: '',
            NewPsw: '',
            NewPswConfirm: ''
          }
          router.push('/login');
        })
        .catch((err: any) => {
          ElMessage.error(`密码修改失败: ${err.message}`);
        });
    } else {
      // 如果验证失败，提示
      ElMessage.error('表单验证失败，请检查输入');
    }
  });
};
</script>

<template>
  <div class="user-info-container">
    <h1 class="page-title">修改登陆密码</h1>
    <el-form ref="formRef" label-width="100px" class="user-info-form" :model="formData" :rules="rules">

      <el-form-item label="原密码" prop="OriginPsw">
        <el-input v-model="formData.OriginPsw" placeholder="请输入旧密码" type="password" class="input-field"></el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="NewPsw">
        <el-input v-model="formData.NewPsw" placeholder="新密码不少于 6 位，必须含有两个数字，不能全大写/小写" type="password" class="input-field"></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="NewPswConfirm">
        <el-input v-model="formData.NewPswConfirm" placeholder="请再次确认新密码" type="password" class="input-field"></el-input>
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
  max-width: 500px;
  /* 设置最大宽度 */
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
  max-width: 100%;
  /* 让输入框根据父容器的宽度自适应 */
  width: 100%;
  /* 确保输入框填满父容器 */
}


.time-info {
  display: flex;
  justify-content: space-between;
  /* 左右对齐 */
  margin-top: 10px;
  gap: 50px;
}

.time-left,
.time-right {
  font-size: 12px;
  color: #999;
}

small {
  display: block;
}
</style>