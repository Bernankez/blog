<script setup lang="ts">
import BLink from "./BLink.vue";
import type { TocItem } from "../types";

defineProps<{
  hideInactive?: boolean;
  activeLink?: string;
  item?: TocItem;
}>();

const emit = defineEmits<{
  click: [e: MouseEvent, item?: TocItem];
}>();
</script>

<template>
  <div class="flex transition duration-[var(--b-transition-duration-slow)] group-hover:opacity-100" :class="[hideInactive && activeLink !== item?.link && 'opacity-0']">
    <BLink :href="item?.link" :class="[activeLink === item?.link && 'text-primary']" class="w-full rounded-lg py-1.5 text-sm text-muted-foreground transition hover:text-primary motion-reduce:transition-none" @click="e => emit('click', e, item)">
      {{ item?.title }}
    </BLink>
  </div>
  <div v-if="item?.children?.length" class="pl-sm">
    <BTocItem v-for="_item in item.children" :key="_item.link" :active-link :item="_item" @click="(e, item) => emit('click', e, item)" />
  </div>
</template>
