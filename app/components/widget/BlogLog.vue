<script setup lang="ts">
const appConfig = useAppConfig()
const timeEstablished = appConfig.timeEstablished

const blogLog = [
	{ date: '2025-08-28', content: '使用artalk评论系统' },
	{ date: timeEstablished, content: '更换框架Nuxt 4，域名kemiaosw.top' },
]
</script>

<template>
<ZWidget card title="更新日志">
	<ZDlGroup size="large" :items="blogLog" />
</ZWidget>
</template>
