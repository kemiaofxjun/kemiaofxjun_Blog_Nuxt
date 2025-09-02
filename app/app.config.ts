import type { Nav, NavItem } from '~/types/nav'
import blogConfig from '~~/blog.config'

// 图标查询：https://yesicon.app/ph
// 图标插件：https://marketplace.visualstudio.com/items?itemName=antfu.iconify

// @keep-sorted
export default defineAppConfig({
	// 将 blog.config 中的配置项复制到 appConfig，方便调用
	...blogConfig,

	article: {
		categories: <{ [category: string]: { icon: string, color?: string } }>{
			// 搭建: { icon: 'ph:mouse-bold', color: '#3af' },
			技术分享: { icon: 'ph:code-bold', color: '#77f' },
			// 生活: { icon: 'ph:shooting-star-bold', color: '#3ba' },
			// 博客魔改: { icon: 'ph:code-bold', color: '#77f' },
			资源分享: { icon: 'ph:cloud-bold', color: '#77f' },
			// 未分类: { icon: 'ph:folder-dotted-bold' },
		},
		defaultCategoryIcon: 'ph:folder-bold',
		/** 分类排序方式，键为排序字段，值为显示名称 */
		order: {
			date: '创建日期',
			updated: '更新日期',
			// title: '标题',
		},
	},

	content: {
		/** 代码块自动折叠触发行数 */
		codeblockCollapsibleRows: 16,
		/** 文章开头摘要 */
		excerpt: {
			animation: true,
			caret: '_',
		},
	},

	// @keep-sorted
	footer: {
		/** 页脚版权信息，支持 <br> 换行等 HTML 标签 */
		copyright: `© ${new Date().getFullYear()} ${blogConfig.author.name}`,
		/** 侧边栏底部图标导航 */
		iconNav: [
			{ icon: 'ph:house-bold', text: '个人主页', url: blogConfig.author.homepage },
			{ icon: 'ph:telegram-logo', text: 'TG账户', url: 'https://t.me/kemiaosw' },
			{ icon: 'ph:github-logo-bold', text: 'GitHub: 克喵爱吃卤面', url: 'https://github.com/kemiaofxjun' },
			{ icon: 'ph:rss-simple-bold', text: 'Atom订阅', url: '/atom.xml' },
			{ icon: 'ph:subway-bold', text: '开往', url: 'https://www.travellings.cn/go-by-clouds.html' },
		] satisfies NavItem[],
		message: '<a href="https://icp.gov.moe/?keyword=20250530" target="_blank">萌ICP备20250530号</a>',
		/** 页脚站点地图 */

		nav: [
			{
				title: '探索',
				items: [
					{ icon: 'ph:rss-simple-bold', text: 'Atom订阅', url: '/atom.xml' },
					{ icon: 'ph:subway-bold', text: '开往', url: 'https://www.travellings.cn/' },
					// { icon: 'ph:flying-saucer-bold', text: '异次元旅行', url: 'https://travel.moe/go.html?travel=on' },
				],
			},
			{
				title: '社交',
				items: [
					{ icon: 'ph:github-logo-bold', text: 'kemiaofxjun', url: 'https://github.com/kemiaofxjun' },
					// { icon: 'ri:qq-line', text: '群: 169994096', url: 'https://jq.qq.com/?_wv=1027&k=lQfNSeEd' },
					{ icon: 'ph:envelope-simple-bold', text: '本站邮箱', url: `mailto:${blogConfig.author.email}` },
				],
			},
			{
				title: '信息',
				items: [
					{ icon: 'simple-icons:nuxtdotjs', text: 'Nuxt开源博客主题', url: 'https://github.com/L33Z22L11/blog-v3' },
					// { icon: 'ph:swatches-bold', text: '主题和组件文档', url: 'https://www.myxz.top/theme' },
					{ icon: 'ph:certificate-bold', text: '萌备20250530号', url: 'https://icp.gov.moe/?keyword=20250530' },
					{ icon: 'ph:certificate-bold', text: '雾ICP备20250530号', url: 'https://icp.wudu.ltd/id.php?keyword=20250530' },
				],
			},
		] satisfies Nav,
	},

	/** 左侧栏顶部 Logo */
	header: {
		logo: 'https://img.314926.xyz/images/2025/08/13/no-background-kemiaofxjun.webp',
		/** 展示标题文本，否则展示纯 Logo */
		showTitle: true,
		subtitle: blogConfig.subtitle,
		emojiTail: ['📔', '📓', '📖', '📚️', '📑'],
		avatarFrame: 'https://img.314926.xyz/images/2025/08/13/no-background-kemiaofxjun.webp',
	},

	/** 左侧栏导航 */
	nav: [
		{
			title: '',
			items: [
				{ icon: 'ph:files-bold', text: '丹青妙笔', url: '/' },
				{ icon: 'ph:archive-bold', text: '经卷藏珍', url: '/archive' },
				{ icon: 'tabler:tags', text: '标签归类', url: '/tags' },
				{ icon: 'ph:link-bold', text: '竹林旧友', url: '/link' },
				{ icon: 'ph:fish-bold', text: '塘文集锦', url: '/fcircle' },
				{ icon: 'ph:chats-bold', text: '​纸笺寄语', url: '/comments' },
				{ icon: 'ph:lightning-bold', text: '闲言碎语', url: '/essays' },
				{ icon: 'ph:star-of-david-bold', text: '优良精装', url: '/equipment' },
				{ icon: 'ph:apple-podcasts-logo-bold', text: '关于自己', url: '/about' },
				// { icon: 'ph:codesandbox-logo-bold', text:'站点展览', url:'/site'}
			],
		},
	] satisfies Nav,

	pagination: {
		perPage: 10,
		/** 默认排序方式，需要是 this.article.order 中的键名 */
		sortOrder: 'date' as const,
		/** 允许（普通/预览/归档）文章列表正序，开启后排序方式左侧图标可切换顺序 */
		allowAscending: false,
	},

	stats: {
		/** 归档页面每年标题对应的年龄 */
		birthYear: 2008,
		/** blog-stats widget 的预置文本 */
		wordCount: '约10万',
	},

	themes: {
		light: {
			icon: 'ph:sun-bold',
			tip: '浅色模式',
		},
		system: {
			icon: 'ph:monitor-bold',
			tip: '跟随系统',
		},
		dark: {
			icon: 'ph:moon-bold',
			tip: '深色模式',
		},
	},
})
