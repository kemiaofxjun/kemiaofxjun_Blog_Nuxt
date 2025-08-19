<script setup lang="ts">
const appConfig = useAppConfig()
const timeEstablished = appConfig.timeEstablished

const blogLog = [
	{ date: timeEstablished, content: '更换框架Nuxt 4，域名kemeow..top' },
]
</script>

<template>
<ZWidget card title="更新日志">
	<!-- TODO: 优化时间线样式 -->
	<ul>
		<li v-for="(item, index) in blogLog" :key="index">
			<small>{{ item.date }}</small><br>
			{{ item.content }}
		</li>
	</ul>
</ZWidget>
</template>
