<template>
  <div id="bbTimeList" class="bbTimeList container">
    <svg class="icon bber-logo iconfont icon-chrome" onclick="loadUrl(/essay/)" title="即刻短文" aria-hidden="true">
        <use xlink:href="#icon-chrome"></use>
    </svg>
    <!-- 文章滑动容器 -->
    <div 
      id="bbtalk" 
      class="swiper-container swiper-no-swiping essay_bar_swiper_container"
      :class="{ 'no-swiping': !enableSwiping }"
    >
      <div class="swiper-wrapper" id="bber-talk" onclick="loadUrl(/essay/)">
        <!-- 遍历文章列表（限制前10条） -->
        <div v-for="(item, index) in filteredEssays" :key="getItemKey(item, index)">
          <!-- 内容主体 -->
          <div class="li-style swiper-slide">
            <!-- 文本内容 -->
            <p class="content-text">{{ item.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 查看全文入口 -->
    <div class="view-all-link" @click="goToEssayList">
      <i class="fas fa-arrow-circle-right"></i>
      <span>查看全部说说</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';
import { useRouter } from 'vue-router'; // 引入Vue Router
import type { EssayItem } from '~/essay'; // 替换为实际TS文件路径

export default defineComponent({
  name: 'BbEssayList',
  props: {
    // 接收文章列表数据（支持空数组）
    essayList: {
      type: Array as PropType<EssayItem[]>,
      default: () => [],
      required: false
    },
    // 是否启用滑动（可选配置）
    enableSwiping: {
      type: Boolean,
      default: true
    },
    // 限制展示数量（默认10条）
    limit: {
      type: Number,
      default: 10
    }
  },
  setup(props) {
    const router = useRouter();

    // /​**​
    //  * 跳转到说说列表页
    //  */
    const goToEssayList = () => {
      // 使用Vue Router跳转（需项目已配置路由）
      router.push('/essay/').catch((err) => {
        // 处理重复导航的情况（可选）
        console.warn('目标页面已在当前标签页打开:', err);
      });
    };

    // /​**​
    //  * 格式化日期显示（示例：将'2025/3/20'转为'2025-03-20'）
    //  */
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) 
        ? dateStr 
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    // /​**​
    //  * 生成唯一的item key（优先使用内容哈希，无唯一标识时用索引）
    //  */
    const getItemKey = (item: EssayItem, index: number) => {
      // 如果有唯一标识（如id）可替换此处
      return item.content ? `${item.content}-${index}` : index.toString();
    };

    // 计算属性：过滤并限制数量的文章列表
    const filteredEssays = computed(() => {
      return props.essayList.slice(0, props.limit);
    });

    return {
      goToEssayList,
      formatDate,
      getItemKey,
      filteredEssays
    };
  }
});
</script>