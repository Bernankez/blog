<script setup lang="ts">
import type { ThemeConfig } from "../../types";
import { useElementHover } from "@vueuse/core";
import { useData, withBase } from "vitepress";
import { computed, onMounted, ref, toRefs } from "vue";
import BLink from "./BLink.vue";

const { showLogo = true, showTitle = true, size = "md" } = defineProps<{
  showLogo?: boolean;
  showTitle?: boolean;
  size?: "md" | "sm";
}>();

const { theme, site } = useData<ThemeConfig>();
const { siteTitle } = toRefs(theme.value);

const logoRef = ref<InstanceType<typeof BLink> | null>(null);
const isHover = useElementHover(() => logoRef.value?.$el);
const imgSrc = computed(() => isHover.value ? theme.value.logoOnHover : theme.value.logo);
const image = ref<HTMLImageElement>();
const loaded = ref(false);
onMounted(() => {
  loaded.value = !!image.value?.naturalWidth;
});
</script>

<template>
  <BLink ref="logoRef" href="/" class="b-logo flex shrink-0 items-center gap-sm" :class="[size]">
    <span v-if="showLogo" class="b-logo-img relative aspect-square shrink-0" :class="!loaded && 'rounded-md bg-muted'">
      <img ref="image" :src="imgSrc && withBase(imgSrc)" :alt="showTitle ? '' : (siteTitle || site.title)" width="180" height="180" class="block size-full object-contain" @load="loaded = true" @error="loaded = false" />
      <span v-if="!loaded" aria-hidden="true" class="pointer-events-none absolute inset-0 rounded-md bg-muted"></span>
    </span>
    <span v-if="siteTitle !== false && showTitle" class="b-logo-title font-semibold">{{ siteTitle ?? site.title }}</span>
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
