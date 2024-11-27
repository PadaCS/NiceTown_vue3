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

    import { promoteListService, townListService, viewMyService, deleteService, createPromoteService } from '@/api/promote'
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

    //删除宣传功能
    const deletePromote = async (promoteID: number) => {

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
        images: '',//一个框上传图片或视频,最多五个
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

    // ———————————————————————————————————————————————————————————
    // —————————————————————————文件上传功能———————————————————————
    // ———————————————————————————————————————————————————————————
    import { useTokenStore } from '@/stores/token';
    const tokenStore = useTokenStore()
    const uploadSuccess = (result:any)=>{
        if (PromoteModel.value.images) {
            // 如果已有图片，则在前面加逗号
            PromoteModel.value.images += `, ${result.data}`;
        } else {
            // 如果是第一个上传的图片，直接赋值
            PromoteModel.value.images = result.data;
        }
        ElMessage.success('上传成功')
        console.log("result:" + result.data + "\nPromoteModel.value.images:" + PromoteModel.value.images);
    }

    import { useRouter } from 'vue-router'
    const router = useRouter()
    import { usePromoteStore } from '@/stores/Promote';
    const promoteStore = usePromoteStore()
    const showDetails = (row: any)=>{
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
                    <el-button :icon="Edit" circle plain type="primary"></el-button>
                    <el-button :icon="Delete" circle plain type="danger"
                        @click="deletePromote(row.promoteID)"></el-button>
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


        <!-- ——————————————————————抽屉—————————————————————— -->
        <el-drawer v-model="visibleCreate" title="发布宣传" direction="rtl" size="50%">
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
                <!-- 上传图片/视频功能 -->
                <el-form-item label="图片或视频">
                    <!-- 
                        action: 服务器接口路径
                        name: 上传文件的字段名
                        on-success: 上传成功的回调函数
                    -->
                    <el-upload 
                        class="avatar-uploader" 
                        :multiple="true"
                        :auto-upload="true" 
                        action="/api/upload"
                        name="file"
                        :headers="{'Authorization':tokenStore.token}"
                        :on-success="uploadSuccess"
                    >
                        <!-- <img v-if="PromoteModel.images" :src="PromoteModel.images" class="avatar" /> -->
                        <el-icon class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="createPromote">发布</el-button>
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