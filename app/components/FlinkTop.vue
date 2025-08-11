<!-- components/FlinkTop.vue -->
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import friendsInfo from '~/friends'; // 假设同步导入数据（或替换为异步）

// 定义类型接口
interface FriendEntry {
  author: string;
  link: string;
  avatar: string;
  hundredSuffix?: string;
  date?: string;
}

interface LinkGroup {
  name: string;
  entries: FriendEntry[];
  hundredSuffix?: string;
}

// 获取路由实例
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
    flink: '/assets/images/error-flink.png'
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

// 友情链接数据加载状态
const friendsData = ref<LinkGroup[]>([]);
const isLoading = ref(true);

// 异步加载数据（若 friendsInfo 是同步数据，直接赋值即可）
onMounted(() => {
  // 模拟异步加载（实际根据项目调整）
  setTimeout(() => {
    friendsData.value = friendsInfo as LinkGroup[]; // 假设 friendsInfo 符合 LinkGroup 结构
    isLoading.value = false;
  }, 500);
});

// /​**​
//  * 处理头像 URL（移除感叹号）
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
  target.onerror = null;
  target.src = urlFor(theme.value.error_img.flink);
};

// /​**​
//  * 预处理链接数据（生成图标对）
//  */
const processedLinks = computed(() => {
  return friendsData.value.slice(0, 999).map((group: LinkGroup) => {
    const linkList = [...group.entries];
    const evenNum = linkList.filter((_, index) => index % 2 === 0); // 原数组偶数索引元素（0,2,4...）
    const oddNum = linkList.filter((_, index) => index % 2 === 1);  // 原数组奇数索引元素（1,3,5...）
    const hundredSuffix = group.hundredSuffix || '';

    const validPairs: Array<{
      even: FriendEntry;
      odd: FriendEntry;
      evenAvatar: string;
      oddAvatar: string;
    }> = [];

    const maxPairCount = Math.min(evenNum.length, oddNum.length);
    // 最多显示8对（可根据需求调整）
    const maxShowPairs = 8; 
    const loopCount = Math.min(maxPairCount, maxShowPairs);

    for (let i = 0; i < loopCount; i++) {
      // 直接用i作为evenNum和oddNum的索引（对应原数组的2i和2i+1位置）
      const evenItem = evenNum[i];
      const oddItem = oddNum[i];
      if (evenItem && oddItem) {
        validPairs.push({
          even: evenItem,
          odd: oddItem,
          evenAvatar: getAvatarWithoutExclamationMark(evenItem.avatar),
          oddAvatar: getAvatarWithoutExclamationMark(oddItem.avatar)
        });
      }
    }

    return { ...group, hundredSuffix, pairs: validPairs };
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