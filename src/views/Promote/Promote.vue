<script setup lang="ts">
    import { ref } from 'vue'
    const isPromoter = ref(false)

    import {
        Edit,
        Delete,
        // HelpFilled
    } from '@element-plus/icons-vue'



    //用户搜索时选中的宣传类型id
    const categoryId=ref('')


    //宣传类型数据模型
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

    const getCategoryNameById = (id:any) => {
        const category = categorys.value.find((item) => item.id === id);
        return category?.categoryName;
    };

    // ———————————————————————————————————————————————————————————
    // ——————————————————————分页展示相关功能——————————————————————
    // ———————————————————————————————————————————————————————————

    //分页条数据模型
    const pageNum = ref(1)//当前页
    const total = ref(20)//总条数
    const pageSize = ref(6)//每页条数

    //当每页条数发生了变化，调用此函数
    const onSizeChange =async (size:number) => {
        pageSize.value = size
        search()
    }
    //当前页码发生变化，调用此函数
    const onCurrentChange = (num:number) => {
        pageNum.value = num
        search()
    }


    // ———————————————————————————————————————————————————————————
    // ——————————————————————数据回显相关功能——————————————————————
    // ———————————————————————————————————————————————————————————

    import { promoteListService, townListService, viewMyService, deleteService } from '@/api/promote'
    import type { Promote, Towns } from '@/Types/types'; // 定义 Promote 类型
    
    // 定义 promotes 和 towns 类型
    const promotes = ref<Promote[]>([]);
    const towns = ref<Towns[]>([])
    
    // 定义 promoteList 函数
    const promoteList = async()=>{
        console.log('promoteList被调用了')
        isPromoter.value = false;
        // 之后要写成带页码参数的形式
        let result = await promoteListService({pageNum:pageNum.value, pageSize:pageSize.value, promoteType:getCategoryNameById(categoryId.value)});
        promotes.value = result.data.items || [];
        total.value = result.data.total || 0;
        
        // 调用 townList 获取 towns 数据
        if(promotes.value != null){
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
    const viewMy = async()=>{
        console.log('viewMy被调用了')
        isPromoter.value = true;       
         
        //清空一下数据
        clear()

        let result = await viewMyService({pageNum:pageNum.value, pageSize:pageSize.value, promoteType:getCategoryNameById(categoryId.value)});
        
        promotes.value = result.data.items || [];
        total.value = result.data.total || 0;
        
        // 调用 townList 获取 towns 数据
        if(promotes.value != null){
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
    const search = async()=>{
        console.log('search被调用了\n')

        // 判断是否为"我的"页面
        if(isPromoter.value == false){
            await promoteList()
        }else{
            await viewMy()
        }
    }


    const clear = () => {
        categoryId.value = ''
    }

    const reset = async() => {
        clear()
        // 判断是否为"我的"页面
        if(isPromoter.value == false){
            await promoteList()
        }else{
            await viewMy()
        }
    }

    // ———————————————————————————————————————————————————————————
    // ——————————————————删除,编辑,发布宣传相关功能—————————————————
    // ———————————————————————————————————————————————————————————
    import { ElMessageBox, ElMessage } from 'element-plus';
    
    //删除宣传功能
    const deletePromote = async(promoteID: number)=>{
        
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

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>乡镇宣传</span>
                <div class="extra">
                    <el-button type="primary" @click="promoteList"  v-if="isPromoter">查看全部</el-button>
                    <el-button type="primary" @click="viewMy"  v-else>仅看我发布的</el-button>

                    <el-button type="primary">发布宣传</el-button>
                </div>
            </div>
        </template>
        <!-- ——————————————————————搜索栏—————————————————————— -->
        <el-form inline>
            <el-form-item label="宣传类型：" class="type">
                <el-select placeholder="请选择" v-model="categoryId">
                    <el-option 
                        v-for="c in categorys" 
                        :key="c.id" 
                        :label="c.categoryName"
                        :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button @click="reset">刷新</el-button>
            </el-form-item>
        </el-form>

        <!-- ——————————————————————文章列表—————————————————————— -->
        <el-table :data="promotes" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"theme> </el-table-column>
            <el-table-column label="主题" prop="theme"></el-table-column>
            <el-table-column label="乡镇" prop="townFullName"></el-table-column>
            <el-table-column label="类型" prop="promoteType"></el-table-column>
            <!-- 这一行只在查看我自己的宣传的时候显示 -->
            <el-table-column label="操作" width="100" v-if="isPromoter">
                <!-- <template #default="{ row }" v-if="isPromoter"> -->
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deletePromote(row.promoteID)"></el-button>
                </template>
                <!-- <template #default="{ row }" v-else>
                    <el-button :icon="HelpFilled" circle plain type="primary"></el-button>
                </template> -->
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- ——————————————————————分页条—————————————————————— -->

        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3,6,9]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />


    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .type{
        min-width: 30dvh;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>