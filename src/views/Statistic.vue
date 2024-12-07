<script setup lang="ts">
import { ref } from 'vue';

// 选择的数据模型
const years = ref([2022, 2023, 2024, 2025]);
const months = ref(Array.from({ length: 12 }, (_, i) => i + 1));
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


// 绑定的变量
const startYear = ref(2024);   // 起始年份
const startMonth = ref(7);     // 起始月份
const endYear = ref(2024);     // 截止年份
const endMonth = ref(12);       // 截止月份
const townID = ref();       //乡镇地区

const startTime = ref('');
const endTime = ref('');

// 搜索功能
const search = () => {
    console.log('搜索条件:', startYear.value, startMonth.value, endYear.value, endMonth.value, townID.value);
    // 把起止年月拼成：startMonth和endMonth（格式: YYYYMM）
    // ......
    // startTime = ...
    // endTime = ...

    // 执行搜索逻辑
    getStats()
};

// 刷新功能
const reset = () => {
    startYear.value = 2024;
    startMonth.value = 7;
    endYear.value = 2024;
    endMonth.value = 12;
    townID.value = null;
    console.log('表单已重置');
};
</script>

<template>
    <div class="support-container">
        <!-- ——————————顶部—————————— -->
        <div class="header">
            <h2 class="support-title">月统计数据</h2>
        </div>

        <!-- ——————————搜索栏—————————— -->
        <el-form inline>
            <!-- 起始年份 -->
            <el-form-item label="起始年份：" class="type">
                <el-select v-model="startYear" placeholder="请选择">
                    <el-option v-for="year in years" :key="year" :label="year.toString()" :value="year" />
                </el-select>
            </el-form-item>

            <!-- 起始月份 -->
            <el-form-item label="起始月份：" class="type">
                <el-select v-model="startMonth" placeholder="请选择">
                    <el-option v-for="month in months" :key="month" :label="month + '月'" :value="month" />
                </el-select>
            </el-form-item>

            <!-- 截止年份 -->
            <el-form-item label="截止年份：" class="type">
                <el-select v-model="endYear" placeholder="请选择">
                    <el-option v-for="year in years" :key="year" :label="year.toString()" :value="year" />
                </el-select>
            </el-form-item>

            <!-- 截止月份 -->
            <el-form-item label="截止月份：" class="type">
                <el-select v-model="endMonth" placeholder="请选择">
                    <el-option v-for="month in months" :key="month" :label="month + '月'" :value="month" />
                </el-select>
            </el-form-item>

            <!-- 地区 -->
            <el-form-item label="乡镇地区：" class="type">
                <el-select placeholder="请选择" v-model="townID">
                    <el-option v-for="c in allTowns" :key="c.townID" :label="c.categoryName" :value="c.townID">
                    </el-option>
                </el-select>
            </el-form-item>

            <!-- 搜索按钮 -->
            <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button @click="reset">刷新</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
.support-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 80vh;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
}

.type {
    min-width: 25dvh;
}
</style>
