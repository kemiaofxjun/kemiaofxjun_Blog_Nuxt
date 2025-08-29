<script setup lang="ts">
import { siteLinkItems } from '~/siteCard'
</script>

<template>
    <div class="sitelink-list">
        <div v-for="tabs in siteLinkItems" :key="tabs.name">
            <div class="sitelink-item" v-for="site in tabs">
                <img width="150" height="150" alt="Syntax" class="cover" :src="site.link">
                <main>
                    <header>
                        <h2 class="title">
                            <a :href="site.link" rel="noopener noreferrer" target="_blank">
                                {{ site.name }}
                            </a>
                            <span class="iconify i-ph:link-duotone" aria-hidden="true" style="font-size: 0.8em;"></span>
                        </h2>
                    </header>
                    <section>
                        <div class="badges" v-for="service in site.service" :key="service.name">
                            <a :href="service.link" rel="noopener noreferrer" target="_blank" class="badge badge-img">
                                <img :alt="service.name" class="badge-icon" :src="service.image">
                                <span class="badge-text">
                                    {{ service.name }}
                                </span>
                            </a>
                        </div>
                        <p class="description">
                            {{ site.desc }}
                        </p>
                    </section>
                    <footer>
                        <h5 class="rss">
                            <span class="iconify i-ph:rss-fill" aria-hidden="true"></span>
                            <a :href="site.link" rel="noopener noreferrer" target="_blank">
                                {{ site.link }}
                            </a>
                        </h5>
                    </footer>
                </main>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.feed-label {
    margin: 2rem 1rem -1rem
}

.sitelink-list {
    margin: 1rem
}

@media (max-width: 639px) {
    .sitelink-list {
        padding:1rem
    }

     .sitelink-item {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr;
        justify-items: center
    }

     .sitelink-item main {
        font-size: .9em;
        line-height: 1.4;
        overflow-wrap: break-word
    }
}

.sitelink-item {
    animation: float-in .2s var(--delay) backwards;
    background: var(--c-bg);
    background-color: var(--ld-bg-card);
    border-radius: .8em;
    box-shadow: var(--ld-shadow);
    box-shadow: 0 .1em .2em var(--ld-shadow);
    display: grid;
    gap: 1rem;
    grid-template-columns: 150px 1fr;
    margin-bottom: 1rem;
    padding: 1rem;
    transition: all .2s
}

.sitelink-item:hover {
    box-shadow: 0 .5em 1em var(--ld-shadow);
    transform: translateY(-2px)
}

.sitelink-item main {
    display: flex;
    flex-direction: column;
    justify-content: space-between
}

.sitelink-item main section {
    flex: 1
}

.sitelink-item main header {
    margin-bottom: .5rem
}

.sitelink-item .title {
    align-items: center;
    color: var(--c-text);
    display: flex;
    font-size: 1.2em;
    gap: .5rem;
    line-height: 1.2;
    margin: 0
}

.sitelink-item .cover {
    border-radius: .8em;
    height: 150px;
    width: 150px
}

.sitelink-item .badges {
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
    margin-bottom: .2em;
    margin-top: .2em
}

.sitelink-item .description {
    color: var(--c-text-2);
    margin: .5em 0
}

.sitelink-item footer {
    color: var(--c-text-2);
    font-size: .9em
}

.sitelink-item footer,.sitelink-item footer .rss {
    align-items: center;
    display: flex;
    gap: .5rem
}
</style>