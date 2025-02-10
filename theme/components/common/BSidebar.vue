<script setup lang="ts">
import type { SidebarItem } from "../../types";
import { useId } from "vue";
import { useSidebar } from "../../composables/useSidebar";
import BSidebarItem from "./BSidebarItem.vue";

const emit = defineEmits<{
  click: [e: MouseEvent, item: SidebarItem];
}>();

const { sidebar, path } = useSidebar();

function onClick(e: MouseEvent, item: SidebarItem) {
  emit("click", e, item);
}
</script>

<template>
  <BSidebarItem v-for="item in sidebar.items" :key="item.link ?? useId()" :collapsed="sidebar.collapsed" :path :item @click="onClick" />
</template>
