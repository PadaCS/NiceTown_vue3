<script setup lang="ts">
    import { ref } from 'vue'
    const isCustomer = ref(false)

    import {
        Edit,
        Delete,
        // HelpFilled
    } from '@element-plus/icons-vue'

    import { promoteListService, townListService } from '@/api/promote'
    import type { Promote, Towns } from '@/Types/types'; // 定义 Promote 类型
    
    // 定义 promotes 和 towns 类型
    const promotes = ref<Promote[]>([]);
    const towns = ref<Towns[]>([])
    
    const promoteList = async()=>{
        console.log('promoteList被调用了')
        // 之后要写成带页码参数的形式
        let result = await promoteListService({pageNum:1, pageSize:10});
        // let result = await promoteListService({pageNum:1, pageSize:5, promoteType:'农家院'});
        promotes.value = result.data.items || [];
        // 调用 townList 获取 towns 数据
        await townList();

        // 为 promotes 添加 townFullName
        promotes.value.forEach((promote) => {
            const town = towns.value.find((t) => t.townID === promote.townID);
            promote.townFullName = town ? `${town.province}${town.city}${town.name}` : '未知乡镇';
        });
        console.log('result:\n' + promotes.value)
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
        console.log('towns:', towns.value);

    };
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>乡镇宣传</span>
                <div class="extra">
                    <el-button type="primary">仅看我发布的</el-button>
                </div>
            </div>
        </template>
        <el-table :data="promotes" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"theme> </el-table-column>
            <el-table-column label="主题" prop="theme"></el-table-column>
            <el-table-column label="乡镇" prop="townFullName"></el-table-column>
            <el-table-column label="类型" prop="promoteType"></el-table-column>
            <!-- 这一行只在查看我自己的宣传的时候显示 -->
            <el-table-column label="操作" width="100" v-if="isCustomer">
                <!-- <template #default="{ row }" v-if="isCustomer"> -->
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary"></el-button>
                    <el-button :icon="Delete" circle plain type="danger"></el-button>
                </template>
                <!-- <template #default="{ row }" v-else>
                    <el-button :icon="HelpFilled" circle plain type="primary"></el-button>
                </template> -->
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>