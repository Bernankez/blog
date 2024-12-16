<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";
import BContent from "./components/common/BContent.vue";
import BFooter from "./components/common/BFooter.vue";
import BHome from "./components/common/BHome.vue";
import BNav from "./components/common/BNav.vue";
import BNotFound from "./components/common/BNotFound.vue";
import type { Layout, PageClass, ThemeConfig } from "./types";

const { frontmatter, page } = useData<ThemeConfig>();

const layout = computed<Layout>(() => frontmatter.value.layout);
const pageClass = computed<PageClass>(() => frontmatter.value.pageClass || undefined);
</script>

<template>
  <div v-if="layout !== false" :class="pageClass">
    <BNav />
    <template v-if="page.isNotFound">
      <BNotFound />
      <BFooter />
    </template>
    <template v-else-if="layout === 'home'">
      <BHome />
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
