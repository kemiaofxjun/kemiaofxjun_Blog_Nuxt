<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// 获取当前路由信息
const route = useRoute()

// 使用 qrcode.js 生成二维码
import QRCode from 'qrcode'

const generateQRCode = async (url: string) => {
  try {
    return await QRCode.toDataURL(url, {
      margin: 2,
      width: 150,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
  } catch (err) {
    console.error('二维码生成失败', err)
    return ''
  }
}

// 初始化二维码
onMounted(() => {
  // 生成当前页面二维码
  const currentUrl = window.location.href
  currentPageQRCode.value = generateQRCode(currentUrl)
  
  // 生成APP下载二维码（这里使用示例URL）
  appQRCode.value = generateQRCode('https://app.example.com/download')
})

// 监听路由变化更新二维码
watch(() => route.path, () => {
  const currentUrl = window.location.href
  currentPageQRCode.value = generateQRCode(currentUrl)
})
</script>

<template>
  <div class="card-widget" id="card-tuijian">
    <div id="tj-box">
      <!-- 快速打开移动端二维码 -->
      <div id="tj-box1">
        <div id="tj-left">
          <p>扫一扫</p>
          <span>快速打开移动端➤</span>
        </div>
        <div id="tj-right">
          <div id="tj-img-box">
            <img :src="currentPageQRCode" alt="当前页面二维码">
          </div>
        </div>
      </div>
      
      <!-- 下载移动端APP二维码 -->
      <div id="tj-box2">
        <div id="tj-left">
          <p>扫一扫</p>
          <span>下载移动端APP➤</span>
        </div>
        <div id="tj-right">
          <div id="tj-img-box">
            <img :src="appQRCode" alt="APP下载二维码">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#card-tuijian {
  background: linear-gradient(to right, #35bb99db, #2dbcc4db) !important;
  padding: 15px 0;
  height: 118px;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  
  #tj-box {
    width: 100%;
    height: 100%;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    transition: cubic-bezier(0, 0, 0, 1.29) 0.4s;
    
    &:hover {
      -webkit-transform: rotateY(180deg);
      transform: rotateY(180deg);
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
    }
  }
  
  #tj-box1,
  #tj-box2 {
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    position: absolute;
    height: 100%;
    width: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
  
  #tj-box2 {
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
  }
  
  #tj-img-box {
    border-radius: 12px;
    margin-left: 10px;
    height: 85px;
    
    img {
      height: 85px;
      border-radius: 12px;
      filter: brightness(0.95) !important;
    }
  }
  
  #tj-left {
    color: #fff;
    height: 85px;
    
    p {
      font-family: monospace, Arial;
      margin: 10px 0 0;
      font-size: 32px;
      line-height: normal;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.9);
      text-shadow: 
        -0.5px 0.5px 0 rgba(255, 255, 255, 0.9),
        0.5px 0.5px 0 rgba(255, 255, 255, 0.9),
        0.5px -0.5px 0 rgba(255, 255, 255, 0.9),
        -0.5px -0.5px 0 rgba(255, 255, 255, 0.9);
    }
    
    span {
      font-size: 15px;
      font-weight: 800;
    }
  }
}
</style>