<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Edit, Delete } from '@element-plus/icons-vue'

import { useRouter } from 'vue-router';
const router = useRouter(); // 获取router实例


// ————————————————————————————————————————————————————
// ——————————————————————数据回显———————————————————————
// ————————————————————————————————————————————————————

const onlyAccepted = ref(false)
const viewAccepted = ()=> {
    onlyAccepted.value = true
}
const viewAll = ()=> {
    onlyAccepted.value = false
}

// ——————————————————————助力情况回显——————————————————————
import { viewMyService } from '@/api/support'
import type { Support } from '@/Types/types';
const supportInfo = ref<Support[]>([])
// 从后端获取support
const getSupport = async () => {
    // @ts-ignore
    let result = await viewMyService();
    console.log("查询全部助力：", result.data)
    supportInfo.value = result.data
    console.log("supportInfo.value：", supportInfo.value)
}

import { findPromoteByIDService } from '@/api/promote'
// 将supports处理成我们要看到的显示形式
const handleSupportData = async () => {
    const promoteIDs = supportInfo.value.map(support => support.promoteID);

    // 并行处理两个异步请求
    const promoteResult = await findPromoteByIDService(promoteIDs)
    const promoteData = promoteResult.data;

    // 更新 supportInfo 的 promoteTheme 和 user
    supportInfo.value.forEach((support) => {
        const matchedPromote = promoteData.find((promote: any) => promote.promoteID === support.promoteID);
        if (matchedPromote) {
            support.promoteTheme = matchedPromote.theme;
        }
        support.user = '我';
    });
};

const statusMap = {
    0: "待接受",
    1: "同意",
    2: "拒绝",
    3: "取消"
};

import { computed } from 'vue';
// 显示为中文（并过滤出已接受助力）。回显时调用这个filteredSupportInfo变量
const filteredSupportInfo = computed(() => {
    if(onlyAccepted.value == true){
        return supportInfo.value
        .filter(support => support.status == 1)
        .map(support => ({
            ...support,
            statusString: statusMap[support.status as keyof typeof statusMap]  // 添加 statusString 字段
        }));
    }else{
        return supportInfo.value
        .map(support => ({
            ...support,
            statusString: statusMap[support.status as keyof typeof statusMap]  // 添加 statusString 字段
        }));
    }
});

onMounted(async () => {
    await getSupport();
    if (supportInfo.value.length > 0) {
        await handleSupportData();
    }
});


// ————————————————————————————————————————————————————
// ——————————————————————助力操作———————————————————————
// ————————————————————————————————————————————————————

// ——————————————————————删除助力——————————————————————
import { ElMessageBox, ElMessage } from 'element-plus';
import { deleteService } from '@/api/support'
const deleteSupport = async (supportID: number, event: any) => {
    event.stopPropagation();  // 阻止触发行点击事件
    console.log("row:", supportID)
    // 弹出确认框
    await ElMessageBox.confirm(
        '确定要删除这条助力申请吗？',
        '操作确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info',
        }
    );

    await deleteService({ supportID: supportID })
    await getSupport();
    if (supportInfo.value.length > 0) {
        await handleSupportData();
    }

    ElMessage.success('操作成功')
}


// ——————————————————————展示助力详情——————————————————————
import { useSupportStore } from '@/stores/SupportStore';
const supportStore = useSupportStore()
import { usePromoteStore } from '@/stores/PromoteStore';
const promoteStore = usePromoteStore()
const showDetails = (row: any) => {
    promoteStore.setStatus(false)
    console.log("点击的行数据：", row)
    supportStore.setSupport(row)
    supportStore.setfromPage('/support')
    // 页面跳转
    router.push('/supportDetail')
}


// ——————————————————————编辑助力——————————————————————
import { ElDrawer } from 'element-plus';
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
//添加表单数据模型
const SupportModel = ref({
    supportID: '',
    promoteID: '',
    supDescrip: '',
    images: '',
    videos: '',
    promoteTheme: ''
})
// ——————————————重置表单数据——————————————
const resetSupportModel = () => {
    SupportModel.value = {
        supportID: '',
        promoteID: '',
        supDescrip: '',
        images: '',
        videos: '',
        promoteTheme: ''
    };
};


// 初始化文件列表
const imageFileList = ref<Array<{ url: string }>>([]) // 图片文件列表
const videoFileList = ref<Array<{ url: string }>>([]) // 视频文件列表

const visibleEdit = ref(false)
const editSupport = async (row: any, event: any) => {
    event.stopPropagation();  // 阻止触发行点击事件
    visibleEdit.value = true

    // 数据初始化
    console.log("点击的行数据：", row)
    SupportModel.value = row
    console.log("SupportModel.value:", SupportModel.value)

    // ——————————————这两个列表是用来回显的——————————————
    // 初始化图片文件列表
    if (SupportModel.value.images) {
        console.log("\nSupportModel.value.images:", SupportModel.value.images)
        imageFileList.value = SupportModel.value.images.split(',').map(url => ({
            url: url,  // 直接使用 URL 作为唯一标识
        }))
        console.log("\nimageFileList.value:", imageFileList.value)
    }
    // 初始化视频文件列表
    if (SupportModel.value.videos) {
        console.log("\nSupportModel.value.videos:", SupportModel.value.videos)
        videoFileList.value = SupportModel.value.videos.split(',').map(url => ({
            url: url,  // 直接使用 URL 作为唯一标识
        }))
        console.log("\nvideoFileList.value:", videoFileList.value)
    }

    console.log("\nEditSupportModel:", SupportModel.value)
}

// 定义 updatePromote 函数
import { updateSupportService } from '@/api/support'
const updateSupport = async () => {
    console.log("SupportModel.value：" + SupportModel.value)
    await updateSupportService(SupportModel.value)
    ElMessage.success('修改成功')
    visibleEdit.value = false
    resetSupportModel()
}


// ———————————————————————————————————————————————————————————
// —————————————————————————文件上传功能———————————————————————
// ———————————————————————————————————————————————————————————
import { useTokenStore } from '@/stores/tokenStore';
const tokenStore = useTokenStore()

// —————————————————————————图片上传—————————————————————————
const beforeImageUpload = (file: any) => {
    const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    const isLt50MB = file.size / 1024 / 1024 < 50;

    if (!isType) {
        ElMessage.error('上传图片只能是 JPG/PNG/GIF 格式!');
    }
    if (!isLt50MB) {
        ElMessage.error('上传图片大小不能超过 50MB!');
    }
    return isType && isLt50MB;
}

const uploadImageSuccess = (result: any) => {
    if (SupportModel.value.images) {
        // 如果已有图片，则在前面加逗号
        SupportModel.value.images += `, ${result.data}`;
    } else {
        // 如果是第一个上传的图片，直接赋值
        SupportModel.value.images = result.data;
    }
    ElMessage.success('上传成功')
    console.log("上传图片：" + result.data + "\nSupportModel.value.images:" + SupportModel.value.images);
}

// —————————————————————————视频上传—————————————————————————
const beforeVideoUpload = (file: any) => {
    const isType = file.type === 'video/mp4';
    const isLt50MB = file.size / 1024 / 1024 < 50;

    if (!isType) {
        ElMessage.error('上传视频只能是 MP4 格式!');
    }
    if (!isLt50MB) {
        ElMessage.error('上传视频大小不能超过 50MB!');
    }
    return isType && isLt50MB;
}

const uploadVideoSuccess = (result: any) => {
    if (SupportModel.value.videos) {
        // 如果已有视频，则在前面加逗号
        SupportModel.value.videos += `, ${result.data}`;
    } else {
        // 如果是第一个上传的视频，直接赋值
        SupportModel.value.videos = result.data;
    }
    ElMessage.success('上传成功')
    console.log("上传视频：" + result.data + "\nSupportModel.value.videos:" + SupportModel.value.videos);
}

// —————————————————————————文件删除—————————————————————————
const handleImgRemove = (file: any) => {
    console.log("删除的文件：", file);
    // const removedFileUrl = file.response?.data; // 获取被删除的文件链接
    let removedFileUrl = ''
    if (file.response?.data === undefined) {
        removedFileUrl = file.url
    } else {

        removedFileUrl = file.response?.data
    }
    console.log("\nremovedFileUrl", removedFileUrl);
    if (!removedFileUrl) return;// 如果啥也没删除就直接return

    // 拆分当前图片列表字符串为数组
    let imagesArray = SupportModel.value.images.split(',');
    console.log("\n拆分当前图片列表字符串为数组imagesArray", imagesArray);

    // 从数组中删除被移除的链接
    imagesArray = imagesArray.filter(url => url !== removedFileUrl);
    console.log("\n从数组中删除被移除的链接imagesArray", imagesArray);

    // 重新组合图片链接字符串
    SupportModel.value.images = imagesArray.join(',');

    ElMessage.info('图片已删除');
    console.log("剩余图片链接：" + SupportModel.value.images);
}

const handleVideoRemove = (file: any) => {
    console.log("删除的文件：", file);
    // const removedFileUrl = file.response?.data; // 获取被删除的文件链接
    let removedFileUrl = ''
    if (file.response?.data === undefined) {
        removedFileUrl = file.url
    } else {

        removedFileUrl = file.response?.data
    }
    console.log("\nremovedFileUrl", removedFileUrl);
    if (!removedFileUrl) return;

    // 拆分当前视频列表字符串为数组
    let videosArray = SupportModel.value.videos.split(',');

    // 从数组中删除被移除的链接
    videosArray = videosArray.filter(url => url !== removedFileUrl);

    // 重新组合视频链接字符串
    SupportModel.value.videos = videosArray.join(',');

    ElMessage.info('视频已删除');
    console.log("剩余视频链接：" + SupportModel.value.videos);
}
</script>

<template>
    <!-- 助力情况区域 -->
    <div class="support-container">

        <!-- ——————————————————————顶部—————————————————————— -->
        <div class="header">
            <h2 class="support-title">我发布的全部助力</h2>
            <div class="extra">
                <el-button class="accepted-button" type="primary" @click="viewAll" v-if="onlyAccepted">查看全部</el-button>
                <el-button class="accepted-button" type="primary" @click="viewAccepted" v-else>仅已接受</el-button>
            </div>
        </div>


        <!-- ——————————————————————助力列表—————————————————————— -->
        <el-table :data="filteredSupportInfo" style="width: 100%" @row-click="showDetails" class="supportList">
            <el-table-column label="序号" width="100" type="index" theme> </el-table-column>
            <el-table-column label="发布者" prop="user"></el-table-column>
            <el-table-column label="被助力宣传" prop="promoteTheme"></el-table-column>
            <el-table-column label="状态" prop="statusString"></el-table-column>
            <!-- 编辑/删除操作 -->
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <div v-if="row.status == 0">
                        <el-button :icon="Edit" circle plain type="primary"
                            @click="editSupport(row, $event)"></el-button>
                        <el-button :icon="Delete" circle plain type="danger"
                            @click="deleteSupport(row.supportID, $event)"></el-button>
                    </div>
                    <div v-else-if="row.status == 1">
                        助力成功
                    </div>
                    <div v-else-if="row.status == 2">
                        已被拒绝
                    </div>
                    <div v-else-if="row.status == 3">
                        已取消
                    </div>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="还没有发布过助力哦" />
            </template>
        </el-table>

        <!-- ——————————————————————抽屉—————————————————————— -->
        <el-drawer v-model="visibleEdit" title="编辑助力申请" direction="rtl" size="50%">
            <!-- 发布助力表单 -->
            <el-form :model="SupportModel" label-width="100px">
                <el-form-item label="助力宣传：">
                    <el-input :disabled="true" v-model="SupportModel.promoteTheme" placeholder="请输入宣传主题"></el-input>
                </el-form-item>
                <el-form-item label="助力描述：">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="SupportModel.supDescrip" contentType="html">
                        </quill-editor>
                    </div>
                </el-form-item>
                <!-- 上传图片功能 -->
                <el-form-item label="请上传图片">
                    <!-- 
                        action: 服务器接口路径
                        name: 上传文件的字段名
                        on-success: 上传成功的回调函数
                        list-type：设置文件列表的样式
                    -->
                    <el-upload class="avatar-uploader" :multiple="true" :auto-upload="true"
                        :before-upload="beforeImageUpload" action="/api/upload" list-type="picture-card" name="file"
                        :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadImageSuccess"
                        :on-remove="handleVideoRemove" v-model:file-list="imageFileList">
                        <el-icon class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                        <template #tip>
                            <div class="el-upload__tip">仅支持 jpg/png/gif 文件，且不超过 50MB</div>
                        </template>
                    </el-upload>
                </el-form-item>

                <!-- 上传/视频功能 -->
                <el-form-item label="请上传视频">
                    <!-- 
                        action: 服务器接口路径
                        name: 上传文件的字段名
                        on-success: 上传成功的回调函数
                        list-type：设置文件列表的样式
                    -->
                    <el-upload class="avatar-uploader" :multiple="true" :auto-upload="true"
                        :before-upload="beforeVideoUpload" action="/api/upload" name="file"
                        :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadVideoSuccess"
                        :on-remove="handleImgRemove" v-model:file-list="videoFileList">
                        <el-icon class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                        <template #tip>
                            <div class="el-upload__tip">仅支持 mp4 文件，且不超过 50MB</div>
                        </template>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="updateSupport">发布</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>


    </div>
</template>

<style lang="scss" scoped>
/* 抽屉样式 */
.avatar-uploader {
    display: flex;
    flex-direction: column;
    align-items: center;

    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}

.support-container {
    display: flex;
    flex-direction: column;
    // justify-content: center; /* 垂直居中 */
    align-items: center;
    /* 水平居中 */
    height: 80vh;
    /* 使其占满整个屏幕高度 */
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    /* 当内容超出时显示滚动条 */
}
.support-container {
    display: flex;
    flex-direction: column;
    align-items: center;  /* 水平居中 */
    height: 80vh;         /* 使其占满整个屏幕高度 */
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow-y: auto;     /* 当内容超出时显示滚动条 */
}

.header {
    display: flex;              /* 使用 flex 布局 */
    justify-content: space-between; /* 确保标题和按钮分布两端 */
    align-items: center;        /* 垂直居中 */
    width: 100%;                /* 占满父容器宽度 */
    margin-bottom: 20px;        /* 设置底部间距 */
}

.support-title {
    text-align: center;         /* 居中文本 */
    font-size: 28px;            /* 增大字体 */
    font-weight: 700;           /* 加粗 */
    color: #333;                /* 基础深灰色 */
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1); /* 文字阴影，增加层次感 */
    letter-spacing: 1px;        /* 字间距 */
    line-height: 1.5;           /* 行高 */
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    flex: 1;                    /* 占据剩余空间，确保按钮靠右 */
}

.extra {
    display: flex;              /* 使用 flex 布局 */
    justify-content: flex-end;  /* 将按钮内容右对齐 */
    margin-top: 10px;
}

.el-button {
    font-size: 14px;            /* 调整按钮字体 */
    padding: 6px 20px;          /* 设置按钮内边距 */
    margin-left: 10px;          /* 设置按钮间距 */
    border-radius: 4px;         /* 增加按钮圆角 */
    transition: all 0.3s ease;  /* 添加平滑过渡效果 */
}

.el-button[type="primary"] {
    background-color: #409EFF; /* 主按钮背景色 */
    border-color: #409EFF;     /* 主按钮边框色 */
    color: white;              /* 字体颜色为白色 */
}

.el-button[type="primary"]:hover {
    background-color: #66b1ff; /* 按钮悬停时的背景色 */
    border-color: #66b1ff;     /* 悬停时的边框颜色 */
}

.accepted-button {
    font-size: 14px;            /* 调整按钮字体 */
    padding: 6px 20px;          /* 设置按钮内边距 */
    border-radius: 4px;         /* 增加按钮圆角 */
    transition: all 0.3s ease;  /* 平滑过渡效果 */
}

.accepted-button[type="primary"] {
    background-color: #409EFF; /* 主按钮背景色 */
    border-color: #409EFF;     /* 主按钮边框色 */
    color: white;              /* 字体颜色为白色 */
}

.accepted-button[type="primary"]:hover {
    background-color: #66b1ff; /* 悬停时的背景色 */
    border-color: #66b1ff;     /* 悬停时的边框颜色 */
}


</style>