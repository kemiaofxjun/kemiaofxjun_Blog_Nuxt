export interface aboutConnect {
	author: author[] // 头像数据
	large: string // 标题数据
	myinfo: myinfo[] // 个人介绍数据
	hello: string // Hello there数据
	maxim: maxim[] // 左右铭数据
	technology: technology[] // 偏好数据
	game: game[] // 游戏数据
	single: single[] // 历程数据
}

// 头像数据
export interface author {
	left: left[]
	logo: string
	// box: box[];
	right: right[]
}

export interface left {
	tag1: string
	tag2: string
	tag3: string
	tag4: string
}

export interface box {
	logo: string
}

export interface right {
	tag1: string
	tag2: string
	tag3: string
	tag4: string
}

// 个人介绍数据
export interface myinfo {
	title1: string
	title2: string
	inlineword1: string
	title3: string
	inlineword2: string
	card: card[]
}

export interface card {
	tips: string
	conect1: string
	conect2: string
	inlineword: string
	mask: mask[]
}

export interface mask {
	firstTips: string
	span: string
	up: string
	show: string
}

// 左右铭数据
export interface maxim {
	tip: string
	title1: string
	title2: string
}

// 偏好数据
export interface technology {
	tip: string
	title: string
	bottomTip: string
}

// 游戏数据
export interface game {
	tip: string
	title: string
	uid: string
}

// 历程数据
export interface single {
	tip: string
	conect1: string
	strong1: string
	conect2: string
	strong2: string
	conect3: string
}

export const aboutPage: aboutConnect[] = [
	{
		author: [
			{
				left: [{
					tag1: '💻 资源分享者',
					tag2: '🥣 普普通通干饭人',
					tag3: '🕊 咕咕咕咕咕咕~',
					tag4: '🧱 大学牲',
				}],
				logo: 'https://img.314926.xyz/images/2025/08/13/no-background-kemiaofxjun.webp',
				right: [{
					tag1: '小说狂热爱好者 📖',
					tag2: '对朋友外向 🤝',
					tag3: '解决不了就摆烂 🔨',
					tag4: '自动化小白 💢',
				}],
			},
		],
		large: '关于本站',
		myinfo: [{
			title1: '你好，很高兴认识你👋',
			title2: '我叫',
			inlineword1: '克喵爱吃卤面',
			title3: '是一名 自动化大学牲、资源分享者',
			inlineword2: '博主',
			card: [{
				tips: '追求',
				conect1: '源于资源',
				conect2: '热爱而去',
				inlineword: '分享',
				mask: [{
					firstTips: '网站',
					span: '博客',
					up: '项目',
					show: '资源',
				}],
			}],
		}],
		hello: 'Main Dis My Blogs',
		maxim: [{
			tip: '座右铭',
			title1: '愿你看轻一切真相后，',
			title2: '依旧热爱你的家人和朋友。',
		}],
		technology: [{
			tip: '关注偏好',
			title: '资源分享',
			bottomTip: '各种小说',
		}],
		game: [{
			tip: '爱好游戏',
			title: '饥荒',
			uid: 'Krylin',
		}],
		single: [{
			tip: '',
			conect1: '',
			strong1: '',
			conect2: '',
			strong2: '',
			conect3: '',
		}],
	},
]
