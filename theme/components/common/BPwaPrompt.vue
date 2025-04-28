<script setup lang="ts">
import BButton from "./BButton.vue";

const props = defineProps<{
  type: "offlineReady" | "needRefresh";
  close?: () => void;
  refresh?: () => void;
}>();

const emit = defineEmits<{
  closeToast: [];
}>();

function onClose() {
  emit("closeToast");
}

function onRefresh() {
  props.refresh?.();
  emit("closeToast");
}
</script>

<template>
  <div class="relative w-356px flex items-center justify-between gap-sm b-1 b-border rounded-md b-solid bg-card p-sm">
    <template v-if="type === 'needRefresh'">
      有新内容，点击更新
      <BButton size="sm" class="mr-2xl" @click="onRefresh">
        更新
      </BButton>
    </template>
    <template v-if="type === 'offlineReady'">
      离线内容已准备好
    </template>
    <div class="absolute right-0 top-0 cursor-pointer p-2 opacity-70 transition hover:opacity-100 motion-reduce:transition-none" @click="onClose">
      <div class="i-line-md-close-small"></div>
    </div>
  </div>
</template>
