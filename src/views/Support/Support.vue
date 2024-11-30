<script setup lang="ts">

import { useSupportStore } from '@/stores/SupportStore';
const supportStore = useSupportStore()

</script>

<template>
    <div>
        <h1>我的助力页面</h1>
        点击详情的时候要记得设置isPromoter = false，还要设置supportStore.setFromPage为当前页面
    </div>
</template>

<style scoped>
</style>