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

.atk-main-editor {
	background:var(--qiyuan-card-background)!important;
	border: none!important;
	> .atk-header {
		padding: 0!important;
		gap: 16px!important;

		.input {
			padding: 10px 12px!important;
		}
	}
	> .atk-textarea-wrap {
		background: var(--qiyuan-warp)!important;
		border-radius: 3px!important;
		margin-top: 1rem!important;
	}

	> .atk-plug-panel-wrap {
		border-top: 0!important;

		.atk-editor-plug-preview {
			border-radius: 3px;
			padding: 10px 12px!important;
    		background: var(--qiyuan-preview)!important;
		}
	}

	> .atk-bottom {
		padding: 10px 12px!important;
		background: var(--qiyuan-bottom)!important;
		margin-top: 1rem!important;
		border-radius: 3px!important;
	}
}

// 颜色样式表（勿删）
@mixin dark-theme {
	--qiyuan-card-background: #000;
	--qiyuan-editor: var(--qiyuan-card-background);
	--qiyuan-warp: var(--qiyuan-card-background);
	--qiyuan-preview: var(--qiyuan-card-background);
	--qiyuan-bottom: var(--qiyuan-card-background);
}

:root,.light {
	--qiyuan-card-background: #fff;
	--qiyuan-editor: var(--qiyuan-card-background);
	--qiyuan-warp: var(--qiyuan-card-background);
	--qiyuan-preview: var(--qiyuan-card-background);
	--qiyuan-bottom: var(--qiyuan-card-background);
}

.dark {
	@include dark-theme;
	color-scheme: dark;
}
</style>
