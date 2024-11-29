<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    const router = useRouter(); // 获取router实例
    import { Close, Check } from '@element-plus/icons-vue';
    import { supportListService } from '@/api/support'
    import { findPromoteByIDService } from '@/api/promote'

    // ————————————————————————————————————————————————————
    // —————————————————————数据初始化——————————————————————
    // ————————————————————————————————————————————————————
    import { usePromoteStore } from '@/stores/Promote'
    const promoteStore = usePromoteStore()
    const isPromoter = ref(promoteStore.isPromoter)
    console.log("isPromoter:" + isPromoter.value)

    const goBack = () => {
        // 跳转到/promote页面
        promoteStore.removePromote();
        router.push('/promote');
    };
    
    // ———————————————————————————————————————————————————————————
    // ——————————————————————数据回显相关功能——————————————————————
    // ———————————————————————————————————————————————————————————
    
    // ——————————————————————宣传内容回显——————————————————————
    // 这个页面永远显示的是pinia里存储的promote信息

    const data = promoteStore.promote;
    const promoteDetails = ref({
        // @ts-ignore
        promoteID: data.promoteID,
        // @ts-ignore
        theme: data.theme,
        // @ts-ignore
        promoter: '', // 等下从后端获取
        // promoter: getUser(data.promotterID),
        // @ts-ignore
        promoteType: data.promoteType,
        // @ts-ignore
        createTime: data.createTime.split('T')[0], // 提取日期部分
        // @ts-ignore
        lastModified: data.lastModified.split('T')[0],
        // @ts-ignore
        townFullName: data.townFullName,
        // @ts-ignore
        description: data.description,
        // @ts-ignore
        images: data.images ? data.images.split(',').map(img => img.trim()) : [],
        // @ts-ignore
        videos: data.videos ? data.videos.split(',').map(vid => vid.trim()) : [],
        // supportInfo: [] // 可根据实际情况填充
    });

    // ——————————————————————用户名回显——————————————————————
    //把用户id改成用户名再回显
    import { findUserByIDService } from '@/api/user'
    const getUser = async(id:number) => {
        // 如果是自己发布的则显示 "我"
        if(isPromoter.value === true){
            console.log("isPromoter=== true", isPromoter.value)
            promoteDetails.value.promoter = '我'
            return
        }
        const userList:number[] = [id]
        const data = await findUserByIDService(userList)
        const userName = data.data[0]
        console.log("我查询了用户名，用户名是：", userName)
        promoteDetails.value.promoter = userName
        return userName
    }

    // ——————————————————————助力情况回显——————————————————————
    import type { Support } from '@/Types/types';
    const supportInfo = ref<Support[]>([])
    // 从后端获取support
    const getSupport = async() => {
        // @ts-ignore
        let result = await supportListService({promoteID: data.promoteID});
        console.log("查询全部助力：", result.data )
        supportInfo.value = result.data
    }
    
    // 将supports处理成我们要看到的显示形式
    const handleSupportData = async () => {
        const promoteIDs = supportInfo.value.map(support => support.promoteID);
        const userIDs = supportInfo.value.map(support => support.userID);

        // 并行处理两个异步请求
        const [promoteResult, userResult] = await Promise.all([
            findPromoteByIDService(promoteIDs),
            findUserByIDService(userIDs)
        ]);

        const promoteData = promoteResult.data;
        const userData = userResult.data;

        // 更新 supportInfo 的 promoteTheme 和 user
        supportInfo.value.forEach((support, index) => {
            const matchedPromote = promoteData.find((promote: any) => promote.promoteID === support.promoteID);
            if (matchedPromote) {
                support.promoteTheme = matchedPromote.theme;
            }
            support.user = userData[index];
        });
    };

    const statusMap = {
        0: "待接受",
        1: "同意",
        2: "拒绝",
        3: "取消"
    };

    import { computed } from 'vue';
    // 过滤掉已取消的助力并显示为中文。回显时调用这个filteredSupportInfo变量
    const filteredSupportInfo = computed(() => {
        return supportInfo.value
            .filter(support => support.status !== 3) // 过滤掉状态为 3 的记录
            .map(support => ({
                ...support,
                statusString: statusMap[support.status as keyof typeof statusMap]  // 添加 statusString 字段
            }));
    });

    onMounted(async () => {
        // @ts-ignore
        await getUser(data.promotterID);
        await getSupport();
        if(supportInfo.value.length > 0){
            await handleSupportData(); 
        }
    });

    // ———————————————————————————————————————————————————————————
    // ——————————————————————助力操作相关功能——————————————————————
    // ———————————————————————————————————————————————————————————

    // ——————————————————————发布助力申请——————————————————————
    import { ElDrawer } from 'element-plus';
    import { Plus } from '@element-plus/icons-vue'
    import { QuillEditor } from '@vueup/vue-quill'
    import '@vueup/vue-quill/dist/vue-quill.snow.css'
    //控制抽屉是否显示
    const visibleCreate = ref(false)
    const create = () => {
        visibleCreate.value = true
        console.log('用户进行助力');
    }
    //添加表单数据模型
    const SupportModel = ref({
        promoteID: '',
        supDescrip: '',//文字输入框 "请输入助力内容"
        images: '',
        videos: ''
    })

    import { createSupportService } from '@/api/support'
    const createSupport = async() => {
        SupportModel.value.promoteID = promoteDetails.value.promoteID
        console.log("发送PUT请求的Support参数：" + SupportModel.value)
        await createSupportService(SupportModel.value)
        ElMessage.success('发布成功')
        visibleCreate.value = false
        // 然后重新刷新一下页面
        await getSupport();
        await handleSupportData(); 
    }


    // ——————————————————————接受/拒绝助力申请——————————————————————
    import { ElMessageBox } from 'element-plus';
    import { operateService } from '@/api/support'
    const acceptSupport = async (supportID:number) => {
        operateSupport(supportID,1)
    }
    const denySupport = async (supportID:number) => {
        operateSupport(supportID,2)
    }

    const operateSupport = async (id:number, ope:number) => { 
        // 弹出确认框
        await ElMessageBox.confirm(
            '确定要接收/拒绝这条助力申请吗？',
            '操作确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'info',
            }
        );

        await operateService({promoteID: promoteDetails.value.promoteID, supportID: id, operation: ope})
        ElMessage.success('操作成功')

        // 然后重新刷新一下页面
        await getSupport();
        await handleSupportData(); 
    }

    // ———————————————————————————————————————————————————————————
    // —————————————————————————文件上传功能———————————————————————
    // ———————————————————————————————————————————————————————————
    import { ElMessage } from 'element-plus';
    import { useTokenStore } from '@/stores/token';
    const tokenStore = useTokenStore()

    // —————————————————————————图片上传—————————————————————————
    const beforeImageUpload = (file:any) => {
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

    const uploadImageSuccess = (result:any)=>{
        if (SupportModel.value.images) {
            // 如果已有图片，则在前面加逗号
            SupportModel.value.images += `, ${result.data}`;
        } else {
            // 如果是第一个上传的图片，直接赋值
            SupportModel.value.images = result.data;
        }
        ElMessage.success('上传成功')
        console.log("上传图片：" + result.data + "\SupportModel.value.images:" + SupportModel.value.images);
    }

    // —————————————————————————视频上传—————————————————————————
    const beforeVideoUpload = (file:any) => {
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

    const uploadVideoSuccess = (result:any)=>{
        if (SupportModel.value.videos) {
            // 如果已有视频，则在前面加逗号
            SupportModel.value.videos += `, ${result.data}`;
        } else {
            // 如果是第一个上传的视频，直接赋值
            SupportModel.value.videos = result.data;
        }
        ElMessage.success('上传成功')
        console.log("上传视频：" + result.data + "\SupportModel.value.videos:" + SupportModel.value.videos);
    }

</script>

<template>
    <div class="promote-detail-container">
        <!-- 返回按钮 -->
        <button class="back-btn" @click="goBack">← 返回</button>

        <!-- 第一行，展示宣传主题 -->
        <h1>{{ promoteDetails.theme }}</h1>

        <!-- 第二行，显示发布人、发布时间、编辑时间 -->
        <div class="details-row">
            <span>发布人：{{ promoteDetails.promoter }}</span>
            <span>发布时间：{{ promoteDetails.createTime }}</span>
            <span>编辑时间：{{ promoteDetails.lastModified }}</span>
        </div>

        <!-- 第三行，显示宣传乡镇、宣传类型 -->
        <div class="town-row">
            <span>{{ promoteDetails.townFullName }}</span>
            <span>类型：{{ promoteDetails.promoteType }}</span>
        </div>

        <!-- 展示宣传的文本内容 -->
        <div class="content-container">
            <p v-html="promoteDetails.description"></p>
        </div>

        <!-- 展示图片和视频 -->
        <div class="images-container" v-if="promoteDetails.images.length > 0">
            <h2 class="image-title">图片展示</h2>
            <div class="images-wrapper">
                <div v-for="(image, index) in promoteDetails.images" :key="index" class="image-item">
                    <img :src="image" alt="宣传图片" class="media-image"/>
                </div>
            </div>


            <div class="videos-container" v-if="promoteDetails.videos.length > 0">
                <h2>宣传视频</h2>
                <div v-for="(video, index) in promoteDetails.videos" :key="index" class="video-item">
                    <video :src="video" controls class="media-video"></video>
                </div>
            </div>
        </div>

        <!-- 助力情况区域 -->
        <div class="support-container">
            <h2 class="support-title">助力情况</h2>
            <!-- ——————————————————————助力列表—————————————————————— -->
            <el-table :data="filteredSupportInfo" style="width: 100%" @row-click="showDetails"class="supportList">
                <el-table-column label="序号" width="100" type="index" theme> </el-table-column>
                <el-table-column label="发布者" prop="user"></el-table-column>
                <el-table-column label="被助力宣传" prop="promoteTheme"></el-table-column>
                <el-table-column label="状态" prop="statusString"></el-table-column>
                <!-- 这一行只在查看我自己的宣传的时候显示 -->
                <el-table-column label="操作" width="100" v-if="isPromoter">
                    <template #default="{ row }">
                        <div v-if="row.status == 0">
                            <el-button :icon="Check" circle plain type="primary"
                                @click="acceptSupport(row.supportID)"></el-button>
                            <el-button :icon="Close" circle plain type="danger"
                                @click="denySupport(row.supportID)"></el-button>
                        </div>
                        <div v-else-if="row.status == 1">
                            助力成功
                        </div>
                        <div v-else-if="row.status == 2">
                            已被拒绝
                        </div>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有数据" />
                </template>
            </el-table>
            <!-- 我要助力按钮 -->
            <button class="support-btn" @click="create" v-if="!isPromoter">我要助力</button>
        </div>


        <!-- ——————————————————————抽屉—————————————————————— -->
        <el-drawer v-model="visibleCreate" title="发布助力申请" direction="rtl" size="50%">
            <!-- 发布助力表单 -->
            <el-form :model="SupportModel" label-width="100px">
                <el-form-item label="助力宣传：">
                    {{promoteDetails.theme}}
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
                    <el-upload 
                        class="avatar-uploader" 
                        :multiple="true"
                        :auto-upload="true" 
                        :before-upload="beforeImageUpload"
                        action="/api/upload"
                        list-type="picture-card"
                        name="file"
                        :headers="{'Authorization':tokenStore.token}"
                        :on-success="uploadImageSuccess"
                    >
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
                    <el-upload 
                        class="avatar-uploader" 
                        :multiple="true"
                        :auto-upload="true" 
                        :before-upload="beforeVideoUpload"
                        action="/api/upload"
                        name="file"
                        :headers="{'Authorization':tokenStore.token}"
                        :on-success="uploadVideoSuccess"
                    >
                        <el-icon class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                        <template #tip>
                            <div class="el-upload__tip">仅支持 mp4 文件，且不超过 50MB</div>
                        </template>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="createSupport">发布</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

    </div>
</template>

<style lang="scss" scoped>
    .promote-detail-container {
        padding: 20px;
        font-family: Arial, sans-serif;
    }

    h1 {
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    h2 {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .details-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 14px;
        color: #666;
    }

    .details-row span {
        margin-right: 10px;
    }

    .town-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        font-size: 16px;
        color: #444;
    }

    .content-container {
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #ddd;
        background-color: #f9f9f9;
        font-size: 16px;
        line-height: 1.5;
        color: #333;
    }

    .media-container {
        display: flex;
        flex-direction: column;
        gap: 20px;

    }
    .images-container {
        text-align: center; /* 标题居中 */
        margin-bottom: 20px; /* 与图片间距 */
    }

    .image-title {
        width: 100%; /* 标题占整行 */
        font-size: 24px;
        margin-bottom: 15px;
    }

    .images-wrapper {
        display: flex;
        justify-content: center; /* 图片居中 */
        flex-wrap: wrap; /* 超出换行 */
        gap: 15px; /* 图片之间的间距 */
    }

    .image-item {
        flex: 1 1 calc(33.33% - 30px); /* 最多每行三张 */
        max-width: 30%; /* 最大宽度为30% */
        box-sizing: border-box; /* 包括边距在内计算宽度 */
    }

    .media-image {
        width: 100%; /* 图片宽度占满容器 */
        height: auto; /* 保持图片比例 */
        border-radius: 8px; /* 可选，增加圆角 */
    }


    .videos-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .video-item {
        width: 100%;
        height: 200px;
    }

    .media-video {
        width: 100%;
        height: 100%;
    }

    /* 助力情况样式 */
    .support-container {
        display: flex;
        flex-direction: column; 
        align-items: center; 
        margin-top: 40px;
        padding: 20px;
        background-color: #f4f4f4;
        border-radius: 8px;
        // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .supportList {
        border-radius: 20px;
        background-color: #fcfcff;
    }
    .support-title {
        font-size: 20px;
        text-align: center;
        margin-bottom: 20px;
    }

    .support-btn {
        display: block;
        width: 60%;
        padding: 10px;
        margin: 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
    }

    .support-btn:hover {
        background-color: #45a049;
    }

    /* 返回按钮样式 */
    .back-btn {
        /*position: absolute;*/
        top: 20px;
        left: 20px;
        padding: 10px;
        background-color: #b2cacc;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }

    .back-btn:hover {
        background-color: #0056b3;
    }


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
</style>
