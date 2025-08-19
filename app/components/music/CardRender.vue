<script setup lang="ts">
  import RenderHtml from "./RenderHtml/RenderHtml.vue";
  import RenderCanvas from "./RenderCanvas/RenderCanvas.vue";
  import RenderCombine from "./RenderCombine/RenderCombine.vue";

  type RenderMode = "html" | "canvas" | "combine";

  const props = defineProps({
    renderMode: {
      type: String as PropType<RenderMode>,
      default: "html",
    },
    coverSrc: {
      type: String,
      default: "",
    },
  });

  const emit = defineEmits(["switchOpen"]);

  const handleSwitchOpen = (open: boolean) => {
    emit("switchOpen", open);
  };
</script>

<template>
  <div class="h-full w-full">
    <RenderHtml
      v-if="renderMode === 'html'"
      :cover-src="coverSrc"
      @switchOpen="handleSwitchOpen"
    >
      <template #mini>
        <slot name="mini"></slot>
      </template>
      <template #panel>
        <slot name="panel"></slot>
      </template>
    </RenderHtml>
    <RenderCanvas
      v-if="renderMode === 'canvas'"
      :cover-src="coverSrc"
      @switchOpen="handleSwitchOpen"
    >
      <template #mini>
        <slot name="mini"></slot>
      </template>
      <template #panel>
        <slot name="panel"></slot>
      </template>
    </RenderCanvas>
    <RenderCombine
      v-if="renderMode === 'combine'"
      :cover-src="coverSrc"
      @switchOpen="handleSwitchOpen"
    >
      <template #mini>
        <slot name="mini"></slot>
      </template>
      <template #panel>
        <slot name="panel"></slot>
      </template>
    </RenderCombine>
  </div>
</template>

<style scoped lang="scss">
</style>