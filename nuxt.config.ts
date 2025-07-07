import process from 'node:process'
import blogConfig, { routeRules } from './blog.config'

// 此处配置无需修改
export default defineNuxtConfig({
    app: {
        head: {
            htmlAttrs: {
                lang: blogConfig.language,
            },
            meta: [
                { name: 'author', content: [blogConfig.author.name, blogConfig.author.email].filter(Boolean).join(', ') },
                // 此处为元数据的生成器标识，不建议修改
                { 'name': 'generator', 'content': 'blog-v3', 'data-github-repo': 'https://github.com/L33Z22L11/blog-v3' },
                { name: 'mobile-web-app-capable', content: 'yes' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
            ],
            link: [
                { rel: 'icon', href: blogConfig.favicon },
                { rel: 'alternate', type: 'application/atom+xml', href: '/atom.xml' },
                { rel: 'preconnect', href: blogConfig.twikoo.preload },

                { rel: 'preconnect', href: 'https://cdn-font.hyperos.mi.com' },
                // 浏览器渲染中文 VF 字重有问题
                // { rel: 'stylesheet', href: 'https://cdn-font.hyperos.mi.com/font/css?family=MiSans_VF:VF:Chinese_Simplify,Latin&display=swap', media: 'none', onload: 'this.media="all"' },
                // https://cdn-font.hyperos.mi.com/font/css?family=MiSans:100,200,300,400,450,500,600,650,700,900:Chinese_Simplify,Latin&display=swap

                { rel: 'preconnect', href: 'https://fonts.googleapis.cn' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.cn', crossorigin: '' },

                { rel: 'preconnect', href: 'https://chinese-fonts-cdn.deno.dev' },
                { rel: 'stylesheet', href: 'https://sourceimage.s3.bitiful.net/font%2FYeZiGongChangTangYingHei%2Fresult.css', media: 'none', onload: 'this.media="all"' },
                // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap', media: 'none', onload: 'this.media="all"' },
                // Fira Code 没有斜体
                // { rel: 'stylesheet', href: 'https://fonts.googleapis.cn/css2?family=Fira+Code:wght@300..700&family=Noto+Serif+SC:wght@200..900&display=swap', media: 'none', onload: 'this.media="all"' },

                // { rel: 'stylesheet', href: 'https://gcore.jsdelivr.net/npm/nerdfonts-web/nf.min.css' },
            ],
            templateParams: {
                separator: '|',
            },
            titleTemplate: `%s %separator ${blogConfig.title}`,
            script: blogConfig.scripts,
        },
        rootId: 'z-root',
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

    // https://github.com/nuxt/devtools/issues/761
    // 修了多久了，还整天内存泄漏
    devtools: {
        enabled: false,
    },

    features: {
        inlineStyles: false,
    },

    future: {
        compatibilityVersion: 4,
    },

    routeRules,

    runtimeConfig: {
        public: {
            buildTime: new Date().toISOString(),
        },
    },

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/assets/css/_variable.scss" as *;',
                    api: 'modern-compiler',
                },
            },
        },
        server: {
            allowedHosts: true,
        },
    },

    modules: [
        '@nuxt/content',
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxtjs/color-mode',
        '@nuxtjs/seo',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        '@zinkawaii/nuxt-shiki',
        '@vite-pwa/nuxt',
    ],

    colorMode: {
        preference: 'system',
        fallback: 'light',
        classSuffix: '',
    },

    content: {
        experimental: {
            search: {},
        },
        highlight: {
            langs: blogConfig.shiki.langs,
            theme: {
                default: blogConfig.shiki.defaultTheme,
                dark: blogConfig.shiki.darkTheme,
            },
        },
        markdown: {
            remarkPlugins: ['remark-reading-time'],
            toc: { depth: 4, searchDepth: 4 },
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
        disallow: blogConfig.robotsNotIndex,
    },

    shiki: {
        bundledLangs: blogConfig.shiki.bundledLangs,
        bundledThemes: blogConfig.shiki.themes,
        defaultLang: 'log',
        defaultTheme: {
            light: blogConfig.shiki.defaultTheme,
            dark: blogConfig.shiki.darkTheme,
        },
    },

    site: {
        name: blogConfig.title,
        url: blogConfig.url,
    },
    pwa: {
        // 基本配置
        manifest: {
            name: 'My Nuxt App',
            short_name: 'NuxtApp',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            orientation: 'portrait',
            start_url: '/',
            icons: [
                {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
                },
                {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png'
                }
            ]
        },

        // Service Worker 配置
        workbox: {
            globPatterns: ['​**​/*.{js,css,html,png,jpg,jpeg,svg,gif,woff2}'],
            navigateFallback: '/',
            runtimeCaching: [
                // 缓存Google字体
                {
                    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'google-fonts-cache',
                        expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 60 * 24 * 30 // 30天
                        }
                    }
                },
                // 缓存API请求
                {
                    urlPattern: /^https:\/\/api\.example\.com\/.*/i,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'api-cache',
                        networkTimeoutSeconds: 10,
                        expiration: {
                        maxEntries: 150,
                        maxAgeSeconds: 60 * 60 * 24 // 24小时
                        }
                    }
                }
            ]
        },

        // 客户端行为控制
        client: {
            installPrompt: true, // 显示安装提示
            periodicSyncForUpdates: 3600, // 每小时检查更新(秒)
        },

        // 开发选项
        devOptions: {
            enabled: true, // 开发环境中启用
            type: 'module', // 使用模块化Service Worker
            suppressWarnings: true,
        }
    },
})
