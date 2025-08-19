<script setup lang="ts">
import type previewProps from  '~/types/preview'

defineOptions({ inheritAttrs: false })
const props = defineProps<previewProps>()

const appConfig = useAppConfig()

const categoryLabel = computed(() => props.categories?.[0])
const categoryIcon = computed(() => getCategoryIcon(categoryLabel.value))

const shareText = `【${appConfig.title}】${props.title}\n\n${
	props.description ? `${props.description}\n\n` : ''}${
	new URL(props.path!, appConfig.url).href}`

const { copy, copied } = useCopy(shareText)
</script>

<template>
    <div>
        <div id="l_cover">
            <div class="l_cover wiki sa-load-hidden" style="opacity: 1; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); visibility: visible; transition: all, opacity 0.8s ease-in-out, transform 0.8s ease-in-out;">
                <article class="cover-wrap md-text">
                    <div class="preview cover">
                        <img class="lazy entered loaded" v-if="icon in previewProps.icon" :src="icon"></img>
                    </div>
                    <div class="cover-title" v-if="title in previewProps.title">
                        <span>
                            {{ title }}
                        </span>
                    </div>
                    <div class="description" v-if="description in previewProps.description">
                        {{ description }}
                    </div>
                    <div class="start-wrap">
                        <a class="button start gradient" href="#start">
                            开始使用
                        </a>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#l_cover {
	min-height: 64px;
}
.l_cover {
	height: 100vh;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	&.wiki {
		.cover-wrap {
			max-width: 500px;
			.preview {
				margin-bottom: 2rem;
				img {
					object-fit: contain;
					min-width: 180px;
					min-height: 180px;
					max-height: 35vh;
					max-width: 100%;
				}
			}
		}
	}
	.cover-wrap {
		margin-bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.cover-title {
			font-weight: 700;
			font-size: 1.5rem;
			margin: 1rem 0;
			line-height: 1.2;
		}
		.description {
			margin: 1rem 0;
			text-align: justify;
		}
		.start-wrap {
			margin: 2rem 0;
			flex-shrink: 0;
			a {
				&.start {
					display: inline-block;
				}
			}
		}
	}
}
.md-text {
	max-width: 100%;
	padding: 1rem;
	color: var(--text-p1);
	line-height: 1.7;
	word-break: break-word;
	&:first-child {
		margin-top: 0;
	}
	& > div {
		margin: 1rem 0;
	}
}
a {
	&.button {
		&.start {
			border-radius: 100px;
			background: var(--text-p1);
			color: var(--card);
			&.gradient {
				transition: .38s ease-out;
				position: relative;
				z-index: 0;
				background: linear-gradient(to right, #4c95fa, #38c9fa, #24f9c4, #24f9c4, #38c9fa, #4c95fa);
				background-size: 1000%;
				color: #fff;
				text-shadow: 0 0 1px rgba(0, 0, 0, .12);
				animation: glow 60s linear infinite;
			}
		}
	}
}
</style>
