<script setup lang="ts">
import { ref } from "vue";
import type { NavItemWithLink } from "../types";

const { item } = defineProps<{
  item: NavItemWithLink;
}>();

const base = ref("flex items-center rounded-lg p-2 text-sm transition hover:bg-secondary motion-reduce:transition-none hover:text-secondary-foreground! outline-none");
</script>

<template>
  <a v-if="!item.items" :class="base" :href="item.link" :rel="item.rel" :target="item.target">
    {{ item.text }}
  </a>
</template>
