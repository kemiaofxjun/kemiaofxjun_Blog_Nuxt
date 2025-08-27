import process from 'node:process'
import ci from 'ci-info'
import blogConfig, { routeRules } from './blog.config'
import packageJson from './package.json'

// 此处配置无需修改
export default defineNuxtConfig({
	app: {
		head: {
			meta: [
				{ name: 'google-site-verification', content: blogConfig.google },
				{ name: 'description', content: blogConfig.description },
				{ name: 'keywords', content: [blogConfig.keywords, ...(process.env.KEYWORDS?.split(',') ?? [])].filter(Boolean).join(', ') },
				{ name: 'author', content: [blogConfig.author.name, blogConfig.author.email].filter(Boolean).join(', ') },
				// 此处为元数据的生成器标识，不建议修改
				{ 'name': 'generator', 'content': packageJson.name, 'data-github-repo': packageJson.homepage, 'data-version': packageJson.version },
				{ name: 'mobile-web-app-capable', content: 'yes' },
			],
			link: [
				{ rel: 'icon', href: blogConfig.favicon },
				{ rel: 'alternate', type: 'application/atom+xml', href: '/atom.xml' },
				{ rel: 'preconnect', href: blogConfig.twikoo.preload },
				{ rel: 'preconnect', href: 'https://sourceimage.s3.bitiful.net' },
                { rel: 'stylesheet', href: 'https://sourceimage.s3.bitiful.net/font/Yozai-Medium/result.css', media: 'none', onload: 'this.media="all"' },
                { rel: 'stylesheet', href: 'https://static.vercel.sxiaohe.top/fonts/anzhiyu/anzhiyufonts.css', media: 'none', onload: 'this.media="all"'  },
				{ rel: 'stylesheet', href: 'https://jsd.myxz.top/npm/artalk@2.5.3/dist/Artalk.min.css', media: 'none', onload: 'this.media="all"'  },
                { rel: 'stylesheet', href: '/assets/css/color.css', media: 'none', onload: 'this.media="all"'  },
				{ rel: 'stylesheet', href: '/assets/css/comment.css', media: 'none', onload: 'this.media="all"'  },
			],
			templateParams: {
				separator: '|',
			},
			titleTemplate: `%s %separator ${blogConfig.title}`,
			script: blogConfig.scripts,
		},
		rootAttrs: {
			id: 'z-root',
		},
	},

	compatibilityDate: '2024-08-03',

	components: [
		{ path: '~/components/partial', prefix: 'Z' },
		{ path: '~/components/zhilu', prefix: 'Zhilu', global: true },
		'~/components',
	],

	css: [
		'@/assets/css/animation.scss',
		'@/assets/css/article.scss',
		'@/assets/css/color.scss',
		'@/assets/css/main.scss',
		'@/assets/css/reusable.scss',
	],

	features: {
		inlineStyles: false,
	},

	routeRules,

	runtimeConfig: {
		public: {
			buildTime: new Date().toISOString(),
			nodeVersion: process.version,
			platform: process.platform,
			arch: process.arch,
			ci: process.env.TENCENTCLOUD_RUNENV === 'SCF' ? 'EdgeOne' : ci.name || '',
		},
	},

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "@/assets/css/_variable.scss" as *;',
				},
			},
		},
		server: {
			allowedHosts: true,
		},
	},

	// @keep-sorted
	modules: [
		'@nuxt/content',
		'@nuxt/icon',
		'@nuxt/image',
		'@nuxtjs/color-mode',
		'@nuxtjs/seo',
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'unplugin-yaml/nuxt',
	],

	colorMode: {
		preference: 'system',
		fallback: 'light',
		classSuffix: '',
	},

	content: {
		build: {
			markdown: {
				highlight: false,
				// @keep-sorted
				remarkPlugins: {
					'remark-math': {},
					'remark-reading-time': {},
				},
				rehypePlugins: {
					'rehype-katex': {},
				},
				toc: { depth: 4, searchDepth: 4 },
			},
		},
	},

	hooks: {
		'ready': () => {
			console.info(`
================================
${packageJson.name} ${packageJson.version}
${packageJson.homepage}
================================
`)
		},
		'content:file:afterParse': (ctx) => {
			// 在 URL 中隐藏指定目录前缀的路径
			for (const prefix of blogConfig.hideContentPrefixes) {
				const realPath = ctx.content?.path as string
				if (realPath && realPath.startsWith(prefix)) {
					ctx.content.original_dir = prefix
					ctx.content.path = realPath.replace(prefix, '')
				}
			}
		},
	},

	icon: {
		customCollections: [
			{ prefix: 'zi', dir: './app/assets/icons' },
		],
	},

	image: {
		// Netlify 需要特殊处理
		provider: process.env.NUXT_IMAGE_PROVIDER,
		domains: blogConfig.imageDomains,
		format: ['avif', 'webp'],
	},

	robots: {
		disableNuxtContentIntegration: true,
		disallow: blogConfig.robotsNotIndex,
	},

	site: {
		name: blogConfig.title,
		url: blogConfig.url,
		defaultLocale: blogConfig.language,
	},
})
