<script setup lang="ts">
const layoutStore = useLayoutStore()

const { top } = usetops(() => layoutStore.top)
</script>

<template>
    <Transition>
        <div v-if="layoutStore.isOpen('top')" id="z-top-bgmask" @click="layoutStore.toggle('top')" />
    </Transition>
    <Transition>
        <top v-if="layoutStore.top?.length" id="z-top" class="scrollcheck-y" :class="{ show: layoutStore.isOpen('top') }">
            <div class="container">
                <TransitionGroup name="float-in">
                    <div v-for="top in tops" :key="top.name" class="top">
                        <!-- 更换页面时通过 key 更新这些组件，防止旧数据导致问题 -->
                        <component :is="top.comp" :key="$route.path" />
                    </div>
                </TransitionGroup>
            </div>
        </top>
    </Transition>
</template>