<script setup lang="ts">
  const isLoading = ref(true);
  const isOpen = ref(false);
  const config = useRuntimeConfig();
  const cdnUrl = config.public.CDN_URL;
  const props = defineProps({
    hide: {
      type: Boolean,
      default: false,
    },
  });

  // Pinia仓库
  const {
    togglePlay,
    musicPrev,
    musicNext,
    musicNowId,
    musicNowTitle,
    musicNowSinger,
    musicNowCover,
    musicNowAudio,
    musicNowLyric,
    musicPlayState,
  } = toRefs(store.useMusicControl());

  const desktopLyrics = ref("");
  const MusicCoverImageRef = ref();
  const refreshAudioElement = ref(false);

  const lyricTouchShield = computed(() => {
    const mql = window.matchMedia("(pointer: coarse)");
    const isMobile = mql.matches;
    return isMobile;
  });

  // 控制audio播放，暂停
  watch(musicPlayState, (newValue) => {
    const audioElement = document.getElementById("bgMusic") as HTMLMediaElement;
    progressInit();
    if (newValue) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  });

  const addMusicViews = async () => {
    if (musicNowId.value) {
      await ApiMusic.showMusic(() => ({ song_id: String(musicNowId.value) }), {
        setupFetch: true,
      });
    }
  };

  // 控制audio切换音乐
  watch(musicNowAudio, async () => {
    refreshAudioElement.value = true;
    setTimeout(() => {
      refreshAudioElement.value = false;
      setTimeout(() => {
        const audioElement = document.getElementById(
          "bgMusic",
        ) as HTMLMediaElement;
        progressInit();
        if (musicPlayState.value) {
          audioElement.play();
          addMusicViews();
        } else {
          audioElement.pause();
        }
      }, 0);
    }, 0);
  });

  // 生成tailwind颜色
  const createDecoration = () => {
    const img = MusicCoverImageRef.value;
    if (img) {
      const imageColor = getImageColor(img);
      const rgb = increaseSaturation(
        adjustBrightnessWhilePreservingHue(imageColor, 50, 50),
        4,
      );
      const themeColor = `rgb(${rgb})`;
      const themeColorRGB = `${rgb}`;
      const themeColorTailwind = generateTailwindColors(rgb);
      document.body.setAttribute(
        "style",
        `
        --theme-color: ${themeColor};
        --theme-color-rgb: ${themeColorRGB};
        --theme-color-50: ${themeColorTailwind[50]};
        --theme-color-100: ${themeColorTailwind[100]};
        --theme-color-200: ${themeColorTailwind[200]};
        --theme-color-300: ${themeColorTailwind[300]};
        --theme-color-400: ${themeColorTailwind[400]};
        --theme-color-500: ${themeColorTailwind[500]};
        --theme-color-600: ${themeColorTailwind[600]};
        --theme-color-700: ${themeColorTailwind[700]};
        --theme-color-800: ${themeColorTailwind[800]};
        --theme-color-900: ${themeColorTailwind[900]};
        --theme-color-950: ${themeColorTailwind[950]};
        `,
      );
    }
  };

  // 获取音乐列表
  const getData = async () => {
    const musicListDataLazyFetch = await ApiMusic.getMusicList(null as any, {
      setupFetch: true,
    });
    const { setMusicList } = toRefs(store.useMusicList());
    if (musicListDataLazyFetch.data.value) {
      const musicList = musicListDataLazyFetch.data.value?.data;
      setMusicList.value(musicList as any);
    }
  };

  const playStatusInit = () => {
    const audioPlayer = document.getElementById("bgMusic") as HTMLMediaElement;
    if (audioPlayer) {
      musicPlayState.value = false;
    }
  };

  // 控制audio进度条
  const progressBar = ref(0);
  const currentTime = ref("00:00");
  const duration = ref("--:--");

  const formatTime = (time: number) => {
    if (Number.isNaN(time)) {
      return "--:--";
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const progressInit = () => {
    const audioPlayer = document.getElementById("bgMusic") as HTMLMediaElement;
    if (audioPlayer) {
      audioPlayer.addEventListener("timeupdate", () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        currentTime.value = formatTime(audioPlayer.currentTime);
        duration.value = formatTime(audioPlayer.duration);
        progressBar.value = progress;
      });
    }
  };

  // 进度条拖动时更新音乐播放位置
  const progressBarInput = () => {
    const audioPlayer = document.getElementById("bgMusic") as HTMLMediaElement;
    const newTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
  };

  // 解析LRC歌词
  type LRC = {
    time: number;
    text: string;
    isActivate: boolean;
    isNext: boolean;
    isPrev: boolean;
  };
  const lyricsArray = ref<Array<LRC>>([
    {
      time: 0,
      text: "暂无歌词，享受好音乐",
      isActivate: true,
      isNext: false,
      isPrev: false,
    },
  ]);

  const fetchLRCFile = async (url: string) => {
    if (musicNowLyric.value !== "") {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch LRC file: ${response.statusText}`);
        }
        const lrcText = await response.text();
        return lrcText;
      } catch (error) {
        console.error("Error fetching LRC file:", error);
        return null;
      }
    } else {
      return null;
    }
  };
  const parseLRC = (lrcText: string) => {
    const lines = lrcText.split("\n");
    const lyrics = <Array<LRC>>[];
    const timeExp = /\[(\d{2}):(\d{2})\.(\d{2})\]/;
    lines.forEach((line) => {
      const match = timeExp.exec(line);
      if (match) {
        const minutes = parseInt(match[1] as string, 10);
        const seconds = parseInt(match[2] as string, 10);
        const milliseconds = parseInt(match[3] as string, 10);
        const time = minutes * 60 + seconds + milliseconds / 100; // 转换为秒
        const text = line.replace(timeExp, "").trim();
        lyrics.push({
          time,
          text,
          isActivate: false,
          isNext: false,
          isPrev: false,
        });
      }
    });
    lyrics.forEach((lyric) => {
      if (lyric.text === "") {
        lyrics.splice(lyrics.indexOf(lyric), 1);
      }
    });
    return lyrics;
  };

  const findLyricIndex = (lyrics: Array<LRC>, currentTime: number) => {
    let left = 0;
    let right = lyrics.length - 1;
    let offsetTime = 0.5; // 偏移时间为0.5秒
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (
        //@ts-ignore
        lyrics[mid].time <= currentTime + offsetTime &&
        (mid === lyrics.length - 1 ||
          //@ts-ignore
          lyrics[mid + 1].time > currentTime + offsetTime)
      ) {
        return mid;
      }
      //@ts-ignore
      else if (lyrics[mid].time < currentTime) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return -1; // 如果没有找到合适的歌词，返回-1
  };

  const scrollToNowLyric = () => {
    let lineHeight = 40;
    const lyricElement = document.getElementById("zy-music-lyric");
    if (lyricElement) {
      const audioPlayer = document.getElementById(
        "bgMusic",
      ) as HTMLMediaElement;
      const currentIndex = findLyricIndex(
        lyricsArray.value,
        audioPlayer.currentTime,
      );
      const lyricWrapperDiv = lyricElement.querySelector("div");
      if (lyricWrapperDiv) {
        lineHeight = lyricWrapperDiv.offsetHeight / lyricsArray.value.length;
      }
      if (currentIndex !== -1) {
        lyricElement.scrollTo({
          top: (currentIndex - 2) * lineHeight,
          behavior: "smooth",
        });
      }
    }
  };

  const displayLyrics = () => {
    const audioPlayer = document.getElementById("bgMusic") as HTMLMediaElement;
    let currentIndex = -1; // 初始化为-1，表示尚未开始播放
    const lyricElement = document.getElementById("zy-music-lyric");

    if (audioPlayer) {
      audioPlayer.addEventListener("timeupdate", () => {
        const currentTime = audioPlayer.currentTime;
        const newIndex = findLyricIndex(lyricsArray.value, currentTime);

        if (newIndex !== currentIndex) {
          // 如果歌词索引发生变化
          currentIndex = newIndex;
          if (currentIndex !== -1) {
            // 如果找到对应的歌词
            lyricsArray.value.forEach((lyric) => {
              lyric.isPrev = false;
              lyric.isActivate = false;
              lyric.isNext = false;
            });
            if (currentIndex > 0) {
              // @ts-ignore
              lyricsArray.value[currentIndex - 1].isPrev = true;
            }
            // @ts-ignore
            lyricsArray.value[currentIndex].isActivate = true;
            if (currentIndex < lyricsArray.value.length - 1) {
              // @ts-ignore
              lyricsArray.value[currentIndex + 1].isNext = true;
            }
            // 滚动到当前歌词
            scrollToNowLyric();
            // 刷新桌面歌词
            desktopLyrics.value =
              lyricsArray.value[currentIndex]?.text ||
              `${musicNowTitle} - ${musicNowSinger}`;
          } else {
            // 如果没有找到对应的歌词，将所有歌词的isActivate属性设置为false
            lyricsArray.value.forEach((lyric) => {
              lyric.isPrev = false;
              lyric.isActivate = false;
              lyric.isNext = false;
            });
          }
        }
      });
    }
  };

  const handleSwitchOpen = (open: boolean) => {
    if (open) {
      isOpen.value = true;
    } else {
      isOpen.value = false;
    }
  };

  watch(isOpen, () => {
    if (isOpen.value) {
      nextTick(() => {
        scrollToNowLyric();
      });
    }
  });

  const lyricInit = async () => {
    const getUrl = `${cdnUrl}${musicNowLyric.value}`;
    const lrcText = await fetchLRCFile(getUrl);
    if (lrcText) {
      const lrc = parseLRC(lrcText);
      lyricsArray.value = lrc;
    } else {
      lyricsArray.value = [
        {
          time: 0,
          text: "暂无歌词，享受好音乐",
          isActivate: true,
          isNext: false,
          isPrev: false,
        },
      ];
    }
    const lyricElement = document.getElementById("zy-music-lyric");
    if (lyricElement) {
      lyricElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    if (lyricsArray.value[0]) {
      desktopLyrics.value =
        lyricsArray.value[0]?.text || `${musicNowTitle} - ${musicNowSinger}`;
    }
    displayLyrics();
  };

  watch(musicNowLyric, () => {
    lyricInit();
  });

  onMounted(async () => {
    await getData();
    isLoading.value = false;
    playStatusInit();
    lyricInit();
    progressInit();
    watch(MusicCoverImageRef, (newValue: any) => {
      if (newValue && newValue.width > 0 && newValue.height > 0) {
        // createDecoration();
      }
    });
  });
</script>

<template>
  <div class="h-full w-full">
    <audio
      id="bgMusic"
      type="audio/ogg"
      v-if="!refreshAudioElement"
      loop
    >
      <source :src="`${cdnUrl}${musicNowAudio}`" />
    </audio>
    <MusicCardRender
      render-mode="combine"
      :cover-src="musicNowCover"
      @switchOpen="handleSwitchOpen"
    >
      <template #mini>
        <div
          class="h-full w-full flex portrait:items-center justify-between landscape:flex-col"
        >
          <div
            class="portrait:h-full flex landscape:flex-col landscape:gap-1 portrait:gap-2"
            :class="{
              'landscape:p-0': hide,
              'landscape:p-3': !hide,
            }"
          >
            <!-- 专辑图片 -->
            <div
              class="flex flex-none relative h-full landscape:max-h-16 aspect-square"
            >
              <img
                class="portrait:hidden h-full absolute left-7 scale-75"
                :class="{
                  hidden: hide,
                }"
                src="/images/material/music-player/record-128.png"
                alt=""
                srcset=""
              />
              <img
                class="h-full absolute portrait:left-1 portrait:scale-75 portrait:rounded-md landscape:rounded"
                src="/images/material/music-player/default-cover.jpg"
                alt=""
                srcset=""
              />
              <img
                v-if="!isLoading"
                class="h-full absolute portrait:left-1 portrait:scale-75 portrait:rounded-md landscape:rounded"
                :src="`${cdnUrl}${musicNowCover}`"
                alt=""
                srcset=""
                ref="MusicCoverImageRef"
              />
              <!-- @load="createDecoration()" -->
            </div>

            <!-- 桌面歌词 -->
            <div
              class="flex h-full w-full items-center pr-2 bottom-0 top-0 relative text-white"
              :class="{
                'landscape:hidden': hide,
                'landscape:md:flex': !hide,
              }"
            >
              <p class="flex-1 portrait:text-xs landscape:text-sm">
                <span
                  v-if="desktopLyrics"
                  class="line-clamp-1"
                  >{{ desktopLyrics }}</span
                >
                <span
                  v-else
                  class="opacity-50"
                >
                  &nbsp;
                </span>
              </p>
            </div>
          </div>

          <div
            id="zy-music-mini-bar-control"
            class="flex relative z-10 landscape:justify-center portrait:justify-end flex-1 pointer-events-none"
            :class="{
              'landscape:hidden': hide,
            }"
          >
            <div class="flex">
              <ZyButton
                class="portrait:h-music landscape:h-10 aspect-square !text-white pointer-events-auto !rounded-full"
                title="上一曲"
                content="上一曲"
                v-tippy="{
                  animation: 'scale',
                }"
                type="text"
                @click.stop="musicPrev"
                @touchstart.stop
                @touchmove.stop
                @touchend.stop
                @mousedown.stop
                @mousemove.stop
                @mouseup.stop
              >
                <ZyIcon
                  name="i-solar-skip-previous-bold"
                  size="1rem"
                />
              </ZyButton>
            </div>
            <div class="flex">
              <ZyButton
                class="portrait:h-music landscape:h-10 aspect-square !text-white pointer-events-auto !rounded-full"
                title="播放"
                content="播放"
                v-tippy="{
                  animation: 'scale',
                }"
                type="text"
                @click.stop="togglePlay"
                @touchstart.stop
                @touchmove.stop
                @touchend.stop
                @mousedown.stop
                @mousemove.stop
                @mouseup.stop
              >
                <template v-if="musicPlayState">
                  <ZyIcon
                    name="i-solar-pause-bold"
                    size="1.5rem"
                  />
                </template>
                <template v-else>
                  <ZyIcon
                    name="i-solar-play-bold"
                    size="1.5rem"
                  />
                </template>
              </ZyButton>
            </div>
            <div class="flex">
              <ZyButton
                class="portrait:h-music landscape:h-10 aspect-square !text-white pointer-events-auto !rounded-full"
                title="下一曲"
                content="下一曲"
                v-tippy="{
                  animation: 'scale',
                }"
                type="text"
                @click.stop="musicNext"
                @touchstart.stop
                @touchmove.stop
                @touchend.stop
                @mousedown.stop
                @mousemove.stop
                @mouseup.stop
              >
                <ZyIcon
                  name="i-solar-skip-next-bold"
                  size="1rem"
                />
              </ZyButton>
            </div>
          </div>
        </div>
      </template>
      <template #panel>
        <div
          class="landscape:p-[10vh] w-full h-full portrait:pb-footer portrait:pt-header flex justify-center portrait:flex-col-reverse z-10"
        >
          <div
            class="landscape:hidden absolute top-0 left-0 w-full h-header z-10 flex justify-center items-center opacity-20"
          >
            <ZyIcon
              name="i-ri:arrow-down-wide-fill"
              size="2rem"
            />
          </div>
          <div
            class="landscape:w-1/2 portrait:w-full flex flex-col justify-center items-center pb-4"
          >
            <div class="portrait:hidden w-[30vw] aspect-square inline-block">
              <div class="w-full h-full p-[6vh]">
                <VinylRecord />
              </div>
            </div>
            <div
              class="landscape:w-[30vw] portrait:w-full inline-block md:p-12 portrait:px-8 portrait:py-4 landscape:pt-0 text-start relative"
              data-touch-shield="true"
            >
              <div class="flex w-full justify-between">
                <div>
                  <p class="flex-1 line-clamp-1 text-3xl font-medium">
                    {{ musicNowTitle }}
                  </p>
                  <p class="flex-1 line-clamp-1 text-lg opacity-50 font-light">
                    {{ musicNowSinger }}
                  </p>
                </div>
                <div class="pointer-events-auto">
                  <ZyButton
                    type="text"
                    class="!bg-[rgba(255,255,255,0.05)] p-2 rounded-full hover:!text-white hover:!bg-[rgba(255,255,255,0.1)]"
                    title="歌曲操作"
                    content="歌曲操作"
                    v-tippy="{
                      animation: 'scale',
                    }"
                  >
                    <ZyIcon
                      name="i-solar-menu-dots-bold"
                      size="1.5rem"
                    />
                  </ZyButton>
                </div>
              </div>

              <div class="py-4 md:py-10 pointer-events-auto">
                <ZyRange
                  @input="progressBarInput"
                  v-model="progressBar"
                />
                <div
                  class="flex justify-between text-xs opacity-50 mt-4 font-light"
                >
                  <span>{{ currentTime }}</span>
                  <span>{{ duration }}</span>
                </div>
              </div>
              <div class="flex justify-between pointer-events-auto">
                <div class="flex items-center">
                  <ZyButton
                    class="!h-12 !aspect-square rounded-xs hover:!text-white hover:!bg-[rgba(255,255,255,0.1)]"
                    title="播放顺序"
                    type="text"
                    content="播放顺序"
                    v-tippy="{
                      animation: 'scale',
                    }"
                  >
                    <ZyIcon
                      name="i-solar-repeat-one-outline"
                      class="opacity-50"
                      size="1.5rem"
                    />
                  </ZyButton>
                </div>
                <div class="flex gap-4 portrait:gap-4">
                  <div class="flex items-center">
                    <ZyButton
                      class="!h-12 !aspect-square rounded-xs hover:!text-white hover:!bg-[rgba(255,255,255,0.1)]"
                      title="上一曲"
                      type="text"
                      @click.stop="musicPrev"
                      content="上一曲"
                      v-tippy="{
                        animation: 'scale',
                      }"
                    >
                      <ZyIcon
                        name="i-solar-skip-previous-bold"
                        size="1.5rem"
                      />
                    </ZyButton>
                  </div>
                  <div class="flex items-center">
                    <ZyButton
                      class="h-12 aspect-square rounded-xs hover:!text-white hover:!bg-[rgba(255,255,255,0.1)]"
                      title="播放"
                      type="text"
                      @click.stop="togglePlay"
                      content="播放"
                      v-tippy="{
                        animation: 'scale',
                      }"
                    >
                      <template v-if="musicPlayState">
                        <ZyIcon
                          name="i-solar-pause-bold"
                          size="2rem"
                        />
                      </template>
                      <template v-else>
                        <ZyIcon
                          name="i-solar-play-bold"
                          size="2rem"
                        />
                      </template>
                    </ZyButton>
                  </div>
                  <div class="flex items-center">
                    <ZyButton
                      class="h-12 aspect-square rounded-xs hover:!text-white hover:!bg-[rgba(255,255,255,0.1)]"
                      title="下一曲"
                      type="text"
                      @click.stop="musicNext"
                      content="下一曲"
                      v-tippy="{
                        animation: 'scale',
                      }"
                    >
                      <ZyIcon
                        name="i-solar-skip-next-bold"
                        size="1.5rem"
                      />
                    </ZyButton>
                  </div>
                </div>
                <div class="flex items-center">
                  <ZyButton
                    class="h-12 aspect-square rounded-xs hover:!text-white hover:!bg-[rgba(255,255,255,0.1)]"
                    title="播放列表"
                    type="text"
                    content="播放列表"
                    v-tippy="{
                      animation: 'scale',
                    }"
                  >
                    <ZyIcon
                      name="i-solar-plaaylist-minimalistic-bold"
                      class="opacity-50"
                      size="1.5rem"
                    />
                  </ZyButton>
                </div>
              </div>
            </div>
          </div>
          <div
            id="zy-music-lyric"
            :data-touch-shield="lyricTouchShield"
            class="landscape:w-1/2 pt-12 pb-12 portrait:px-8 text-2xl portrait:text-xl overflow-y-scroll scrollbar-hidden"
          >
            <div class="flex flex-col gap-6 portrait:gap-2 leading-relaxed">
              <p
                v-for="lyric in lyricsArray"
                class="transition-all duration-500"
                :class="[
                  lyric.isPrev ? 'opacity-40' : '',
                  lyric.isActivate ? 'text-4xl portrait:text-3xl' : '',
                  lyric.isNext ? 'opacity-40' : '',
                  !lyric.isActivate && !lyric.isNext && !lyric.isPrev
                    ? 'opacity-20'
                    : '',
                ]"
              >
                {{ lyric.text }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </MusicCardRender>
  </div>
</template>

<style lang="scss">
  #zy-music-bar {
    touch-action: manipulation;
    transition: bottom 400ms;
    #zy-music-render-canvas {
      .zy-music-mini-bar,
      canvas {
        transition: transform 400ms;
      }
    }
  }

  .pc {
    #zy-music-mini-bar-control {
      button {
        &:hover {
          background-color: rgba(127, 143, 166, 0.2);
        }
      }
    }
    #zy-music-mini-bar-click-area {
      &:hover {
        // background-color: rgba(127, 143, 166, 0.2);
        // backdrop-filter: saturate(200%);
      }
    }
  }

  @media (orientation: portrait) {
    #zy-music-bar.transition-translate-out {
      bottom: 1rem;

      // #zy-music-render-canvas {
      //   .zy-music-mini-bar,
      //   canvas {
      //     transform: translateY(
      //       calc(var(--footer-bar-height) - var(--music-bar-height) / 2 - 1rem)
      //     );
      //   }
      // }
    }
  }

  /* @media (orientation: landscape) {
    #zy-music-bar.transition-translate-out {
      transform: none;
    }
  } */
</style>