<script setup lang="ts">
import { useData } from "vitepress";
import { computed, watch } from "vue";
import { useToc } from "../../composables/useToc";
import { resolveTitle } from "../../utils/toc";
import BTocItem from "./BTocItem.vue";
import type { ThemeConfig, TocItem } from "../../types";

const { showTitle, showIndicator, hideInactive } = defineProps<{
  hideInactive?: boolean;
  showTitle?: boolean;
  showIndicator?: boolean;
}>();

const emit = defineEmits<{
  click: [e: MouseEvent, item?: TocItem];
  active: [index: number, item?: TocItem];
}>();

const { theme } = useData<ThemeConfig>();

const { headers, flattedHeaders, activeLink, activeIndex } = useToc();

watch(activeIndex, (index) => {
  emit("active", index, flattedHeaders.value[index]);
}, { immediate: true });

const top = computed(() => (activeIndex.value + (showTitle ? 1 : 0)) * 32);
</script>

<template>
  <div class="group" :class="[showIndicator && 'relative b-0 b-l-2 b-border b-solid pl-sm']">
    <Transition name="fade">
      <div v-if="showIndicator && activeIndex > -1" :style="{ top: `${top}px` }" class="absolute my-5px h-22px w-2px bg-primary transition-top -left-2px"></div>
    </Transition>
    <div v-if="showTitle" class="cursor-default py-1.5 text-sm">
      {{ resolveTitle(theme) }}
    </div>
    <BTocItem v-for="header in headers" :key="header.link" :truncate="showIndicator" :hide-inactive :active-link :item="header" @click="(e, item) => emit('click', e, item)" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--b-transition-duration) var(--b-transition-animation);
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
