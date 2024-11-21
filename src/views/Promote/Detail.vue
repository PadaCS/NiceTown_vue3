<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // 导入useRouter

// 假设的数据结构
const promoteDetails = ref({
    theme: "宣传主题示例",
    promoter: "张三",
    promoteType: "特色小吃",
    createTime: "2024-11-21",
    lastModified: "2024-11-22",
    townFullName: "示例乡镇",
    description: "这是宣传内容的文本，介绍了这个乡镇的特色，旅游资源和文化。",
    images: [
        "https://nice-town.oss-cn-beijing.aliyuncs.com/26a6b3ff-bad6-4598-a7cf-7b99dcbc334f.jpg",
        "https://nice-town.oss-cn-beijing.aliyuncs.com/17614c08-e4ed-46a9-9ad4-bf90cda4070a.jpg"
    ],
    videos: [
        "https://nice-town.oss-cn-beijing.aliyuncs.com/57bec72b-1d5d-4109-83a4-ea188e2034f9.mp4",
        "https://nice-town.oss-cn-beijing.aliyuncs.com/839539e3-5b54-40ca-b9a0-39497bb8a8e3.mp4"
    ],
    supportInfo: [
        { user: '李四', time: '2024-11-22', amount: 100 },
        { user: '王五', time: '2024-11-23', amount: 50 }
    ]
});

const router = useRouter(); // 获取router实例

const handleSupport = () => {
    // 这里可以触发一个请求到后端，进行助力操作
    console.log('用户进行助力');
};

const goBack = () => {
    // 跳转到/promote页面
    router.push('/promote');
};

onMounted(() => {
    // 这里可以请求接口来获取数据
});
</script>

<template>
    <div class="promote-detail-container">
        <!-- 返回按钮 -->
        <button class="back-btn" @click="goBack">← 返回</button>

        <!-- 第一行，展示宣传主题 -->
        <h1>宣传主题：{{ promoteDetails.theme }}</h1>

        <!-- 第二行，显示发布人、宣传类型、发布时间、编辑时间 -->
        <div class="details-row">
            <span>发布人：{{ promoteDetails.promoter }}</span>
            <span>宣传类型：{{ promoteDetails.promoteType }}</span>
            <span>发布时间：{{ promoteDetails.createTime }}</span>
            <span>编辑时间：{{ promoteDetails.lastModified }}</span>
        </div>

        <!-- 第三行，显示宣传乡镇 -->
        <div class="town-row">
            <span>宣传乡镇：{{ promoteDetails.townFullName }}</span>
        </div>

        <!-- 展示宣传的文本内容 -->
        <div class="content-container">
            <p>{{ promoteDetails.description }}</p>
        </div>

        <!-- 展示图片和视频 -->
        <div class="media-container">
            <div class="images-container">
                <h2>图片展示</h2>
                <div v-for="(image, index) in promoteDetails.images" :key="index" class="image-item">
                    <img :src="image" alt="宣传图片" class="media-image"/>
                </div>
            </div>

            <div class="videos-container">
                <h2>视频展示</h2>
                <div v-for="(video, index) in promoteDetails.videos" :key="index" class="video-item">
                    <video :src="video" controls class="media-video"></video>
                </div>
            </div>
        </div>

        <!-- 助力情况区域 -->
        <div class="support-container">
            <h2 class="support-title">助力情况</h2>
            <div class="support-info">
                <div class="support-item" v-for="(support, index) in promoteDetails.supportInfo" :key="index">
                    <p>用户：{{ support.user }} | 时间：{{ support.time }} | 助力金额：{{ support.amount }} 元</p>
                </div>
            </div>
            <!-- 我要助力按钮 -->
            <button class="support-btn" @click="handleSupport">我要助力</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.promote-detail-container {
    padding: 20px;
    font-family: Arial, sans-serif;
}

h1 {
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
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.image-item {
    width: 200px;
    height: 150px;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.media-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    margin-top: 40px;
    padding: 20px;
    background-color: #f4f4f4;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.support-title {
    font-size: 20px;
    text-align: center;
    margin-bottom: 20px;
}

.support-info {
    margin-bottom: 20px;
}

.support-item {
    font-size: 14px;
    margin-bottom: 10px;
    color: #333;
}

.support-btn {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
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
</style>
