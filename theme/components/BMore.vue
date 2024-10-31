<script setup lang="ts">
import { useData } from "vitepress";
import { ref, toRefs } from "vue";
import { getIcon } from "../utils/icon";
import BDrawer from "./BDrawer.vue";
import BIcon from "./BIcon.vue";
import BLink from "./BLink.vue";
import BPopover from "./BPopover.vue";
import type { ThemeConfig } from "../types";

const { theme } = useData<ThemeConfig>();
const { socialLinks } = toRefs(theme.value);

const showDrawer = ref(false);
</script>

<template>
  <BIcon icon="i-lucide-grip" class="md:hidden" title="更多" @click="showDrawer = !showDrawer" />
  <BDrawer v-model="showDrawer" to="body" placement="right" class="max-w-100vw w-[var(--b-drawer-width)]">
    <div class="px-sm">
      TODO NavItem<br />
      divider<br />
      其他链接
      socialLinks<br />
      <BLink v-for="link in socialLinks" :key="link.link" :href="link.link" target="_blank" :aria-label="link.ariaLabel">
        <BIcon :icon="getIcon(link.icon)" />
      </BLink>
    </div>
  </BDrawer>
  <BPopover trigger="hover" :offset="0">
    <template #reference>
      <BIcon icon="i-lucide-more-horizontal" class="hidden md:block lg:hidden" />
    </template>
    <div class="w-50 left-unset! right-sm!">
      <BLink v-for="link in socialLinks" :key="link.link" class="flex items-center rounded-lg transition hover:bg-secondary motion-reduce:transition-none hover:text-secondary-foreground!" :href="link.link" target="_blank" :aria-label="link.ariaLabel">
        <BIcon :icon="getIcon(link.icon)" />
        <span class="text-sm opacity-70">{{ link.title }}</span>
      </BLink>
    </div>
  </BPopover>
  <div class="hidden items-center lg:flex">
    <BLink v-for="link in socialLinks" :key="link.link" :title="link.title" :href="link.link" target="_blank" :aria-label="link.ariaLabel">
      <BIcon :icon="getIcon(link.icon)" />
    </BLink>
  </div>
</template>
