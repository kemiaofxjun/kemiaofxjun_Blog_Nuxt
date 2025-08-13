<template>
  <div id="bbTimeList" class="bb-time-list">
    <!-- 文章滑动容器 -->
    <div 
      id="bbtalk" 
      class="swiper-container essay-swiper"
      :class="{ 'no-swiping': !enableSwiping }"
    >
      <div class="swiper-wrapper">
        <!-- 遍历文章列表（限制前10条） -->
        <div 
          v-for="(item, index) in filteredEssays" 
          :key="getItemKey(item, index)"
          class="swiper-slide essay-item"
        >
          <!-- 时间标签 -->
          <div class="item-meta">
            <span class="date">{{ formatDate(item.date) }}</span>
            <span class="tag">#{{ item.tags }}</span>
          </div>

          <!-- 内容主体 -->
          <div class="item-content">
            <!-- 文本内容 -->
            <p class="content-text">{{ item.content }}</p>
            
            <!-- 图片展示（如果有） -->
            <div v-if="item.image" class="item-images">
              <img 
                :src="item.image" 
                :alt="`${item.tags}相关图片`" 
                class="content-image"
              >
            </div>
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