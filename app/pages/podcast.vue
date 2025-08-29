<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { siteLinkItems } from '../sitelink'
const activeTab = ref(0); // 默认激活第一个标签页
// 检测工具
interface LinkStatus {
  link: string
  latency: number
}

interface CacheData {
  data: LinkStatus[]
  timestamp: number
}

function addStatusTagsWithCache(url: string) {
  const CACHE_KEY = "statusTagsData"
  
  const processStatusTags = (data: LinkStatus[]) => {
    document.querySelectorAll<HTMLAnchorElement>(".header").forEach(link => {
      if (!link.href) return
      
      const cleanHref = link.href.replace(/\/$/, "")
      const statusDiv = document.createElement("div")
      statusDiv.classList.add("state")
      
      const matchedStatus = data.find(item => 
        item.link.replace(/\/$/, "") === cleanHref
      )
      
      if (matchedStatus) {
        let text: string
        let statusClass: string
        
        if (matchedStatus.latency === -1) {
          text = 'ERR'
          statusClass = "error"
        } else {
          text = `${(matchedStatus.latency * 1000).toFixed(0)} ms`
          if (matchedStatus.latency <= 3) statusClass = "success"
          else if (matchedStatus.latency <= 5) statusClass = "success"
          else if (matchedStatus.latency <= 10) statusClass = "success"
          else statusClass = "error"
        }
        
        statusDiv.textContent = text
        statusDiv.classList.add(statusClass)
        
        link.style.position = "relative"
        link.appendChild(statusDiv)
      }
    })
  }

  // 尝试从缓存获取数据
  const cachedData = localStorage.getItem(CACHE_KEY)
  if (cachedData) {
    const { data, timestamp }: CacheData = JSON.parse(cachedData)
    if (Date.now() - timestamp < 1800000) { // 30分钟有效期
      return processStatusTags(data)
    }
  }

  // 获取新数据
  fetch(url)
    .then(res => res.json())
    .then((data: LinkStatus[]) => {
      processStatusTags(data)
      const cache: CacheData = {
        data,
        timestamp: Date.now()
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    })
    .catch(err => console.error("Error fetching status data:", err))
}

onMounted(() => {
  setTimeout(() => {
    addStatusTagsWithCache("https://site-action-tanzheng.edgeone.app/result.json")
  }, 0)
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