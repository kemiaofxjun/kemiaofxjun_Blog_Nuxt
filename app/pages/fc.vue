<script setup>
/**
 * Friend-Circle-Lite 极简前端版本
 * 使用 Rock-Candy-Tea/Friend-Circle-Frontend 提供的 imm.min.js 渲染文章
 * 其余（Banner、随机文章、作者弹窗...）全部移除
 */

import { onMounted } from 'vue'

const appConfig = useAppConfig()
const layoutStore = useLayoutStore()

layoutStore.setAside(['blog-stats', 'blog-tech', 'blog-log'])

useSeoMeta({
	title: '友链朋友圈',
	ogType: 'profile',
	description: `${appConfig.title}的友链朋友圈页面。`,
})

/* 注入全局配置（imm.min.js 会读取） */
onMounted(() => {
	if (typeof window.UserConfig === 'undefined') {
		window.UserConfig = {
			private_api_url: 'https://fc-main.kemeow.top/', // 去掉多余空格
			page_turning_number: 24,
			error_img: 'https://fastly.jsdelivr.net/gh/Rock-Candy-Tea/Friend-Circle-Frontend/logo.png',
		}
	}

	/* 动态加载 CSS */
	const link = document.createElement('link')
	link.rel = 'stylesheet'
	link.href = 'https://fastly.jsdelivr.net/gh/Rock-Candy-Tea/Friend-Circle-Frontend/hexo-theme-butterfly/imm.min.css'
	document.head.appendChild(link)

	/* 动态加载 JS */
	const script = document.createElement('script')
	script.src = 'https://fastly.jsdelivr.net/gh/Rock-Candy-Tea/Friend-Circle-Frontend/hexo-theme-butterfly/imm.min.js'
	script.async = true
	document.body.appendChild(script)
})
</script>

<template>
<!-- Banner（保持不变） -->
<div
	class="page-banner"
	style="background-image: url(/assets/img/page_backgroud/moment.webp)"
>
	<div class="banner-content">
		<h1>博友圈</h1>
		<p>发现更多有趣的博主</p>
	</div>
	<div class="banner-extra">
		<div class="friend-stats">
			<div class="update-time">
				Updated at Now
			</div>
			<div class="powered-by">
				Powered by FriendCircleLite
			</div>
		</div>
	</div>
</div>

<!-- 文章列表容器，imm.min.js 会接管并渲染 -->
<div id="friend-circle-container" class="page-fcircle">
	与主机通讯中……
</div>
</template>

<style scoped>
/* ===== 顶部 Banner ===== */
.page-banner {
  background-position: 50%;
  background-size: cover;
  border-radius: 8px;
  margin: 1rem;
  max-height: 320px;
  min-height: 256px;
  overflow: hidden;
  position: relative;
}
.page-banner .banner-content {
  color: #eee;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: space-between;
  padding: 1rem;
  position: absolute;
  text-shadow: 0 4px 5px rgba(0, 0, 0, 0.5);
}
.page-banner .banner-content h1 {
  font-size: 2rem;
}
.page-banner .banner-content p {
  font-size: 1rem;
  opacity: 0.9;
}
.page-banner .banner-extra {
  align-items: flex-end;
  display: flex;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: flex-end;
  margin: 1rem;
  position: absolute;
}
.friend-stats {
  align-items: flex-end;
  color: #eee;
  display: flex;
  flex-direction: column;
  font-family: var(--font-monospace);
  font-size: 0.7rem;
  gap: 0.1rem;
  opacity: 0.7;
  text-shadow: 0 4px 5px rgba(0, 0, 0, 0.5);
}
.friend-stats .update-time {
  opacity: 1;
}
.friend-stats .powered-by {
  opacity: 0.8;
}

/* ===== 内容区 ===== */
.page-fcircle {
  animation: float-in 0.2s backwards;
  margin: 1rem;
}
</style>
