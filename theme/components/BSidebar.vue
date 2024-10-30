<script setup lang="ts">
import { useSidebar } from "../composables/useSidebar";
import BSidebarItem from "./BSidebarItem.vue";
import type { SidebarItem } from "../types";

const emit = defineEmits<{
  click: [e: MouseEvent, item: SidebarItem];
}>();

const { sidebar, path } = useSidebar();

function onClick(e: MouseEvent, item: SidebarItem) {
  emit("click", e, item);
}
</script>

<template>
  <BSidebarItem v-for="item in sidebar.items" :key="item.link" :collapsed="sidebar.collapsed" :path :indent-from-level="sidebar.indentFromLevel" :item @click="onClick" />
</template>
