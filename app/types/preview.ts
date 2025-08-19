import type { ReadTimeResults } from 'reading-time'

const _appConfig = useAppConfig()

export type PreviewOrderType = keyof typeof _appConfig.preview.order

export default interface previewProps extends Partial<{
	path: string
	readingTime: ReadTimeResults

	title: string
	description: string
	link: string
	date: string
	updated: string
	published: string
	categories: string[]
	tags: string[]
	type: 'tech' | 'story'
	image: string
	cover_revert: boolean
	hideInfo: boolean
	recommend: number
	references: { title?: string, link?: string }[]

    // 顶部额外内容
}> { }
