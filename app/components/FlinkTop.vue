<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import friendsDataRaw from '~/friends'; // 导入用户提供的 friends 数据

// ------------------------------
// 定义类型接口（关键修复）
// ------------------------------
// /​**​ 友链条目接口（匹配 friends.entries 中的对象） */
interface FriendEntry {
  author: string;       // 作者名（如 "LiuShen"）
  sitenick: string;     // 站点昵称（如 "清羽 〄 飞扬"）
  title: string;        // 友链标题（如 "清羽飞扬"）
  desc: string;         // 友链描述（如 "柳影曳曳..."）
  link: string;         // 友链地址（如 "https://blog.liushen.fun/"）
  avatar: string;       // 头像 URL（如 "https://blog.liushen.fun/info/avatar.ico"）
  feed?: string;        // 订阅源（可选，如 "https://blog.liushen.fun/atom.xml"）
  icon?: string;        // 图标 URL（可选，如 "/assets/img/link/LiuShen.webp"）
  archs?: string[];     // 技术栈（可选，如 ["Hexo", "服务器"]）
  date?: string;        // 日期（可选，如 "2025-03-15"）
  comment?: string;     // 备注（可选）
}

// /​**​ 友链分组接口（匹配 friends 数组中的对象） */
interface FriendGroup {
  name: string;         // 分组名称（如 "『推荐友链』"）
  desc: string;         // 分组描述（如 ""）
  entries: FriendEntry[]; // 友链条目数组（如上面的 FriendEntry 数组）
}

// ------------------------------
// 其他逻辑（保持不变）
// ------------------------------
const router = useRouter();

// 从环境变量获取域名（需配置 .env 文件）
const domain = 'https://www.myxz.top';

// /​**​
//  * 动态生成 URL（修复 your-domain.com 循环问题）
//  * @param path 原始路径
//  * @returns 完整 URL
//  */
const urlFor = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('')) return `${domain}${path}`;
  return path;
};

// 主题配置
const theme = ref({
  error_img: {
    flink: '/assets/images/error-flink.png' // 错误图片路径（根据实际项目调整）
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

// 友情链接数据（使用用户提供的 raw 数据）
const friendsData = ref<FriendGroup[]>(friendsDataRaw);

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
//  */
const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement;
  target.onerror = null; // 防止无限循环
  target.src = urlFor(theme.value.error_img.flink); // 使用主题配置的错误图片
};

// /​**​
//  * 预处理友链数据，生成图标对（核心逻辑）
//  */
const processedLinks = computed(() => {
  return friendsData.value.map((group: FriendGroup) => {
    const entries = [...group.entries]; // 复制原数组避免修改原始数据

    // 按奇偶索引分组
    const evenEntries = entries.filter((_, index) => index % 2 === 0); // 偶数索引（0,2,4...）
    const oddEntries = entries.filter((_, index) => index % 2 === 1); // 奇数索引（1,3,5...）

    // 生成有效图标对（取偶数和奇数数组的最小长度）
    const validPairs: Array<{
      even: FriendEntry;
      odd: FriendEntry;
      evenAvatar: string;
      oddAvatar: string;
    }> = [];

    const maxPairCount = Math.min(evenEntries.length, oddEntries.length);
    for (let i = 0; i < maxPairCount; i++) {
      const evenItem = evenEntries[i];
      const oddItem = oddEntries[i];
      if (evenItem && oddItem) {
        validPairs.push({
          even: evenItem,
          odd: oddItem,
          evenAvatar: getAvatarWithoutExclamationMark(evenItem.avatar),
          oddAvatar: getAvatarWithoutExclamationMark(oddItem.avatar)
        });
      }
    }

    // 返回处理后的分组（保留原分组信息）
    return {
      ...group,
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
        <div class="tags-group-wrapper" v-for="group in processedLinks" :key="group.name">
          <!-- 遍历当前组的图标对 -->
          <div v-for="(pair, pairIndex) in group.pairs" :key="pairIndex" class="tags-group-icon-pair" style="margin-left: 1rem;">
            <!-- 偶数项图标 -->
            <a class="tags-group-icon no-text-decoration" target="_blank" rel="noopener" :href="urlFor(pair.even.link)" :title="pair.even.author">
              <img class="no-lightbox" :title="pair.even.author" :src="urlFor(pair.evenAvatar)" @error="handleImageError" :alt="pair.even.author">
            </a>

            <!-- 奇数项图标 -->
            <a class="tags-group-icon no-text-decoration" target="_blank" rel="noopener" :href="urlFor(pair.odd.link)" :title="pair.odd.author">
              <img class="no-lightbox" :title="pair.odd.author" :src="urlFor(pair.evenAvatar)" @error="handleImageError" :alt="pair.odd.author">
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>