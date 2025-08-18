<script setup lang="ts">
import { computed } from 'vue';
// 导入外部数据
import { creativityData } from '~/creativity';

// 从 creativityData 中提取技能数据（假设取第一个分类）
const skills = computed(() => {
  const firstCategory = creativityData?.[0];
  if (!firstCategory?.creativity_list) return null;
  
  // 补充原始代码中需要的字段（根据实际数据结构调整）
  return {
    ...firstCategory,
    title: firstCategory.class_name,  // 映射 class_name 到 title
    subtitle: firstCategory.subtitle  // 直接使用 subtitle
  };
});

// 计算属性：技能标签分组（每两个一组）- 使用 reduce 重构
const skillTagGroups = computed(() => {
  if (!skills.value?.creativity_list) return [];
  
  return skills.value.creativity_list.reduce((groups, currentTag) => {
    // 取最后一个分组（可能未填满）
    const lastGroup = groups[groups.length - 1];
    
    if (lastGroup?.length === 2) {
      // 当前分组已满，创建新分组
      groups.push([currentTag]);
    } else {
      // 当前分组未满，添加到最后一个分组
      lastGroup ? lastGroup.push(currentTag) : groups.push([currentTag]);
    }
    
    return groups;
  }, []); // 初始值为空数组
});
</script>
<template>
    <div v-if="skills" class="author-content-item skills">
      <div class="card-content">
        <div class="author-content-item-tips">{{ skills.class_name }}</div>
        <span class="author-content-item-title">{{ skills.subtitle }}</span>
        
        <div class="skills-style-group">
          <!-- 标签分组展示（每两个一组） -->
          <div class="tags-group-all">
            <div class="tags-group-wrapper">
              <div 
                v-for="(group, groupIdx) in skillTagGroups" 
                :key="groupIdx" 
                class="tags-group-icon-pair"
              >
                <div 
                  v-for="(tag, tagIdx) in group" 
                  :key="tagIdx" 
                  class="tags-group-icon" 
                  :style="{ background: tag.color }"
                >
                  <img 
                    class="entered loading"
                    :src="tag.icon" 
                    :title="tag.name"
                    :style="{ color: tag.icon_color || '' }"
                    alt=""
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- 全部技能列表 -->
          <div class="skills-list">
            <div 
              v-for="(tag, tagIdx) in skills.creativity_list" 
              :key="tagIdx" 
              class="skill-info"
            >
              <div 
                class="skill-icon" 
                :style="{ background: tag.color }"
              >
                <img 
                  v-if="tag.img" 
                  :src="tag.img" 
                  :title="tag.name" 
                  alt=""
                >
                <i 
                  v-else-if="tag.icon" 
                  :class="tag.icon" 
                  :title="tag.name" 
                  :style="{ color: tag.icon_color || '' }"
                ></i>
              </div>
              <div class="skill-name">
                <span>{{ tag.name }}</span>
              </div>
            </div>
            <div class="etc ...">...</div>
          </div>
        </div>
      </div>
    </div>
</template>