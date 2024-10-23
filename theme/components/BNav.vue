<script setup lang="ts">
import { useElementHover } from "@vueuse/core";
import { useData } from "vitepress";
import { computed, ref, toRefs } from "vue";
import { getIcon } from "../utils/icon";
import BDrawer from "./BDrawer.vue";
import BIcon from "./BIcon.vue";
import BLink from "./BLink.vue";
import BSidebar from "./BSidebar.vue";
import type { ThemeConfig } from "../types";

const { theme, site, isDark } = useData<ThemeConfig>();

const { siteTitle, socialLinks } = toRefs(theme.value);

const logoRef = ref<HTMLImageElement | null>(null);
const isHover = useElementHover(logoRef);
const imgSrc = computed(() => isHover.value ? theme.value.logoOnHover : theme.value.logo);

const showDrawer = ref(false);
</script>

<template>
  <header class="z-[var(--b-nav-z-index)] b-0 b-b-1 b-border b-solid bg-card bg-opacity-70 backdrop-blur-8 backdrop-saturate-50 md:sticky md:top-0">
    <div class="b-nav grid grid-cols-3 mx-auto box-border max-w-[var(--b-max-width)] px-sm">
      <section class="flex items-center">
        <BIcon icon="i-line-md-menu" class="pl-0" @click="showDrawer = true" />
      </section>
      <section class="flex items-center justify-center">
        <BLink href="/" class="flex shrink-0 items-center gap-sm">
          <img ref="logoRef" :src="imgSrc" class="logo" />
          <span v-if="siteTitle !== false" class="text-xl font-semibold">{{ siteTitle ?? site.title }}</span>
        </BLink>
      </section>
      <section class="flex items-center justify-end">
        <BIcon :icon=" isDark ? 'i-line-md-sunny-outline-to-moon-alt-loop-transition' : 'i-line-md-moon-alt-to-sunny-outline-loop-transition'" @click="isDark = !isDark" />
        <BLink v-for="link in socialLinks" :key="link.link" :href="link.link" target="_blank" :aria-label="link.ariaLabel">
          <BIcon :icon="getIcon(link.icon)" class="pr-0" />
        </BLink>
      </section>
    </div>
  </header>
  <BDrawer v-model="showDrawer" class="px-3xl">
    <BSidebar />
  </BDrawer>
</template>

<style scoped>
.b-nav {
  height: var(--b-nav-height);
}

.b-nav .logo {
  object-fit: scale-down;
  height: var(--b-nav-logo-height);
}
</style>
