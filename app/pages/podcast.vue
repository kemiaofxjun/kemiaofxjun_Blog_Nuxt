<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { siteLinkItems } from '../sitelink'
const activeTab = ref(0); // 默认激活第一个标签页

interface LinkStatus {
  link: string
  latency: number
}

interface StatusData {
  link_status: LinkStatus[]
}

interface CacheData {
  data: StatusData
  timestamp: number
}

const CACHE_KEY = 'statusTagsData'
const CACHE_EXPIRATION = 30 * 60 * 1000 // 半小时
const JSON_URL = 'https://agent.service.myxz.top/result.json'

function applyStatusTags(data: StatusData) {
  const linkStatus = data.link_status
  document.querySelectorAll('.title').forEach(card => {
    if (!(card instanceof HTMLAnchorElement) || !card.href) return
    
    const link = card.href.replace(/\/$/, '')
    const statusTag = document.createElement('div')
    statusTag.classList.add('status-tag')
    
    const status = linkStatus.find(item => 
      item.link.replace(/\/$/, '') === link
    )
    
    if (!status) return
    
    let latencyText = '未知'
    let className = 'status-tag-red'
    
    if (status.latency !== -1) {
      latencyText = `${status.latency.toFixed(2)} s`
      if (status.latency <= 2) className = 'status-tag-green'
      else if (status.latency <= 5) className = 'status-tag-light-yellow'
      else if (status.latency <= 10) className = 'status-tag-dark-yellow'
    }
    
    statusTag.textContent = latencyText
    statusTag.classList.add(className)
    card.style.position = 'relative'
    card.appendChild(statusTag)
  })
}

function fetchDataAndUpdateUI() {
  fetch(JSON_URL)
    .then(response => response.json())
    .then(data => {
      applyStatusTags(data)
      const cacheData: CacheData = {
        data,
        timestamp: Date.now()
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    })
    .catch(error => console.error('Error fetching status data:', error))
}

function addStatusTagsWithCache() {
  const cachedData = localStorage.getItem(CACHE_KEY)
  
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData) as CacheData
    if (Date.now() - timestamp < CACHE_EXPIRATION) {
      applyStatusTags(data)
      return
    }
  }
  
  fetchDataAndUpdateUI()
}

onMounted(() => {
  setTimeout(addStatusTagsWithCache, 0)
})
</script>

<template>
<div class="feed-label">
	<h2> 站点详情 </h2>
</div>

<div class="tabs-container">
	<div class="tabs">
		<button v-for="(tab, index) in siteLinkItems" :key="tab.name" @click="activeTab = index" :class="{ 'active': activeTab === index }">
			{{ tab.name }}
		</button>
	</div>

    <div class="sitelink-list">
        <div class="sitelink-item" v-for="(site, index) in siteLinkItems[activeTab].Item" :key="index">
            <img width="150" height="150" alt="Syntax" class="cover" :src="site.image">
            <main>
                <header class="header">
                    <div class="title">
                        <a :href="site.link" rel="noopener noreferrer" target="_blank">
                            {{ site.name }}
                        </a>
                        <span class="iconify i-ph:link-duotone" aria-hidden="true" style="font-size: 0.8em;"></span>
                    </div>
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
.float-in-leave-active {
    position: revert
}

.center {
    margin-inline:auto;max-width: 100%
}

.center,.tabs {
    width: -moz-fit-content;
    width: fit-content
}

.tabs {
    display: flex;
    flex-wrap: wrap;
    font-size: .9em;
    gap: .5em;
    justify-content: center;
    line-height: 1.4;
    margin: 0 auto
}

.tabs,button {
    position: relative
}

button {
    border-radius: .4em;
    color: var(--c-text-2);
    margin-bottom: .5em;
    padding: .3em .5em;
    transition: all .2s
}

button:hover {
    background-color: var(--c-bg-soft);
    color: var(--c-text)
}

button:after,button:before {
    border-radius: 1em;
    bottom: -.5em;
    display: block;
    height: 2px;
    left: .8em;
    pointer-events: none;
    position: absolute;
    right: .8em
}

button:after {
    background-color: var(--c-border);
    content: "";
    left: -.8em;
    right: -.8em
}

button.active {
    background-color: var(--ld-bg-card);
    box-shadow: 0 1px .5em var(--ld-shadow);
    color: var(--c-text)
}

button.active:before {
    background-color: var(--c-primary);
    content: "";
    z-index: 1
}

.tab-content {
    padding: .5em 0
}


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