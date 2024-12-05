<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";
import BContent from "./components/BContent.vue";
import BFooter from "./components/BFooter.vue";
import BHome from "./components/BHome.vue";
import BNav from "./components/BNav.vue";
import BNotFound from "./components/BNotFound.vue";
import type { Layout, PageClass, ThemeConfig } from "./types";

const { frontmatter, page } = useData<ThemeConfig>();

const layout = computed<Layout>(() => frontmatter.value.layout);
const pageClass = computed<PageClass>(() => frontmatter.value.pageClass || undefined);
</script>

<template>
  <div v-if="layout !== false" :class="pageClass">
    <BNav />
    <template v-if="page.isNotFound">
      <div class="min-h-[calc(100vh_-_var(--b-nav-height)_-_var(--b-footer-height))]">
        <BNotFound />
      </div>
      <BFooter />
    </template>
    <template v-else-if="layout === 'home'">
      <div class="min-h-[calc(100vh_-_var(--b-nav-height)_-_var(--b-footer-height))]">
        <BHome />
      </div>
      <BFooter />
    </template>
    <template v-else-if="layout === 'page'">
      <Content />
    </template>
    <template v-else-if="layout && layout !== 'doc'">
      <component :is="layout" />
    </template>
    <template v-else>
      <BContent />
    </template>
  </div>
  <Content v-else />
</template>

<style scoped>
.b-main {
  min-height: calc(100vh - var(--b-nav-height) - var(--b-footer-height));
}
</style>
