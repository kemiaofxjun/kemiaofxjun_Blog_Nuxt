<script setup lang="ts">
const layoutStore = useLayoutStore()

const { top } = useWidgets(() => layoutStore.top)
</script>

<template>
    <Transition>
        <div v-if="layoutStore.isOpen('top')" id="z-top-bgmask" @click="layoutStore.toggle('top')" />
    </Transition>
    <Transition>
        <top v-if="layoutStore.top?.length" id="z-top" class="scrollcheck-y" :class="{ show: layoutStore.isOpen('top') }">
            <div class="container">
                <TransitionGroup name="float-in">
                    <div v-for="widget in widgets" :key="widget.name" class="widget">
                        <!-- 更换页面时通过 key 更新这些组件，防止旧数据导致问题 -->
                        <component :is="widget.comp" :key="$route.path" />
                    </div>
                </TransitionGroup>
            </div>
        </top>
    </Transition>
</template>