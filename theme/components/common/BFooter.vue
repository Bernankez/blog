<script setup lang="ts">
import { useData } from "vitepress";
import { toRefs } from "vue";
import { getIcon } from "../../utils/icon";
import BIcon from "./BIcon.vue";
import BLink from "./BLink.vue";
import type { ThemeConfig } from "../../types";

const { theme } = useData<ThemeConfig>();
const { socialLinks } = toRefs(theme.value);
</script>

<template>
  <footer class="b-footer box-border b-0 b-t-1 b-border b-solid">
    <div class="mx-auto h-full max-w-[var(--b-max-width)] flex items-center justify-center">
      <BLink v-for="link in socialLinks" :key="link.link" :title="link.title" :aria-label="link.ariaLabel" :href="link.link" :target="link.target ?? '_target'">
        <BIcon :icon="getIcon(link.icon)" />
      </BLink>
    </div>
  </footer>
</template>

<style scoped>
.b-footer {
  height: var(--b-footer-height);
}
</style>
