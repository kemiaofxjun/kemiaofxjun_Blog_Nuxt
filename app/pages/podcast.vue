<script lang="ts" setup>
import {customPodCast} from '~/podcast';

</script>

<template>
    <h2 class="feed-label"> 收听的播客 </h2>
    <main class="container">
        <div v-for="(podcast, index) in customPodCast" :key="index">
        <div class="tabs">
            <button>{{ podcast.tabname }}</button>
        </div>
        <div class="tab-content" v-for="(content, card) in podcast.tabItem" :key="card">
            <div class="podcast-list" style="margin-top: 20px;">
                <div class="podcast-item">
                    <img :src="content.podcastTmage">
                        <main>
                            <header>
                                <h2 class="title">
                                    <a :herf="content.podcastLink" rel="noopener noreferrer" target="_blank">{{ content.podcastTitle }}</a>
                                    <span class="iconify i-ph:link-duotone" aria-hidden="true" style="font-size: 0.8em;"></span>
                                </h2>
                            </header>
                            <section>
                                <div class="badges" v-for="(badges, badgesIndex) in content.podcastBadge" :key="badgesIndex">
                                    <a :herf="badges.BadgeLink" rel="noopener noreferrer" target="_blank" class="badge badge-img">
                                        <img class="badge-icon" :src="badges.BadgeImage" :alt="badges.BadgeName"></img>
                                        <span class="badge-text">{{ badges.BadgeName }}</span>
                                    </a>
                                </div>
                                <div class="description">
                                    {{ content.podcastDesc }}
                                </div>
                            </section>
                            <footer>
                                <h5 class="rss">
                                    <span class="iconify i-ph:rss-fill" aria-hidden="true"></span>
                                    <a :href="content.podcastLink" rel="noopener noreferrer" target="_blank">
                                        {{ content.podcastLink }}
                                    </a>
                                </h5>
                            </footer>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style lang="css" scoped>
.feed-label  {
    margin: 2rem 1rem -1rem
}

.podcast-list  {
    margin: 1rem
}

@media (max-width: 639px) {
    .podcast-list  {
        padding:1rem
    }

    .podcast-list .podcast-item  {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr;
        justify-items: center
    }

    .podcast-list .podcast-item main  {
        font-size: .9em;
        line-height: 1.4;
        overflow-wrap: break-word
    }
}

.podcast-item  {
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

.podcast-item :hover {
    box-shadow: 0 .5em 1em var(--ld-shadow);
    transform: translateY(-2px)
}

.podcast-item main  {
    display: flex;
    flex-direction: column;
    justify-content: space-between
}

.podcast-item main section  {
    flex: 1
}

.podcast-item main header  {
    margin-bottom: .5rem
}

.podcast-item .title  {
    align-items: center;
    color: var(--c-text);
    display: flex;
    font-size: 1.2em;
    gap: .5rem;
    line-height: 1.2;
    margin: 0
}

.podcast-item .cover  {
    border-radius: .8em;
    height: 150px;
    width: 150px
}

.podcast-item .badges  {
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
    margin-bottom: .2em;
    margin-top: .2em
}

.podcast-item .description  {
    color: var(--c-text-2);
    margin: .5em 0
}

.podcast-item footer  {
    color: var(--c-text-2);
    font-size: .9em
}

.podcast-item footer .podcast-item footer .rss  {
    align-items: center;
    display: flex;
    gap: .5rem
}
</style>