<script setup lang="ts">
import { withBase } from "vitepress";

defineProps<{
  href?: string;
  target?: string;
  ariaLabel?: string;
}>();
</script>

<template>
  <a :href="href ? withBase(href) : undefined" :target :aria-label>
    <slot></slot>
  </a>
</template>
