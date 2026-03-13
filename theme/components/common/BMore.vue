<script setup lang="ts">
import type { ThemeConfig } from "../../types";
import { useData } from "vitepress";
import { computed, toRefs } from "vue";
import LineMdMoonToSunny from "~icons/line-md/moon-alt-to-sunny-outline-loop-transition";
import LineMdSunnyToMoon from "~icons/line-md/sunny-outline-to-moon-alt-loop-transition";
import { getIcon } from "../../utils/icon";
import BIcon from "./BIcon.vue";
import BLink from "./BLink.vue";
import BPopover from "./BPopover.vue";

const { theme, isDark } = useData<ThemeConfig>();
const { socialLinks } = toRefs(theme.value);

const themeToggleText = computed(() => isDark.value ? "切换到浅色模式" : "切换到深色模式");
</script>

<template>
  <BPopover trigger="hover" :offset="0">
    <template #reference>
      <BIcon icon="i-lucide-more-horizontal" class="block lg:hidden" />
    </template>
    <div class="w-50 left-unset! right-sm!">
      <div class="popover-item" @click="isDark = !isDark">
        <BIcon :icon=" isDark ? LineMdSunnyToMoon : LineMdMoonToSunny" />
        <span class="text-sm opacity-70">{{ themeToggleText }}</span>
      </div>
      <div class="my-2 h-1px w-full bg-muted"></div>
      <BLink v-for="link in socialLinks" :key="link.link" class="popover-item" :href="link.link" :target="link.target ?? '_target'" :aria-label="link.ariaLabel">
        <BIcon :icon="getIcon(link.icon)" />
        <span class="text-sm opacity-70">{{ link.title }}</span>
      </BLink>
    </div>
  </BPopover>
  <div class="hidden items-center lg:flex">
    <BIcon :icon=" isDark ? LineMdSunnyToMoon : LineMdMoonToSunny" :title="themeToggleText" @click="isDark = !isDark" />
    <div class="mx-2 h-4 w-1px bg-muted"></div>
    <BLink v-for="link in socialLinks" :key="link.link" :title="link.title" :href="link.link" :target="link.target ?? '_target'" :aria-label="link.ariaLabel">
      <BIcon :icon="getIcon(link.icon)" />
    </BLink>
  </div>
</template>

<style scoped>
.popover-item {
  @apply flex cursor-pointer select-none items-center rounded-lg transition hover:bg-accent motion-reduce:transition-none hover:text-secondary-foreground!;
}
</style>
