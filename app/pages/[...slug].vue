<script setup lang="ts">
import PreViewHeader from '../components/preview/PreViewHeader.vue'

const route = useRoute()

const layoutStore = useLayoutStore()
layoutStore.setAside(['toc', 'blog-stats', 'connectivity', 'latest-comments', 'blog-log'])

const { data: post } = await useAsyncData(
	() => route.path,
	() => queryCollection('content').path(route.path).first(),
)

const { data: preview } = await useAsyncData(
	() => route.path,
	() => queryCollection('content').path(route.path).first(),
)

const excerpt = computed(() => post.value?.description || '')

if (post.value) {
	useSeoMeta({
		title: post.value.title,
		ogType: 'article',
		ogImage: post.value.image,
		description: post.value.description,
	})
	layoutStore.setAside(post.value.meta?.aside as WidgetName[])
}
if (preview.value) {
	useSeoMeta({
		title: preview.value.title,
		ogType: 'article',
		ogIcon: preview.value.icon,
		ogImage: preview.value.image,
		description: preview.value.description,
	})
	layoutStore.setAside(preview.value.meta?.aside as WidgetName[])
}
else {
	// // BUG: 部分文章在 Vercel 上以 404 状态码呈现，在 Linux SSG 模式下展示异常
	// const event = useRequestEvent()
	// event && setResponseStatus(event, 404)
	route.meta.title = '404'
	layoutStore.setAside(['blog-stats', 'connectivity', 'latest-comments', 'blog-log'])
}
</script>

<template>
<template v-if="post">
	<PostHeader v-bind="post" />
	<PostExcerpt v-if="excerpt" :excerpt />
	<ContentRenderer
		class="article"
		:class="getPostTypeClassName(post?.type, { prefix: 'md' })"
		:value="post"
		tag="article"
	/>

	<PostFooter v-bind="post" />
	<PostSurround />
	<PostComment />
</template>

<template v-else-if="preview">
	<PreViewHeader />
	<PostHeader v-bind="preview" />
	<PostExcerpt v-if="excerpt" :excerpt />
	<ContentRenderer
		class="article"
		:class="getPostTypeClassName(preview?.type, { prefix: 'md' })"
		:value="post"
		tag="article"
	/>

	<PostFooter v-bind="post" />
	<PostSurround />
	<PostComment />
</template>

<ZError
	v-else
	icon="solar:confounded-square-bold-duotone"
	title="内容为空或页面不存在"
/>
</template>

<style lang="scss" scoped>
.article {
	animation: float-in 0.2s backwards;
}
</style>
