<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { Edit, Delete } from '@element-plus/icons-vue'

    import { useRouter } from 'vue-router';
    const router = useRouter(); // 获取router实例

    // ————————————————————————————————————————————————————
    // ——————————————————————数据回显———————————————————————
    // ————————————————————————————————————————————————————

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
    // 过滤掉已取消的助力并显示为中文。回显时调用这个filteredSupportInfo变量
    const filteredSupportInfo = computed(() => {
        return supportInfo.value
            .map(support => ({
                ...support,
                statusString: statusMap[support.status as keyof typeof statusMap]  // 添加 statusString 字段
            }));
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
    const deleteSupport = async (supportID:number, event:any) => { 
        event.stopPropagation();  // 阻止触发行点击事件
        console.log("row:", supportID)
        // 弹出确认框
        await ElMessageBox.confirm(
            '确定要删除这条助力申请吗？',
            '操作确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'info',
            }
        );

        await deleteService({supportID: supportID})
        await getSupport();
        if (supportInfo.value.length > 0) {
            await handleSupportData();
        }

        ElMessage.success('操作成功')
    }

    // ——————————————————————删除助力——————————————————————
    const editSupport = async (supportID:number, event:any) => { 
        event.stopPropagation();  // 阻止触发行点击事件
        // 待补全
    }

    // ——————————————————————展示助力详情——————————————————————
    import { useSupportStore } from '@/stores/SupportStore';
    const supportStore = useSupportStore()
    import { usePromoteStore } from '@/stores/PromoteStore';
    const promoteStore = usePromoteStore()
    const showDetails = (row: any) => {
        promoteStore.setStatus(false)
        console.log("点击的行数据：",row)
        supportStore.setSupport(row)
        supportStore.setfromPage('/support')
        // 页面跳转
        router.push('/supportDetail')

    }
    

</script>

<template>
    <!-- 助力情况区域 -->
    <div class="support-container">
        <h2 class="support-title">我发布的全部助力</h2>
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
                            @click="editSupport(row.supportID, $event)"></el-button>
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
    </div>


</template>

<style lang="scss" scoped>
    .support-container {
        display: flex;
        flex-direction: column;
        // justify-content: center; /* 垂直居中 */
        align-items: center; /* 水平居中 */
        height: 80vh; /* 使其占满整个屏幕高度 */
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow-y: auto; /* 当内容超出时显示滚动条 */
    }

    .support-title {
        text-align: center;
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 20px;
        color: #333;
    }
</style>