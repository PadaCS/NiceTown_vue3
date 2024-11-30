<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    const router = useRouter(); // 获取router实例

    // ————————————————————————————————————————————————————
    // —————————————————————数据初始化——————————————————————
    // ————————————————————————————————————————————————————
    import { usePromoteStore } from '@/stores/PromoteStore'
    const promoteStore = usePromoteStore()
    const isPromoter = ref(promoteStore.isPromoter)
    console.log("isPromoter:" + isPromoter.value)
    
    const isSupporter = ref(false)
    import { useUserStore } from '@/stores/UserStore';
    const userStore = useUserStore()
    onMounted(() => {
        console.log("userStore.user?.userID:", userStore.user?.userID)
        console.log("supportDetails.value.userID:", supportDetails.value.userID)
        if(userStore.user?.userID === supportDetails.value.userID){
            isSupporter.value = true;
            console.log("isSupporter:" + isSupporter.value)
        }
    });
    
    import { useSupportStore } from '@/stores/SupportStore';
    const supportStore = useSupportStore()
    const goBack = () => {
        // 跳转到上一个页面
        supportStore.removeSupport();
        router.push(supportStore.fromPage);
        supportStore.removeFromPage();
    };
    // ———————————————————————————————————————————————————————————
    // ————————————————————————助力内容回显————————————————————————
    // ———————————————————————————————————————————————————————————
    
    // 这个页面永远显示的是pinia里存储的promote信息

    import type { Support } from '@/Types/types'
    const data = supportStore.support as Support;
    const supportDetails = ref({
        ...data, // 展开 data 对象，自动设置大部分属性
        createTime: data.createTime?.split('T')[0], // 提取日期部分
        lastModified: data.lastModified?.split('T')[0],
        images: data.images ? data.images.split(',').map(img => img.trim()) : [],
        videos: data.videos ? data.videos.split(',').map(vid => vid.trim()) : [],
        });
    
    // ———————————————————————————————————————————————————————————
    // ————————————————————接受/拒绝/删除助力申请———————————————————
    // ———————————————————————————————————————————————————————————
    import { ElMessageBox, ElMessage } from 'element-plus';
    import { operateService, deleteService } from '@/api/support'
    const acceptSupport = async () => {
        operateSupport(1)
        supportDetails.value.statusString = '同意'
    }
    const denySupport = async () => {
        operateSupport(2)
        supportDetails.value.statusString = '拒绝'
    }

    const deleteSupport = async () => {
        operateSupport(3)
    }

    const operateSupport = async (ope:number) => { 
        console.log("supportID:", supportDetails.value.supportID)
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

        if(ope === 3){
            await deleteService({supportID: supportDetails.value.supportID})
            goBack()
        }
        else{
            await operateService({promoteID: supportDetails.value.promoteID, supportID: supportDetails.value.supportID, operation: ope})
            supportDetails.value.status = ope
        }

        ElMessage.success('操作成功')
    }


    
</script>

<template>
    <div class="promote-detail-container">
        <!-- 返回按钮 -->
        <button class="back-btn" @click="goBack">← 返回</button>

        <!-- 第一行，展示助力的宣传主题 -->
        <h1>"{{ supportDetails.promoteTheme }}"的助力详情</h1>

        <!-- 第二行，显示发布人、发布时间、编辑时间 -->
        <div class="details-row">
            <span>发布人：{{ supportDetails.user }}</span>
            <span>状态：{{ supportDetails.statusString }}</span>
            <span>发布时间：{{ supportDetails.createTime }}</span>
            <span>编辑时间：{{ supportDetails.lastModified }}</span>
        </div>

        <!-- 展示助力的文本内容 -->
        <div class="content-container">
            <p v-html="supportDetails.supDescrip"></p>
        </div>

        <!-- 展示图片和视频 -->
        <div class="images-container" v-if="supportDetails.images.length > 0">
            <h2 class="image-title">图片展示</h2>
            <div class="images-wrapper">
                <div v-for="(image, index) in supportDetails.images" :key="index" class="image-item">
                    <img :src="image" alt="宣传图片" class="media-image"/>
                </div>
            </div>


            <div class="videos-container" v-if="supportDetails.videos.length > 0">
                <h2>宣传视频</h2>
                <div v-for="(video, index) in supportDetails.videos" :key="index" class="video-item">
                    <video :src="video" controls class="media-video"></video>
                </div>
            </div>
        </div>
    </div>

    <div class="operation" v-if="supportDetails.status === 0">
        <button v-if="isPromoter === true" class="ope-button" @click="acceptSupport">接收</button>
        <button v-if="isPromoter === true" class="ope-button" @click="denySupport">拒绝</button>
        <button v-if="isSupporter === true" class="ope-button" @click="deleteSupport">删除</button>
    </div>
    
</template>


<style lang="scss" scoped>
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
        background-color: #546f71;
    }

    .operation {
        display: flex;             /* 使用 Flex 布局 */
        justify-content: center;   /* 居中排列 */
        gap: 20px;                 /* 按钮之间的间距，自适应调整 */
        margin-top: 20px;          /* 添加顶部间距（可根据需求调整） */
    }

    .ope-button { 
        padding: 10px 20px;        /* 调整按钮内边距 */
        background-color: #b2cacc;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s;  /* 平滑过渡效果 */
    }

    .ope-button:hover {
        background-color: #546f71;
    }


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

</style>
