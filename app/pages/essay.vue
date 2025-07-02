<script setup lang="ts">
import essay from '~/essay'
const appConfig = useAppConfig()
const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'connectivity', 'blog-log'])

useSeoMeta({
    title: '',
    ogType: 'profile',
    description: `${appConfig.title}的友链页面，收集了添加他为友链的网站和他订阅的网站列表。`,
})
const { data: postLink } = await useAsyncData('/essay', () => queryContent('/essay').findOne())
</script>
<template>
    <div class="bber">
        <section class="timeline.page-1">
            <ul class="list" id="waterfall">
            </ul>
        </section>
    </div>
</template>