<script setup lang="ts">
import { essays } from '~~/blog.config'
import essays_data from '~/essay_data'
const essay_Data = ref(essay_data);

const appConfig = useAppConfig()
const layoutStore = useLayoutStore()

layoutStore.setAside(['blog-stats', 'contentivity', 'blog-log'])

useSeoMeta({
    title: '说说',
    ogType: 'profile',
    description: `${appConfig.title}的说说页面。`,
})

const essays_Data = {
    博主: essays.author,
}

const { data: postLink } = await useAsyncData('/essays', () => queryContent('/essays').findOne())
</script>

<template>
    <header class="link-reminder">
        <div class="content">
            <p><Icon name="ph:newspaper-clipping-bold" />我会通过快捷方式进行写作</p>
            <p>
                我制作了本站的
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <ProseA>Ispeak快捷发表</ProseA>，可通过快捷列表来进行使用
            </p>
        </div>
        <div class="operations">
            <ProseA href="https://kkadmin.myxz.top" icon="ph:rss-simple-bold">
                Ispeak后台管理
            </ProseA>
            <ProseA href="https://ispeak_biubiu.myxz.top" icon="ph:list-plus-bold">
                Ispeak网页版发表
            </ProseA>
        </div>
    </header>

    <div class="essay_content">
        <section class="essay_content_message">
            <ul class="essay_content_list">
                <li class="essay_content_item" v-for="(item, index) in essay_Data.essay_list" :key="item.essay_list" v-if="index < 30">
                    <div class="essay_items_content">
                        <p class = "essay_datacont">
                            {{ item.content }}
                            <div v-if="item.image" class="essay_container_img">
                                <div v-for="iten, indey in item.image" :key="iten.id || indey">
                                    <a class="bber-content-img" :href="url_for(item.image[indey])" target="_blank" data-fancybox="gallery" data-caption="">
                                        <img :src="url_for(item.image[indey])"></img>
                                    </a>
                                </div>
                                <div class="bber_content_noimg"></div>
                                <div class="bber_content_noimg"></div>
                                <div class="bber_content_noimg"></div>
                            </div>
                        </p>
                    </div>
                </li>
            </ul>
        </section>
    </div>
</template>