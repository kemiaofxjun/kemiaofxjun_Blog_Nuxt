// src/data/essayData.ts
import type { Essay_connect } from '~/types/essay'; // 根据你的项目路径调整

// 直接导出数据数组（类型由 Essay_connect 约束）
export default [
  {
    content: '买到 myxz.top 域名，而且还是个白金域名，太棒了。',
    date: '2025/3/20',
    image: 'https://bcjyn0fc8o7wifyp.public.blob.vercel-storage.com/img/b486dd9b02c8081a42f7161aa135da0-lUIahC6nFeKNkSKlHnHa38kuYGMlnU.png',
  },
  {
    content: '最近长牙包了，没办法完善一些东西',
    date: '2025/03/03',
    image: '',
  },
  {
    content: '目前基本上已经完成了仿照轻笑的博客样式',
    date: '2025/02/07',
    image: 'https://blog.myxz.top/img/screen.avif',
  },
  {
    content: '有新电脑，基本上已经不太想用动态博客，所以最近准备从动态博客迁移到静态博客',
    date: '2025/02/03',
    image: '',
  },
] as Essay_connect[]; // 显式断言类型（可选，若 TS 能自动推断可省略）