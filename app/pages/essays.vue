<script setup lang="ts">
import { domainToUnicode } from 'url';
import { ref, onMounted } from 'vue';
const layoutStore = useLayoutStore()

layoutStore.setAside(['blog-stats', 'connectivity', 'blog-log'])

// 定义说说数据类型
interface TalkItem {
  user: string;
  avatar: string;
  date: string;
  content: string;
  tags: string[];
  text: string;
}

// 响应式数据：说说列表
const talkList = ref<TalkItem[]>([]);

// 缓存相关常量
const CACHE_KEY = 'talksCache';
const CACHE_TIME_KEY = 'talksCacheTime';
const CACHE_DURATION = 30 * 60 * 1000; // 30分钟（毫秒）

// 生成图标SVG（直接返回字符串）
const generateIconSVG = (): string => {
  return `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" class="is-badge icon"><path d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z" fill="#1da1f2"></path></svg>`;
};

// 时间格式化函数（带类型）
const formatTime = (time: string | number): string => {
  const d = new Date(time);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 内容格式化函数（核心逻辑，带类型）
const formatTalk = (item: any, baseUrl: string): TalkItem => {
  const date = formatTime(item.createdAt);
  let content = item.content;
  const imgs = item.imgs ? item.imgs.split(',') : [];
  
  // 链接替换
  content = content
    .replace(/$$(.*?)$$$(.*?)$/g)
    .replace(/- $$ $$/g, '⚪')
    .replace(/- $$x$$/g, '⚫')
    .replace(/\n/g, '<br>');

  // 图片处理
  if (imgs.length > 0) {
    const imgDiv = document.createElement('div');
    imgDiv.className = 'zone_imgbox';
    imgs.forEach((e: string) => {
      const figurefother = document.createElement('figure');
      figurefother.className = "img-item";

      const imgLink = document.createElement('figure');
      imgLink.className = 'image talk-img';
      
      const imgTag = document.createElement('img');
      imgTag.className="image";
      imgTag.src = e;
      imgLink.appendChild(imgTag);
      figurefother.appendChild(imgLink)
      imgDiv.appendChild(figurefother);
    });
    content += imgDiv.outerHTML;
  }

  // 外链处理
  if (item.externalUrl) {
    content += `
      <div class="shuoshuo-external-link">
        <a class="external-link" href="${item.externalUrl}" target="_blank" rel="external nofollow noopener noreferrer">
          <div class="external-link-left" style="background-image: url(${item.externalFavicon})"></div>
          <div class="external-link-right">
            <div class="external-link-title">${item.externalTitle}</div>
            <div>点击跳转<i class="fa-solid fa-angle-right"></i></div>
          </div>
        </a>
      </div>
    `;
  }

  // 解析扩展字段（使用类型断言）
  const ext = JSON.parse(item.ext || '{}') as Record<string, any>;

  // 音乐处理
  if (ext.music?.id) {
    const music = ext.music;
    content += `
      <meting-js 
        server="${music.server}" 
        type="${music.type}" 
        id="${music.id}" 
        api="${music.api}"
      ></meting-js>
    `;
  }

  // 豆瓣电影处理
  if (ext.doubanMovie?.id) {
    const movie = ext.doubanMovie;
    content += `
      <a class="douban-card" href="${movie.url}" target="_blank">
        <div class="douban-card-bgimg" style="background-image: url('${movie.image}')"></div>
        <div class="douban-card-left">
          <div class="douban-card-img" style="background-image: url('${movie.image}')"></div>
        </div>
        <div class="douban-card-right">
          <div class="douban-card-item"><span>电影名: </span><strong>${movie.title}</strong></div>
          <div class="douban-card-item"><span>导演: </span><span>${movie.director || '未知导演'}</span></div>
          <div class="douban-card-item"><span>评分: </span><span>${movie.rating || '暂无评分'}</span></div>
          <div class="douban-card-item"><span>时长: </span><span>${movie.runtime || '未知时长'}</span></div>
        </div>
      </a>
    `;
  }

  // 豆瓣书籍处理
  if (ext.doubanBook?.id) {
    const book = ext.doubanBook;
    content += `
      <a class="douban-card" href="${book.url}" target="_blank">
        <div class="douban-card-bgimg" style="background-image: url('${book.image}')"></div>
        <div class="douban-card-left">
          <div class="douban-card-img" style="background-image: url('${book.image}')"></div>
        </div>
        <div class="douban-card-right">
          <div class="douban-card-item"><span>书名: </span><strong>${book.title}</strong></div>
          <div class="douban-card-item"><span>作者: </span><span>${book.author}</span></div>
          <div class="douban-card-item"><span>出版年份: </span><span>${book.pubDate}</span></div>
          <div class="douban-card-item"><span>评分: </span><span>${book.rating}</span></div>
        </div>
      </a>
    `;
  }

  // 视频处理
  if (ext.video?.type) {
    const video = ext.video;
    if (video.type === 'bilibili') {
      content += `
        <div style="position: relative; padding: 30% 45%; margin-top: 10px;">
          <iframe 
            style="position: absolute; width: 100%; height: 100%; left: 0; top: 0; border-radius: 12px;" 
            src="${video.value}&autoplay=0"
            scrolling="no" 
            frameborder="no" 
            allowfullscreen
          ></iframe>
        </div>
      `;
    } else if (video.type === 'youtube') {
      content += `
        <div style="position: relative; padding: 30% 45%; margin-top: 10px;">
          <iframe 
            width="100%"
            style="position: absolute; width: 100%; height: 100%; left: 0; top: 0; border-radius: 12px;"
            src="${video.value}"
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen
          ></iframe>
        </div>
      `;
    }
  }

  return {
    user: item.user.nickname || '匿名',
    avatar: item.avatarUrl || 'https://p.liiiu.cn/i/2024/03/29/66061417537af.png',
    date,
    content,
    tags: item.tags ? item.tags.split(',').filter((tag: string) => tag.trim()) : ['无标签'],
    text: content.replace(/$$(.*?)$$$(.*?)$/g, '[链接]' + `${imgs.length ? '[图片]' : ''}`)
  };
};

// 数据获取与渲染函数
const fetchAndRenderTalks = async (): Promise<void> => {
  const url = 'https://avvlqyndvewl.ap-northeast-1.clawcloudrun.com/api/memo/list';
  
  // 读取缓存
  const cachedData = localStorage.getItem(CACHE_KEY);
  const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
  const currentTime = Date.now();

  // 检查缓存有效性
  if (cachedData && cachedTime && (currentTime - Number(cachedTime) < CACHE_DURATION)) {
    try {
      const data = JSON.parse(cachedData) as any[];
      talkList.value = data.map((item: any) => formatTalk(item, url));
      return;
    } catch (error) {
      console.error('缓存数据解析失败:', error);
    }
  }

  // 无有效缓存时请求接口
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ size: 30 })
    });

    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    
    const result = await response.json();
    
    if (result.code === 0 && result.data?.list) {
      // 缓存新数据
      localStorage.setItem(CACHE_KEY, JSON.stringify(result.data.list));
      localStorage.setItem(CACHE_TIME_KEY, currentTime.toString());
      // 格式化并更新列表
      talkList.value = result.data.list.map((item: any) => formatTalk(item, url));
    } else {
      console.error('接口返回数据格式错误:', result);
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

// 评论跳转函数
const goComment = (text: string): void => {
  const textarea = document.querySelector('.atk-textarea') as HTMLTextAreaElement | null;
  if (textarea) {
    const match = text.match(/<div class="talk_content_text">([\s\S]*?)<\/div>/);
    const content = match ? match[1] : '';
    textarea.value = `> ${content}\n\n`;
    textarea.focus();
    // 假设btf是全局对象（需确保全局注册）
    if (window.btf?.snackbarShow) {
      window.btf.snackbarShow('已为您引用该说说，不删除空格效果更佳');
    }
  }
};

// 生命周期：挂载后加载数据
onMounted(() => {
  fetchAndRenderTalks();
});
</script>

<template>
<div class="page-essay">
  <div class="talk-container">
    <div id="talk" class="talks-list">
      <div v-for="(item, index) in talkList" :key="index" class="talk-item">
      <!-- 说说元信息 -->
        <div class="talk-meta">
          <img :src="item.avatar" class="no-lightbox avatar" alt="用户头像" >
            <div class="info">
              <span class="talk-nick">
                {{ item.user }} 
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" class="is-badge icon" style="width: 15px; padding-top: 3px;">
                  <path d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z" fill="#1da1f2"></path>
                </svg>
              </span>
              <span class="talk-date">{{ item.date }}</span>
            </div>
        </div>
        <!-- 说说内容 -->
        <div class="talk-content" v-html="item.content"></div>
             
        <!-- 底部标签 -->
        <div class="talk-bottom">
          <div class="talk-tags">
            <span class="tag">🏷️{{ item.tags.join(' ') }}</span>
            <span class="location">
              <span data-v-1f067c47="" class="iconify i-ph:map-pin-bold location-icon" aria-hidden="true"></span>
              {{ item.location }}
            </span>
          </div>
          <a href="javascript:;" class="comment-link" @click="goComment(item.text)">
            <span class="iconify i-ph:chats-bold icon"></span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
<PostComment key="/essays" />
</template>

<style scoped>
.essay-stats {
    align-items: flex-end;
    color: #eee;
    display: flex;
    flex-direction: column;
    font-family: var(--font-monospace);
    gap: .1rem;
    opacity: .7;
    text-shadow: 0 4px 5px rgba(0,0,0,.5)
}

.essay-stats .powered-by {
    font-size: .7rem
}

.essay-stats .essay-more {
    align-items: center;
    display: flex;
    font-size: .8rem;
    gap: 4px;
    opacity: .8;
    transition: all .2s
}

.essay-stats .essay-more:hover {
    color: #fff;
    opacity: 1
}

.page-essay {
    animation: float-in .2s backwards;
    margin: 1rem
}

.page-essay .talk-item {
    animation: float-in .3s backwards;
    animation-delay: var(--delay);
    border-radius: 8px;
    box-shadow: 0 0 0 1px var(--c-bg-soft);
    display: flex;
    flex-direction: column;
    gap: .5rem;
    margin-bottom: 1rem;
    padding: 1rem
}

.page-essay .talk-meta {
    align-items: center;
    display: flex;
    gap: 10px
}

.page-essay .talk-meta .avatar {
    border-radius: 2em;
    box-shadow: 2px 4px 1rem var(--ld-shadow);
    width: 3em
}

.page-essay .talk-meta .info .talk-nick {
    align-items: center;
    display: flex;
    gap: 5px
}

.page-essay .talk-meta .info .talk-nick .verified {
    color: var(--c-primary);
    font-size: 16px
}

.page-essay .talk-meta .info .talk-date {
    color: var(--c-text-3);
    font-family: var(--font-monospace);
    font-size: .8rem
}

.page-essay .talk-content {
    color: var(--c-text-2);
    display: flex;
    flex-direction: column;
    gap: .5rem;
    line-height: 1.6
}

.page-essay .talk-content .talk_content_link {
    background: linear-gradient(var(--c-primary-soft),var(--c-primary-soft)) no-repeat bottom/100% .1em;
    color: var(--c-primary);
    margin: 0 -.1em;
    padding: 0 .1em;
    text-decoration: none;
    transition: all .2s
}

.page-essay .talk-content .talk_content_link:hover {
    background-size: 100% 100%;
    border-radius: .3em
}

.page-essay .talk-content .zone_imgbox {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(3,1fr)
}

.page-essay .talk-content .zone_imgbox .img-item {
    border-radius: 8px;
    overflow: hidden;
    padding-bottom: 100%;
    position: relative
}

.page-essay .talk-content .zone_imgbox .img-item img {
    cursor: zoom-in;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    -o-object-fit: cover;
    object-fit: cover;
    position: absolute;
    transition: transform .3s;
    width: 100%
}

.page-essay .talk-content .zone_imgbox .img-item img:hover {
    transform: scale(1.05)
}

.page-essay .talk-content .video-container {
    border-radius: 8px;
    overflow: hidden;
    padding-bottom: 56.25%;
    position: relative;
    width: 100%
}

.page-essay .talk-content .video-container iframe,.page-essay .talk-content .video-container video {
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
    width: 100%
}

.page-essay .talk-content .video-container .online-video {
    -o-object-fit: cover;
    object-fit: cover
}

.page-essay .talk-content .douban-card {
    background-color: var(--c-bg-2);
    box-shadow: 0 0 0 1px var(--c-bg-soft);
    display: flex;
    height: 100px;
    overflow: hidden;
    position: relative;
    text-decoration: none
}

.page-essay .talk-content .douban-card .douban-card-bgimg {
    background-position: 50%;
    background-size: cover;
    filter: blur(15px);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: .3;
    position: absolute
}

.page-essay .talk-content .douban-card .douban-card-left {
    flex: 0 0 80px;
    padding: 10px;
    position: relative
}

.page-essay .talk-content .douban-card .douban-card-left .douban-card-img {
    background-position: 50%;
    background-size: cover;
    border-radius: 8px;
    height: 100%;
    width: 100%
}

.page-essay .talk-content .douban-card .douban-card-right {
    flex: 1;
    padding: 10px;
    position: relative
}

.page-essay .talk-content .douban-card .douban-card-right .douban-card-item {
    color: var(--c-text);
    font-size: .8rem
}

.page-essay .talk-content .external-link {
    background-color: var(--c-bg-2);
    box-shadow: 0 0 0 1px var(--c-bg-soft);
    overflow: hidden;
    transition: all .2s
}

.page-essay .talk-content .external-link a {
    align-items: center;
    display: flex;
    gap: 12px;
    height: 60px;
    padding: 8px;
    text-decoration: none
}

.page-essay .talk-content .external-link a .link-left {
    flex-shrink: 0;
    height: 44px;
    overflow: hidden;
    width: 44px
}

.page-essay .talk-content .external-link a .link-left img {
    border-radius: 8px;
    height: 100%;
    -o-object-fit: contain;
    object-fit: contain;
    transition: transform .3s;
    width: 100%
}

.page-essay .talk-content .external-link a .link-right {
    align-items: center;
    display: flex;
    flex: 1;
    gap: 6px
}

.page-essay .talk-content .external-link a .link-right .link-title {
    color: var(--c-text-2);
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: .95rem;
    transition: all .2s
}

.page-essay .talk-content .external-link a .link-right .icon {
    color: var(--c-text-3);
    transition: transform .2s ease
}

.page-essay .talk-content .external-link a:hover .link-left img {
    transform: scale(1.05)
}

.page-essay .talk-content .external-link a:hover .icon {
    transform: translate(4px) scale(1.6)
}

.page-essay .talk-bottom {
    align-items: center;
    color: var(--c-text-3);
    display: flex;
    justify-content: space-between
}

.page-essay .talk-bottom .talk-tags {
    display: flex;
    font-size: .7rem;
    gap: 4px
}

.page-essay .talk-bottom .talk-tags .location,.page-essay .talk-bottom .talk-tags .tag {
    background-color: var(--c-bg-2);
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    padding: 2px 4px;
    transition: all .2s
}

.page-essay .talk-bottom .talk-tags .location:hover,.page-essay .talk-bottom .talk-tags .tag:hover {
    opacity: .8
}

.page-essay .talk-bottom .talk-tags .location {
    color: var(--c-primary)
}

.page-essay .error-container,.page-essay .loading-container {
    align-items: center;
    color: var(--c-text-2);
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 500px;
    justify-content: center
}

.page-essay .error-container .loading-spinner,.page-essay .loading-container .loading-spinner {
    animation: spin-1f067c47 1s linear infinite;
    border-top: 3px solid var(--c-bg-3);
    border: 3px solid var(--c-bg-3);
    border-radius: 50%;
    border-top-color: var(--c-primary);
    height: 40px;
    width: 40px
}

.page-essay .error-container .error-icon,.page-essay .loading-container .error-icon {
    color: var(--c-danger);
    font-size: 4rem
}

.page-essay .talks-footer {
    color: var(--c-text-3);
    font-size: .9rem;
    padding: 2rem 0;
    text-align: center
}

@keyframes spin-1f067c47 {
    0% {
        transform: rotate(0)
    }

    to {
        transform: rotate(1turn)
    }
}

.zone_imgbox {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(3, 1fr);
}
.img-item {
    border-radius: 8px;
    overflow: hidden;
    padding-bottom: 100%;
    position: relative;
}
.image {
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    -o-object-fit: cover;
    object-fit: cover;
    position: absolute;
    transition: transform .3s;
    width: 100%;
}
</style>