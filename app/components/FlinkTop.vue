<!-- components/FlinkTop.vue -->
<script lang="ts" setup>
import { ref, computed } from 'vue';
import friendsInfo from '~/friends'; // 假设 friends 模块导出的是 LinkGroup[] 类型

// 定义类型接口（根据实际数据结构调整）
interface FriendEntry {
  author: string;       // 作者名（对应原 Pug 中的 i.name）
  link: string;         // 链接地址（对应原 Pug 中的 i.link）
  avatar: string;       // 头像 URL（对应原 Pug 中的 i.avatar）
  hundredSuffix?: string; // 可选后缀（如果实际数据中存在）
  date?: string;        // 其他可能的字段（根据实际数据补充）
}

interface LinkGroup {
  name: string;         // 分组名称（对应原 Pug 中的分组标识）
  entries: FriendEntry[]; // 条目数组（对应原 Pug 中的 i.link_list）
  hundredSuffix?: string; // 分组级后缀（可选，根据实际数据调整）
}

// 模拟 url_for 函数（根据实际项目替换）
const urlFor = (path: string): string => {
  return path.startsWith('/') ? `https://your-domain.com${path}` : path;
};

// 主题配置（根据实际项目调整）
const theme = ref({
  error_img: {
    flink: '/assets/img/link/ciraos.webp' // 默认错误图片路径
  }
});

// 横幅信息
const bannerInfo = ref([
  {
    title: "友情链接",
    description: "与数百名博主无限进步",
    buttonTextOne: "随机访问",
    buttonTextTwo: "申请友链",
  }
]);

// /​**​
//  * 处理头像 URL（移除感叹号及之后的内容）
//  * @param url 原始头像 URL
//  * @returns 处理后的 URL
//  */
const getAvatarWithoutExclamationMark = (url: string): string => {
  const exclamationIndex = url.indexOf('!');
  return exclamationIndex !== -1 ? url.substring(0, exclamationIndex) : url;
};

// /​**​
//  * 图片加载错误处理
//  * @param event 错误事件对象
//  */
const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement;
  target.onerror = null; // 防止无限循环
  target.src = urlFor(theme.value.error_img.flink);
};

// /​**​
//  * 预处理链接数据，生成图标对结构（修正后）
//  */
const processedLinks = computed(() => {
  // 取前 15 个分组（根据原 Pug 逻辑）
  return friendsInfo.slice(0, 15).map((group: LinkGroup) => {
    // 注意：原 Pug 中使用的是 i.link_list，现在数据中是 group.entries
    const linkList = [...group.entries]; 
    
    // 原 Pug 中通过 index % 2 分组，现在直接使用 entries 数组
    const evenNum = linkList.filter((_, index) => index % 2 === 0); // 偶数索引项
    const oddNum = linkList.filter((_, index) => index % 2 === 1); // 奇数索引项
    
    // 使用分组级的 hundredSuffix（如果实际数据中没有，用空字符串）
    const hundredSuffix = group.hundredSuffix || "";

    // 生成有效图标对数组
    const validPairs: Array<{
      even: FriendEntry;
      odd: FriendEntry;
      evenAvatar: string;
      oddAvatar: string;
    }> = [];

    const maxPairCount = Math.min(evenNum.length, oddNum.length);
    for (let i = 0; i < maxPairCount; i++) {
      const baseIndex = i * 2;
      if (baseIndex > 15) break; // 原逻辑限制索引不超过 15

      const evenItem = evenNum[baseIndex];
      const oddItem = oddNum[baseIndex];
      if (evenItem && oddItem) {
        validPairs.push({
          even: evenItem,
          odd: oddItem,
          evenAvatar: getAvatarWithoutExclamationMark(evenItem.avatar),
          oddAvatar: getAvatarWithoutExclamationMark(oddItem.avatar)
        });
      }
    }

    // 返回处理后的分组对象（保留原分组属性）
    return {
      ...group,
      hundredSuffix,
      pairs: validPairs
    };
  });
});
</script>

<template>
  <link rel="stylesheet" href="/assets/css/flinktop.css">
  <div id="flink_top">
    <!-- 横幅区域 -->
    <div id="flink-banners">
      <div class="banner-top-box" v-for="(info, infoItem) in bannerInfo" :key="infoItem">
        <div class="flink-banners-title">
          <div class="banners-title-small">{{ info.title }}</div>
          <div class="banners-title-big">{{ info.description }}</div>
        </div>
        <div class="banner-button-group">
          <a class="banner-button secondary no-text-decoration">
            <i class="anzhiyufont anzhiyu-icon-paper-plane1" style="margin-right: 8px;"></i>
            <span class="banner-button-text">{{ info.buttonTextOne }}</span>
          </a>
          <a class="banner-button no-text-decoration">
            <i class="anzhiyufont anzhiyu-icon-arrow-circle-right"></i>
            <span class="banner-button-text">{{ info.buttonTextTwo }}</span>
          </a>
        </div>
      </div>

      <!-- 技能标签组区域（修正后） -->
      <div id="skills-tags-group-all">
        <div class="tags-group-wrapper" v-for="(group, groupIndex) in processedLinks" :key="groupIndex">
          <!-- 遍历当前组的图标对 -->
          <div v-for="(pair, pairIndex) in group.pairs" :key="pairIndex" class="tags-group-icon-pair" style="margin-left: 1rem;">
            <!-- 偶数项图标 -->
            <a class="tags-group-icon no-text-decoration" target="_blank" rel="noopener" :href="urlFor(pair.even.link)" :title="pair.even.author">
              <img class="no-lightbox" :title="pair.even.author" :src="urlFor(pair.evenAvatar + group.hundredSuffix)" @error="handleImageError" :alt="pair.even.author">
            </a>

            <!-- 奇数项图标 -->
            <a class="tags-group-icon no-text-decoration" target="_blank" rel="noopener" :href="urlFor(pair.odd.link)" :title="pair.odd.author">
              <img class="no-lightbox" :title="pair.odd.author" :src="urlFor(pair.oddAvatar + group.hundredSuffix)" @error="handleImageError" :alt="pair.odd.author">
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>