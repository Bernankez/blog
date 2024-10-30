<script setup lang="ts">
import { useElementHover } from "@vueuse/core";
import { useData } from "vitepress";
import { computed, ref, toRefs } from "vue";
import BLink from "./BLink.vue";
import type { ThemeConfig } from "../types";

const { showLogo = true, size = "md" } = defineProps<{
  showLogo?: boolean;
  size?: "md" | "sm";
}>();

const { theme, site } = useData<ThemeConfig>();
const { siteTitle } = toRefs(theme.value);

const logoRef = ref<InstanceType<typeof BLink> | null>(null);
const isHover = useElementHover(() => logoRef.value?.$el);
const imgSrc = computed(() => isHover.value ? theme.value.logoOnHover : theme.value.logo);
</script>

<template>
  <BLink ref="logoRef" href="/" class="b-logo flex shrink-0 items-center gap-sm" :class="[size]">
    <img v-if="showLogo" :src="imgSrc" class="b-logo-img" />
    <span v-if="siteTitle !== false" class="b-logo-title font-semibold">{{ siteTitle ?? site.title }}</span>
  </BLink>
</template>

<style scoped>
.b-logo-img {
  object-fit: scale-down;
}

.b-logo.md {
  .b-logo-img {
    height: var(--b-nav-logo-height);
  }

  .b-logo-title {
    @apply text-xl;
  }
}

.b-logo.sm {
  .b-logo-img {
    height: calc(var(--b-nav-logo-height) - 10px);
  }

  .b-logo-title {
    @apply text-base;
  }
}
</style>
