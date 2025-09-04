export interface siteTabs {
	name: string
	itemnumber: string
	Item: Item[]
}

export interface Item {
	name: string
	image: string
	link: string
	desc: string
	service: service[]
}

export interface service {
	name: string
	image: string
	link: string
}

export const siteLinkItems: siteTabs[] = [
	{
		name: '服务',
		itemnumber: '3',
		Item: [
			{
				name: '主页',
				image: 'https://www.zhilu.site/api/avatar.png',
				link: 'https://home.kemeow.top',
				desc: '',
				service: [
					{
						name: 'Vercel',
						image: '/assets/img/link/service/vercel.jpg',
						link: 'https://vercel.com/',
					},
				],
			},
			{
				name: '网站监测',
				image: 'https://imgtg.kemeow.top/file/AgACAgUAAyEGAAScqokCAAMaaKmTWVxkdidV-MMtbWaBcKQWZJYAAoHEMRuLMFFVq_PMXQkvPxIBAAMCAAN4AAM2BA.webp',
				link: 'https://status.kemeow.top',
				desc: '',
				service: [
					{
						name: 'Vercel',
						image: '/assets/img/link/service/vercel.jpg',
						link: 'https://vercel.com',
					},
				],
			},
			{
				name: '每日热榜',
				image: 'https://imgtg.kemeow.top/file/AgACAgUAAyEGAAScqokCAANAaKxl6XDgJW0LfTgQ8E9qbKk4xFoAAhDHMRv-Y2hVylN89o3A7O8BAAMCAAN3AAM2BA.webp',
				link: 'https://newsnow.kemeow.top',
				desc: '',
				service: [
					{
						name: 'Vercel',
						image: '/assets/img/link/service/vercel.jpg',
						link: 'https://vercel.com',
					},
				],
			},
		],
	},
	// {
	// 	name: '服务',
	// 	itemnumber: '1',
	// 	Item: [
	// 		{
	// 			name: '说说',
	// 			image: 'https://sourceimage.s3.bitiful.net/myxz.avif',
	// 			link: 'https://blog-v3.myxz.top',
	// 			desc: '',
	// 			service: [
	// 				{
	// 					name: 'EdgeOne',
	// 					image: '',
	// 					link: '',
	// 				},
	// 			],
	// 		},
	// 	],
	// },
]
