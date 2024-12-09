<script setup lang="ts">
    import { ref } from 'vue'
    import { Edit, Delete } from '@element-plus/icons-vue'

    // ———————————————————————————————————————————————————————————
    // ——————————————————————分页展示相关功能——————————————————————
    // ———————————————————————————————————————————————————————————

    //分页条数据模型
    const pageNum = ref(1)//当前页
    const total = ref(20)//总条数
    const pageSize = ref(6)//每页条数

    //当每页条数发生了变化，调用此函数
    const onSizeChange = async (size: number) => {
        pageSize.value = size
        search()
    }
    //当前页码发生变化，调用此函数
    const onCurrentChange = (num: number) => {
        pageNum.value = num
        search()
    }

    // ———————————————————————————————————————————————————————————
    // ——————————————————————数据回显相关功能——————————————————————
    // ———————————————————————————————————————————————————————————

    import { promoteListService, townListService, viewMyService, deleteService, createPromoteService, updatePromoteService } from '@/api/promote'
    import type { Promote, Towns } from '@/Types/types'; // 定义 Promote 类型

    // 定义 promotes, towns, categorys 类型
    const promotes = ref<Promote[]>([]);
    const towns = ref<Towns[]>([])
    const categorys = ref([
        {
            id: 1,
            categoryName: "农家院"
        },
        {
            id: 2,
            categoryName: "自然风光秀丽"
        },
        {
            id: 3,
            categoryName: "古建筑"
        },
        {
            id: 4,
            categoryName: "土特产"
        },
        {
            id: 5,
            categoryName: "特色小吃"
        },
        {
            id: 6,
            categoryName: "民俗活动"
        }
    ]);

    //定义其它前置数据
    const isPromoter = ref(false)
    const categoryId = ref('')

    // 定义 getCategoryNameById 函数
    const getCategoryNameById = (id: any) => {
        const category = categorys.value.find((item) => item.id === id);
        return category?.categoryName;
    };

    // 定义 promoteList 函数
    const promoteList = async () => {
        console.log('promoteList被调用了')
        isPromoter.value = false;
        // 之后要写成带页码参数的形式
        let result = await promoteListService({ pageNum: pageNum.value, pageSize: pageSize.value, promoteType: getCategoryNameById(categoryId.value) });
        promotes.value = result.data.items || [];
        total.value = result.data.total || 0;

        // 调用 townList 获取 towns 数据
        if (promotes.value != null) {
            await townList();
        }

        // 为 promotes 添加 townFullName
        promotes.value.forEach((promote) => {
            const town = towns.value.find((t) => t.townID === promote.townID);
            promote.townFullName = town ? `${town.province}${town.city}${town.name}` : '未知乡镇';
        });

        clear()
    }
    promoteList()

    // 定义 townList 函数
    const townList = async () => {
        console.log('townList被调用了');

        // 提取 promotes.value 中的 townID 列表
        const townIDs = promotes.value.map((promote) => promote.townID);
        console.log('townIDs:', townIDs);

        // 调用 townListService 获取 towns 数据
        let result = await townListService(townIDs);
        towns.value = result.data || [];
        // let result
        // if(townIDs != null){
        //     result = await townListService(townIDs);
        //     towns.value = result.data || [];
        // }else{
        //     result = null
        // }
        console.log('towns:', towns.value);

    };

    // 定义 viewMy 函数
    const viewMy = async () => {
        console.log('viewMy被调用了')
        isPromoter.value = true;

        //清空一下数据
        clear()

        let result = await viewMyService({ pageNum: pageNum.value, pageSize: pageSize.value, promoteType: getCategoryNameById(categoryId.value) });

        promotes.value = result.data.items || [];
        total.value = result.data.total || 0;

        // 调用 townList 获取 towns 数据
        if (promotes.value != null) {
            await townList();
        }

        // 为 promotes 添加 townFullName
        promotes.value.forEach((promote) => {
            const town = towns.value.find((t) => t.townID === promote.townID);
            promote.townFullName = town ? `${town.province}${town.city}${town.name}` : '未知乡镇';
        });

        console.log('result:\n' + promotes.value)
    }

    // ———————————————————————————————————————————————————————————
    // ——————————————————————搜索栏相关功能——————————————————————
    // ———————————————————————————————————————————————————————————

    // 定义 search 函数
    const search = async () => {
        console.log('search被调用了\n')

        // 判断是否为"我的"页面
        if (isPromoter.value == false) {
            await promoteList()
        } else {
            await viewMy()
        }
    }

    const clear = () => {
        categoryId.value = ''
    }

    const reset = async () => {
        clear()
        // 判断是否为"我的"页面
        if (isPromoter.value == false) {
            await promoteList()
        } else {
            await viewMy()
        }
    }

    // ———————————————————————————————————————————————————————————
    // ——————————————————删除,编辑,发布宣传相关功能—————————————————
    // ———————————————————————————————————————————————————————————
    import { ElMessageBox, ElMessage } from 'element-plus';
    import { QuillEditor } from '@vueup/vue-quill'
    import '@vueup/vue-quill/dist/vue-quill.snow.css'

    // ——————————————————删除宣传功能——————————————————
    const deletePromote = async (promoteID: number, event:any) => {
        event.stopPropagation();  // 阻止触发行点击事件
        console.log("接收到的promoteID:" + promoteID)

        // 弹出确认框
        await ElMessageBox.confirm(
            '确定要删除这条宣传吗？',
            '删除确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        );

        await deleteService(promoteID);

        ElMessage.success('删除成功')
        await viewMy()
    }


    // ——————————————————发布宣传——————————————————
    import { Plus } from '@element-plus/icons-vue'
    //控制抽屉是否显示
    const visibleCreate = ref(false)
    const create = () => {
        visibleCreate.value = true
    }
    //添加表单数据模型
    const PromoteModel = ref({
        townID: '',//下拉选择框 "请选择您要宣传的城市"
        townFullName: '',//用来存乡镇全名
        promoteType: '',//下拉选择框 "请选择宣传类型"
        theme: '',//文字输入框 "请输入主题"
        description: '',//文字输入框 "请输入宣传内容"
        images: '',
        videos: ''
    })

    const allTowns = ref([
        {
            townID: 1,
            categoryName: "北京北京市海淀区"
        },
        {
            townID: 2,
            categoryName: "新疆乌鲁木齐米东区"
        },
        {
            townID: 3,
            categoryName: "贵州省贵阳市南明区"
        },
        {
            townID: 4,
            categoryName: "河北省秦皇岛市海港区"
        }
    ]);

    // 定义 createPromote 函数
    const createPromote = async() => {
        console.log("发送PUT请求的Promote参数：" + PromoteModel.value)
        await createPromoteService(PromoteModel.value)
        ElMessage.success('发布成功')
        visibleCreate.value = false
    }


    //——————————————————编辑宣传功能——————————————————
    // 初始化文件列表
    const imageFileList = ref<Array<{ url: string }>>([]) // 图片文件列表
    const videoFileList = ref<Array<{ url: string }>>([]) // 视频文件列表

    const visibleEdit = ref(false)
    const editPromote = async (row: any, event:any) => {
        event.stopPropagation();  // 阻止触发行点击事件
        visibleEdit.value = true

        // 数据初始化
        console.log("row:", row)
        PromoteModel.value = row
        console.log("PromoteModel.value:", PromoteModel.value)

        // ——————————————这两个列表是用来回显的——————————————
        // 初始化图片文件列表
        if (PromoteModel.value.images) {
            console.log("\nPromoteModel.value.images:", PromoteModel.value.images)
            imageFileList.value = PromoteModel.value.images.split(',').map(url => ({
                url: url,  // 直接使用 URL 作为唯一标识
            }))
            console.log("\nimageFileList.value:", imageFileList.value)
        }
        // 初始化视频文件列表
        if (PromoteModel.value.videos) {
            console.log("\nPromoteModel.value.videos:", PromoteModel.value.videos)
            videoFileList.value = PromoteModel.value.videos.split(',').map(url => ({
                url: url,  // 直接使用 URL 作为唯一标识
            }))
            console.log("\nvideoFileList.value:", videoFileList.value)
        }
        
        console.log("\nEditPromoteModel:", PromoteModel.value)   
    }

    // 定义 updatePromote 函数
    const updatePromote = async() => {
        console.log("PromoteModel.value：" + PromoteModel.value)
        await updatePromoteService(PromoteModel.value)
        ElMessage.success('修改成功')
        visibleEdit.value = false
        resetPromoteModel()
    }

    
    // ——————————————重置表单数据——————————————
    const resetPromoteModel = () => {
        PromoteModel.value = {
            townID: '',
            townFullName: '',
            promoteType: '', 
            theme: '', 
            description: '',
            images: '',
            videos: ''
        };
    };

    // ———————————————————————————————————————————————————————————
    // —————————————————————————文件上传功能———————————————————————
    // ———————————————————————————————————————————————————————————
    import { useTokenStore } from '@/stores/tokenStore';
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
        if (PromoteModel.value.images) {
            // 如果已有图片，则在前面加逗号
            PromoteModel.value.images += `, ${result.data}`;
        } else {
            // 如果是第一个上传的图片，直接赋值
            PromoteModel.value.images = result.data;
        }
        ElMessage.success('上传成功')
        console.log("上传图片：" + result.data + "\nPromoteModel.value.images:" + PromoteModel.value.images);
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
        if (PromoteModel.value.videos) {
            // 如果已有视频，则在前面加逗号
            PromoteModel.value.videos += `, ${result.data}`;
        } else {
            // 如果是第一个上传的视频，直接赋值
            PromoteModel.value.videos = result.data;
        }
        ElMessage.success('上传成功')
        console.log("上传视频：" + result.data + "\nPromoteModel.value.videos:" + PromoteModel.value.videos);
    }

    // —————————————————————————文件删除—————————————————————————
    const handleImgRemove = ( file: any )=>{
        console.log("删除的文件：", file); 
        // const removedFileUrl = file.response?.data; // 获取被删除的文件链接
        let removedFileUrl = ''
        if(file.response?.data === undefined){
            removedFileUrl = file.url
        }else{
            
            removedFileUrl = file.response?.data
        }
        console.log("\nremovedFileUrl", removedFileUrl); 
        if (!removedFileUrl) return;// 如果啥也没删除就直接return

        // 拆分当前图片列表字符串为数组
        let imagesArray = PromoteModel.value.images.split(',');
        console.log("\n拆分当前图片列表字符串为数组imagesArray", imagesArray); 

        // 从数组中删除被移除的链接
        imagesArray = imagesArray.filter(url => url !== removedFileUrl);
        console.log("\n从数组中删除被移除的链接imagesArray", imagesArray); 

        // 重新组合图片链接字符串
        PromoteModel.value.images = imagesArray.join(',');

        ElMessage.info('图片已删除');
        console.log("剩余图片链接：" + PromoteModel.value.images);
    }

    const handleVideoRemove = ( file: any )=>{
        console.log("删除的文件：", file); 
        // const removedFileUrl = file.response?.data; // 获取被删除的文件链接
        let removedFileUrl = ''
        if(file.response?.data === undefined){
            removedFileUrl = file.url
        }else{
            
            removedFileUrl = file.response?.data
        }
        console.log("\nremovedFileUrl", removedFileUrl); 
        if (!removedFileUrl) return;

        // 拆分当前视频列表字符串为数组
        let videosArray = PromoteModel.value.videos.split(',');

        // 从数组中删除被移除的链接
        videosArray = videosArray.filter(url => url !== removedFileUrl);

        // 重新组合视频链接字符串
        PromoteModel.value.videos = videosArray.join(',');

        ElMessage.info('视频已删除');
        console.log("剩余视频链接：" + PromoteModel.value.videos);
    }

    // ———————————————————————————————————————————————————————————
    // —————————————————————————详情页跳转———————————————————————
    // ———————————————————————————————————————————————————————————
    import { useRouter } from 'vue-router'
    const router = useRouter()
    import { usePromoteStore } from '@/stores/PromoteStore';
    const promoteStore = usePromoteStore()
    import { useUserStore } from '@/stores/UserStore';
    const userStore = useUserStore()

    const showDetails = (row: any)=>{
        // console.log("\nuserStore.userName：", userStore.user?.userID)
        // console.log("\nrow.promotterID：", row.promotterID)
        if(row.promotterID == userStore.user?.userID){
            isPromoter.value = true
        }
        promoteStore.setPromote(row)
        promoteStore.setStatus(isPromoter.value)
        console.log('点击的行数据:', row);
        // 页面跳转
        router.push('/promoteDetail')
    }


</script>

<template>
    <el-card class="page-container">
        <!-- ——————————————————————顶部—————————————————————— -->
        <template #header>
            <div class="header">
                <span>乡镇宣传</span>
                <div class="extra">
                    <el-button type="primary" @click="promoteList" v-if="isPromoter">查看全部</el-button>
                    <el-button type="primary" @click="viewMy" v-else>仅看我发布的</el-button>
                    <el-button type="primary" @click="create">发布宣传</el-button>
                </div>
            </div>
        </template>

        <!-- ——————————————————————搜索栏—————————————————————— -->
        <el-form inline>
            <el-form-item label="宣传类型：" class="type">
                <el-select placeholder="请选择" v-model="categoryId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button @click="reset">刷新</el-button>
            </el-form-item>
        </el-form>

        <!-- ——————————————————————宣传列表—————————————————————— -->
        <el-table :data="promotes" style="width: 100%" @row-click="showDetails">
            <el-table-column label="序号" width="100" type="index" theme> </el-table-column>
            <el-table-column label="主题" prop="theme"></el-table-column>
            <el-table-column label="乡镇" prop="townFullName"></el-table-column>
            <el-table-column label="类型" prop="promoteType"></el-table-column>
            <!-- 这一行只在查看我自己的宣传的时候显示 -->
            <el-table-column label="操作" width="100" v-if="isPromoter">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary"
                        @click="editPromote(row, $event)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger"
                        @click="deletePromote(row.promoteID, $event)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- ——————————————————————分页条—————————————————————— -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 6, 9]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />


        <!-- ——————————————————————发布宣传抽屉—————————————————————— -->
        <el-drawer v-model="visibleCreate" title="发布宣传" direction="rtl" size="50%" @close="resetPromoteModel">
            <!-- 发布宣传表单 -->
            <el-form :model="PromoteModel" label-width="100px">
                <el-form-item label="宣传主题">
                    <el-input v-model="PromoteModel.theme" placeholder="请输入宣传主题"></el-input>
                </el-form-item>
                <el-form-item label="宣传类型">
                    <el-select placeholder="请选择" v-model="PromoteModel.promoteType">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.categoryName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="乡镇地点">
                    <el-select placeholder="请选择" v-model="PromoteModel.townID">
                        <el-option v-for="c in allTowns" :key="c.townID" :label="c.categoryName" :value="c.townID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="宣传内容">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="PromoteModel.description" contentType="html">
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
                        :on-remove="handleImgRemove"
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
                        :on-remove="handleVideoRemove"
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
                    <el-button type="primary" @click="createPromote">发布</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>


        <!-- ——————————————————————编辑宣传抽屉—————————————————————— -->
        <el-drawer v-model="visibleEdit" title="编辑宣传" direction="rtl" size="50%" @close="resetPromoteModel">
            <!-- 发布宣传表单 -->
            <el-form :model="PromoteModel" label-width="100px">
                <el-form-item label="宣传主题">
                    <el-input v-model="PromoteModel.theme" placeholder="请输入宣传主题"></el-input>
                </el-form-item>
                <el-form-item label="宣传类型">
                    <el-select placeholder="请选择" v-model="PromoteModel.promoteType">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.categoryName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="乡镇地区">
                    <el-select placeholder="请选择" v-model="PromoteModel.townID">
                        <el-option v-for="c in allTowns" :key="c.townID" :label="c.categoryName" :value="c.townID">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="宣传内容">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="PromoteModel.description" contentType="html">
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
                        :on-remove="handleImgRemove"
                        v-model:file-list="imageFileList"
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
                        :on-remove="handleVideoRemove"
                        v-model:file-list="videoFileList"
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
                    <el-button type="primary" @click="updatePromote">确认修改</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>

</template>

<style lang="scss" scoped>
    .page-container {
        min-height: 100%;
        box-sizing: border-box;

        .type {
            min-width: 30dvh;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
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