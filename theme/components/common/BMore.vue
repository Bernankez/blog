<script setup lang="ts">
import type { ThemeConfig } from "../../types";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useData } from "vitepress";
import { ref, toRefs, watchEffect } from "vue";
import { getIcon } from "../../utils/icon";
import BDrawer from "./BDrawer.vue";
import BIcon from "./BIcon.vue";
import BLink from "./BLink.vue";
import BMoreSidebar from "./BMoreSidebar.vue";
import BPopover from "./BPopover.vue";

const { theme } = useData<ThemeConfig>();
const { socialLinks, nav } = toRefs(theme.value);

const { md } = useBreakpoints(breakpointsTailwind);

const showDrawer = ref(false);
watchEffect(() => {
  if (md.value) {
    showDrawer.value = false;
  }
});
</script>

<template>
  <BIcon icon="i-line-md-menu-unfold-left" class="md:hidden" title="更多" @click="showDrawer = !showDrawer" />
  <BDrawer v-model="showDrawer" to="body" placement="right" class="max-w-100vw w-[var(--b-drawer-width)]">
    <div class="px-sm">
      <BMoreSidebar v-for="(item, i) in nav" :key="i" :item />
      <div class="flex items-center justify-center">
        <BLink v-for="link in socialLinks" :key="link.link" :title="link.title" :href="link.link" :target="link.target ?? '_target'" :aria-label="link.ariaLabel">
          <BIcon :icon="getIcon(link.icon)" />
        </BLink>
      </div>
    </div>
  </BDrawer>
  <BPopover trigger="hover" :offset="0">
    <template #reference>
      <BIcon icon="i-lucide-more-horizontal" class="hidden md:block lg:hidden" />
    </template>
    <div class="w-50 left-unset! right-sm!">
      <BLink v-for="link in socialLinks" :key="link.link" class="flex items-center rounded-lg transition hover:bg-secondary motion-reduce:transition-none hover:text-secondary-foreground!" :href="link.link" :target="link.target ?? '_target'" :aria-label="link.ariaLabel">
        <BIcon :icon="getIcon(link.icon)" />
        <span class="text-sm opacity-70">{{ link.title }}</span>
      </BLink>
    </div>
  </BPopover>
  <div class="hidden items-center lg:flex">
    <BLink v-for="link in socialLinks" :key="link.link" :title="link.title" :href="link.link" :target="link.target ?? '_target'" :aria-label="link.ariaLabel">
      <BIcon :icon="getIcon(link.icon)" />
    </BLink>
  </div>
</template>
