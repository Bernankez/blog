<script setup lang="ts">
import { computed, ref } from "vue";

const { preview = "Preview", code = "Code" } = defineProps<{
  preview?: string;
  code?: string;
}>();

const tabs = computed(() => [preview, code]);

const active = ref(tabs.value[0]);
</script>

<template>
  <div class="my -mx-6 sm:mx-revert">
    <div class="flex rounded-t-none bg-muted bg-opacity-30 px-xs shadow-[inset_0_-1px_hsl(var(--border))] sm:rounded-t-lg">
      <div v-for="tab in tabs" :key="tab" class="relative cursor-pointer px-3 text-sm font-medium leading-12 transition hover:text-[var(--b-code-tab-hover-text-color)]" :class="[active === tab ? 'text-[var(--b-code-tab-active-text-color)]' : 'text-[var(--b-code-tab-text-color)]']" @click="active = tab">
        {{ tab }}
        <div class="absolute left-2 right-2 z-1 h-2px transition-250 -bottom-1px motion-reduce:transition-none" :class="[active === tab ? 'bg-primary' : 'bg-transparent']"></div>
      </div>
    </div>
    <div class="code-preview-content overflow-hidden rounded-b-none sm:rounded-b-lg">
      <slot v-if="active === code && $slots.code" name="code"></slot>
      <div v-if="active === preview && $slots.preview" class="bg-muted bg-opacity-30 p-sm">
        <slot name="preview"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-preview-content :deep(div[class*="language-"]) {
  margin: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
