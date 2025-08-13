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