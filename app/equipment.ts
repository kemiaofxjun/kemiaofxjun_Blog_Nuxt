export interface item {
	class_name: string
	class_desc: string
	infoname: string
	List: entry[]
}

export interface entry {
	name: string
	custom: string
	opinion: string
	details_flink: string
	image: string
}

export const equipment: item[] = [
	{
		class_name: '日常生产力',
		class_desc: '平常生活、工作增添效率的产品',
		infoname: '详情',
		List: [
			{
				name: 'IQOO 11',
				custom: '主力 | 512G',
				opinion: '个人评价不搞机的情况下比较稳定，不是高强度游戏党，感觉不错。',
				details_flink: 'https://shop.vivo.com.cn/product/10007952?skuId=125337',
				image: 'https://img.314926.xyz/images/2025/07/30/iqoo11.webp',
			},
		],
	},
]
