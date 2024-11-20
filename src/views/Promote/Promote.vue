<script setup lang="ts">
    import { ref } from 'vue'
    const isCustomer = ref(false)

    import {
        Edit,
        Delete,
        // HelpFilled
    } from '@element-plus/icons-vue'

    import { promoteListService } from '@/api/promote'
    import type { Promote } from '@/Types/types'; // 定义 Promote 类型
    // 定义 promotes 类型
    const promotes = ref<Promote[]>([]);    const promoteList = async()=>{
        console.log('promoteList被调用了')
        // 之后要写成带页码参数的形式
        let result = await promoteListService({pageNum:1, pageSize:10});
        // let result = await promoteListService({pageNum:1, pageSize:5, promoteType:'农家院'});
        promotes.value = result.data.items || [];

        console.log('result:\n' + promotes.value)
    }
    promoteList()


    const Towns = ref([
        {
            "townID": 5,
            "name": "米东区",
            "province": '新疆省',
            "city": '乌鲁木齐市',
        }
    ])

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
            <el-table-column label="乡镇" prop="townID"></el-table-column>
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