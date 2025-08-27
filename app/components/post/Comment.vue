<script setup lang="ts">
const appConfig = useAppConfig()

onMounted(() => {
	// @ts-expect-error windows上有twikoo实例
	window.Artalk?.init?.({
		// envId: appConfig.twikoo?.envId,
		// // twikoo 会把挂载后的元素变为 #twikoo
		// el: '#twikoo',
        el: '#artalk',
        pageKey: '',
        pageTitle: '',
        server: appConfig.artalk?.server,
        site: appConfig.artalk?.sitename,
	})
})
</script>

<template>
<section class="z-comment">
	<h3 class="text-creative">
		评论区
	</h3>
	<div id="artalk" style="margin: 2em 0;">
		<p>评论加载中...</p>
	</div>
</section>
</template>

<style lang="scss" scoped>
.z-comment {
	margin: 3rem 1rem;

	> h3 {
		margin-top: 3rem;
		font-size: 1.25rem;
	}
}

:root {
	--ark-color-bg: #fff
}

.dark {
	--ark-color-bg: #000000
}

:deep(#artalk) {
	margin: 2em 0;

	.atk-main-editor {
		background: var(--ark-color-bg)!important;

		.atk-main-editor>.atk-header input {
			color: var(--ark-color-bg)!important;
		}
		.atk-textarea-wrap {
			textarea.atk-textarea {
				background: var(--ark-color-bg)!important;
			}
		}
		.atk-main-editor>.atk-bottom .atk-plug-btn i {
			color: #ffffff;
		}
	}
}
</style>
