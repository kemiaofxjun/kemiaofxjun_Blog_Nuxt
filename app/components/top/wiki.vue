<script setup lang="ts">
const route = useRoute()
const { data: post } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
const repo = post.value?.wiki
</script>

<template>
    <div class="l_cover wiki">
        <article class="cover-wrap md-text">
            <ZRawLink v-if="repo">
                <div class="preview cover">
                    <img src={{ repo.imgsrc }}>
                </div>
                <div class="cover-title">
                    <span>
                        {{ repo.title }}
                    </span>
                </div>
                <div class="description">
                    {{ repo.description }}
                </div>
                <div class="start-wrap">
                    <a class="button start gradient" href={{ repo.href }}>
                        开始使用
                    </a>
                </div>
            </ZRawLink>
        </article>
    </div>
    <hr>
</template>

<style lang="scss" scoped>
.l_cover {
    height: 100vh;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
}
.l_cover.wiki .cover-wrap {
    max-width: 500px;
}
.l_cover .cover-wrap {
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: var(--fsp);
}
.md-text {
    max-width: 100%;
    padding: 1rem;
    color: var(--text-p1);
    line-height: 1.6;
    word-break: break-word;
}
.l_cover.wiki .cover-wrap .preview {
    margin-bottom: 2rem;
}
.md-text>div {
    margin: var(--gap-p) 0;
}
.l_cover .cover-wrap .cover-title {
    font-weight: 700;
    font-size: 1.5rem;
    margin: 1rem 0;
    line-height: 1.2;
    color: var(--text);
}
.l_cover .cover-wrap .description {
    margin: 1rem 0;
}
.l_cover .cover-wrap .start-wrap {
    margin: 2rem 0;
    flex-shrink: 0;
}
@media (prefers-color-scheme: dark) {
    :root:not([data-theme]) a.button.start.gradient {
        transition: .38s ease-out;
        z-index: 0;
        background: linear-gradient(to right, #4c95fa, #38c9fa, #24f9c4, #24f9c4, #38c9fa, #4c95fa);
        background-size: 1000%;
        color: #fff;
        text-shadow: 0 0 1px rgba(0, 0, 0, .12);
        animation: glow 60s linear infinite;
    }
}
.l_cover .cover-wrap .start-wrap a.start {
    display: inline-block;
}
a.button.start.gradient {
    position: relative;
}
a.button.start {
    border-radius: 100px;
    background: var(--text-p1);
    color: var(--card);
}
a.button {
    font-weight: 500;
    line-height: 1;
    padding: .75rem 2rem;
    border-radius: 8px;
    font-size: .9375rem;
    user-select: none;
}
<style>