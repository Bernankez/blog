<script setup lang="ts">
import type { Component } from "vue";
import { twMerge } from "tailwind-merge";

const { icon } = defineProps<{
  icon?: Component | string | { svg: string };
}>();

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();
</script>

<template>
  <div :class="twMerge('box-border cursor-pointer cursor-pointer p-xs opacity-70 transition motion-reduce:transition-none hover:opacity-100', $attrs.class as string)" @click="e => emit('click', e)">
    <slot>
      <div v-if="typeof icon === 'string'" :class="icon"></div>
      <component :is="icon.svg" v-else-if="typeof icon === 'object' && !('render' in icon)" />
      <component :is="icon" v-else />
    </slot>
  </div>
</template>
