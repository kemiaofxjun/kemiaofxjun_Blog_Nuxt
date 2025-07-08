<script setup>
import { onMounted } from 'vue';
// 如果使用npm安装的aplayer，需要导入
// import APlayer from 'aplayer';

onMounted(() => {
  // 初始化APlayer
  const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
    order: 'random',
    preload: 'none',
    volume: 0.25,
    audio: [ 
      {
        name: 'L E V E I S(Cyberpunk)(Remix)',
        artist: 'vodKe',
        url: 'https://jsd.myxz.top/gh/661111/hexoSEVER/source/sxiaohe_source/music/songs/levels.mp3',
        lrc: 'https://jsd.myxz.top/gh/661111/hexoSEVER/source/sxiaohe_source/music/lrc/L%20E%20V%20E%20I%20S(Cyberpunk)(Remix).lrc',
        cover: 'https://jsd.myxz.top/gh/661111/hexoSEVER/source/sxiaohe_source/music/cover/L%20E%20V%20E%20l%20S%20(Cyberpunk).avif'
      },
      {
        name: '逆天',
        artist: '呦猫UNEKO',
        url: 'https://jsd.myxz.top/gh/661111/hexoSEVER/source/sxiaohe_source/music/songs/呦猫UNEKO%20-%20逆天.mp3',
        lrc: 'https://jsd.myxz.top/gh/661111/hexoSEVER/source/sxiaohe_source/music/lrc/呦猫UNEKO%20-%20逆天.lrc',
        cover: 'https://jsd.myxz.top/gh/661111/hexoSEVER/source/sxiaohe_source/music/cover/逆天.avif'
      },
      {
        name: 'BARRETE!(SLOWED + REVERB)',
        artist: 'CHASHKAKEFIRA&D4C',
        url: 'https://jsd.myxz.top/gh/661111/hexoSEVER/source/sxiaohe_source/music/songs/BARRETE!(SLOWED%20+%20REVERB)-CHASHKAKEFIRA&D4C.mp3',
        lrc: 'https://jsd.myxz.top/gh/661111/hexoSEVER/source/sxiaohe_source/music/lrc/BARRETE!(SLOWED%20+%20REVERB)-CHASHKAKEFIRA&D4C.lrc',
        cover: 'https://jsd.myxz.top/gh/661111/hexoSEVER/source/sxiaohe_source/music/cover/BARRETE!(SLOWED%20+%20REVERB)%20.avif'
      },
      {
        name: '无人扶我青云志',
        artist: 'ZMAGE-Y',
        url: 'https://jsd.myxz.top/gh/661111/hexoSEVER/source/sxiaohe_source/music/songs/ZMAGE-Y%20-%20无人扶我青云志%20(ZMAGE-Y%20remix).mp3',
        lrc: 'https://jsd.myxz.top/gh/661111/hexoSEVER/source/sxiaohe_source/music/lrc/无人扶我青云志%20(ZMAGE-Y%20remix)%20(Remix)-ZMAGE-Y.lrc',
        cover: 'https://jsd.myxz.top/gh/661111/hexoSEVER/source/sxiaohe_source/music/cover/无人扶我青云志%20(ZMAGE-Y%20remix).avif'
      }
    ]
  });
});
</script>

<template>
  <link rel="stylesheet" href="https://s4.zstatic.net/npm/aplayer@1.10.1/dist/APlayer.min.css" media="print" onload='this.media="all"'>
  <script src="https://s4.zstatic.net/npm/aplayer@1.10.1/dist/APlayer.min.js"></script>
  <script src="https://s4.zstatic.net/npm/butterfly-extsrc@1.1.3/metingjs/dist/Meting.min.js"></script>

  <div class="contact-info">
    <div class="option">
      <i class="fas fa-rocket"></i>
      <div class="bloktop"></div>
      <div class="text">风吹草地现牛羊
        <div class="strip"></div>
        <div class="something"></div>
      </div>
    </div>
    <div class="option">
      <i class="fas fa-cube"></i>
      <div class="blok"></div>
      <div class="text">
        <div class="strip"></div>
        <div class="post-reward reward-card">
          <button class="reward-button tip-button">
            <span class="tip-button__text">投 喂</span>
            <div class="reward-main" style="width: 400% !important; left: -300px !important;">
              <ul class="reward-all" style="padding: 0px 0px !important;">
                <li class="reward-item">
                  <a class="about-reward" href="" target="_blank">
                    <img class="post-qr-code-img" alt="微信" src="https://sourceimage.s3.bitiful.net/pay/weixin.jpg">
                  </a>
                  <div class="post-qr-code-desc">微信</div>
                </li>
                <li class="reward-item">
                  <a class="about-reward" href="" target="_blank">
                    <img class="post-qr-code-img" alt="支付宝" src="https://sourceimage.s3.bitiful.net/pay/zfb.png">
                  </a>
                  <div class="post-qr-code-desc">支付宝</div>
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div class="option">
      <i class="fas fa-music"></i>
      <div class="blokbottom"></div>
      <div class="text aplayertext">
        <div class="strip"></div>
        <div id="aplayer" class="no-destroy" mutex="true" listfolded="true" data-id="" data-preload="none" data-server="netease" data-volume="0.25" data-order="random" data-type="playlist" data-fixed="true" data-autoplay="false"></div>
      </div>
    </div>
  </div>
</template>

<style>
/* 悬浮侧边栏样式（电脑版） */
/* 由苏晓河进行编写以及调整 */
/* 时间：2025年3月7日 */

.contact-info{
    position: fixed;
    top: 22%;
    z-index: 200;
    left: -51px;
    transition: 0.4s;
  }
  .contact-info:hover{
    left: 0px;
  }
  .contact-info .option{
    cursor: pointer;
    position: relative;
  }
  
  .contact-info .option i{
    display: block;
    width: 50px;
    text-align: center;
    height: 60px;
    line-height: 60px;
    background: rgb(255, 255, 255);
    color: #b9b9b9;
    font-size: 20px;
    transition: 0.4s;
    border-radius: 0 10px 10px 0;
  }
  
  .contact-info .option:hover i{
    color: #3498db;
  }
  .contact-info .text{
    border-radius: 15px;
    position: absolute;
    height: 60px;
    width: 200px;
    background: rgba(255,255,255,.85);
    top: 0;
    z-index: -1;
    left: -136px;
    color: rgb(0, 0, 0);
    line-height: 60px;
    text-align: center;
    transition: 0.4s;
  }
  .contact-info .aplayertext{
    transition: none!important;
  }
  .aplayer{
    position: absolute!important;
  }
  .aplayer.aplayer-fixed .aplayer-body{
    left: -60px;
    position: absolute!important;
    width: 370px!important;
    transition: none!important;
    border-radius: 10px!important;
  }
  .aplayer.aplayer-fixed{
    left: -300px;
  }
  .contact-info .option:hover .aplayer.aplayer-fixed .aplayer-body,.contact-info .option:hover .aplayer.aplayer-fixed{
    left: 0px;
  }
  .contact-info .option:hover .text{
    left: 60px;
  }
  .contact-info .blok{
    position: absolute;
    height: 60px;
    width: 100px;
    top: 0;
    z-index: -1;
    left: 0px;
  }
  .contact-info .bloktop{
    position: absolute;
    height: 75px;
    width: 100px;
    bottom: 0px;
    z-index: -1;
    left: 0px;
  }
  .contact-info .blokbottom{
    position: absolute;
    height: 75px;
    width: 100px;
    top: 0;
    z-index: -1;
    left: 0px;
  }
  .contact-info .option:hover .blok,.contact-info .option:hover .bloktop,.contact-info .option:hover .blokbottom{
    left: 0px;
  }
  .contact-info .option:hover .aplayertext{
    left: 60px!important;
    width: 370px!important;
    background: transparent!important;
  }
  .aplayer.aplayer-fixed .aplayer-miniswitcher{
    border-radius: 0 10px 10px 0!important;
  }
  .aplayer.aplayer-fixed.aplayer-narrow .aplayer-body{
    transition: 0.28s!important;
    border-radius: 10px!important;
  }
  .aplayer .aplayer-pic{
    height: 60px!important;
  }
  .aplayer .aplayer-info{
    height: 60px!important;
  }
  .aplayer.aplayer-narrow .aplayer-body{
    height: 60px;
  }
  .aplayer .aplayer-list.aplayer-list-hide{
    margin-bottom: 59px!important;
  }
  .aplayer.aplayer-fixed .aplayer-list{
    margin-bottom: 62px!important;
    max-height: 240px!important;
  }
  .aplayer.aplayer-fixed .aplayer-info{
    transition: none!important;
  }
  .aplayer.aplayer-narrow .aplayer-body{
    height: 60px!important;
  }
  .aplayer.aplayer-narrow .aplayer-body, .aplayer.aplayer-narrow .aplayer-pic{
    border-radius:  10px 0 0 10px!important;
  }
  .aplayer.aplayer-fixed{
    border-radius: 10px!important;
  }
  .aplayer .aplayer-pic{
    border-radius:  0 0 0 10px!important;
  }
  .aplayer.aplayer-fixed .aplayer-list{
    border-radius: 10px 10px 0 0!important;
  }
  [data-theme=dark]
  .contact-info .option i{
    background: rgb(22, 22, 22);
    color: #b9b9b9;
  }
  [data-theme=dark]
  .contact-info .text{
    background: rgba(23, 23, 23, 0.85);
    color: rgba(255, 255, 255, 0.92);
  }
  @media screen and (max-width:1300px){
    .contact-info{
        display: none!important;
      }
  }
  .aplayer{
    opacity: .93!important;
  }
  [data-theme=dark]
  .aplayer{
    background: rgb(22, 22, 22)!important;
    color: rgb(255, 255, 255);
  }
  [data-theme=dark]
  .aplayer.aplayer-fixed .aplayer-body{
    background: rgb(22, 22, 22)!important;
    color: rgb(255, 255, 255);
  }
  [data-theme=dark]
  .aplayer .aplayer-list ol li:hover{
    background: #3b3b3b;
  }
  [data-theme=dark]
  .aplayer .aplayer-list ol li.aplayer-list-light{
    background: #686868;
  }
  [data-theme=dark]
  .aplayer .aplayer-info .aplayer-controller .aplayer-time{
    color: #d4d4d4;
  }
  [data-theme=dark]
  .aplayer .aplayer-list ol li .aplayer-list-index{
    color: #d4d4d4;
  }
  [data-theme=dark]
  .aplayer .aplayer-list ol li .aplayer-list-author{
    color: #d4d4d4;
  }
  [data-theme=dark]
  .aplayer .aplayer-info .aplayer-controller .aplayer-time .aplayer-icon path{
    fill: #d4d4d4;
  }

.contact-info .text .strip{
    border-radius: 5px;
    position: absolute;
    height: 36px;
    width: 5px;
    background: rgba(20, 163, 230, 0.8);
    top: 12px;
    z-index: -1;
    right: 4px;
    transition: 0.4s;
  }
  .aplayertext .strip{
    transition: none!important;
  }
  .contact-info .option:hover .aplayertext .strip{
    background: transparent;
  }
  [data-theme=dark]
  .aplayer .aplayer-miniswitcher{
    background: rgba(23, 23, 23, 0.85);
  }
  .aplayer .aplayer-miniswitcher .aplayer-icon:hover path{
    fill: #3498db;
  }
  [data-theme=dark]
  .contact-info .option:hover i{
    color: #3498db;
  }
.contact-info .option .text .post-reward .tip-button__text{
  margin: 25px!important;
}
.post-reward .reward-button .reward-main .reward-all{
  border-radius: 12px!important;
}
.contact-info .option .text .post-reward .reward-button .reward-main .reward-all{
  z-index: 999!important;
}
[data-theme="dark"]
.contact-info .option .text .post-reward .tip-button{
  border: solid 2px rgba(236, 233, 233, 0.8);
  background: #043749d0;
}
</style>