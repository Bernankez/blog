<script setup lang="ts">
import BLink from "./BLink.vue";
import type { TocItem } from "../types";

defineProps<{
  headers?: TocItem[];
}>();
</script>

<template>
  <div v-for="header in headers" :key="header.link">
    <div class="flex">
      <BLink :href="header.link" class="transition hover:text-primary motion-reduce:transition-none">
        {{ header.title }}
      </BLink>
    </div>
    <div class="pl-sm">
      <BToc :headers="header.children" />
    </div>
  </div>
</template>
