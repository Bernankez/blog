<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import BLink from "./BLink.vue";
import type { TocItem } from "../types";

const { activeLink, item } = defineProps<{
  hideInactive?: boolean;
  activeLink?: string;
  item?: TocItem;
}>();

const emit = defineEmits<{
  click: [e: MouseEvent, item?: TocItem];
}>();

const isSelfActive = computed(() => activeLink === item?.link);

const divRef = ref<HTMLDivElement>();
watchEffect(() => {
  if (divRef.value && item) {
    // eslint-disable-next-line vue/no-mutating-props
    item.tocElement = divRef.value;
  }
});
</script>

<template>
  <div ref="divRef" class="flex transition duration-[var(--b-transition-duration-slow)] group-hover:opacity-100 motion-reduce:transition-none" :class="[hideInactive && !isSelfActive && 'opacity-0']">
    <BLink :href="item?.link" :class="[isSelfActive && 'text-primary']" class="w-full rounded-lg py-1.5 text-sm opacity-70 transition hover:text-primary hover:opacity-100 motion-reduce:transition-none" @click="e => emit('click', e, item)">
      {{ item?.title }}
    </BLink>
  </div>
  <div v-if="item?.children?.length" class="pl-sm">
    <BTocItem v-for="_item in item.children" :key="_item.link" :hide-inactive :active-link :item="_item" @click="(e, item) => emit('click', e, item)" />
  </div>
</template>
