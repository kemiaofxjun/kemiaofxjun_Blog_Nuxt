<script setup lang="ts">
import { useServiceWorker } from '@vite-pwa/nuxt'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useServiceWorker()
</script>

<template>
  <div v-if="offlineReady || needRefresh" class="update-prompt">
    <div class="update-message">
      <span v-if="offlineReady">应用已准备好离线使用!</span>
      <span v-else>有新的更新可用，点击重新加载来应用。</span>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker()">
      重新加载
    </button>
    <button @click="offlineReady = false; needRefresh = false">
      关闭
    </button>
  </div>
</template>

<style scoped>
.update-prompt {
  position: fixed;
  bottom: 16px;
  right: 16px;
  padding: 16px;
  background: #4a5568;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
}

.update-message {
  margin-right: 8px;
}
</style>