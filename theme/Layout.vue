<script setup lang="ts">
import { useData } from "vitepress";
import { toRefs } from "vue";
import BNav from "./components/BNav.vue";

const { frontmatter } = useData();

const { layout } = toRefs(frontmatter.value);
</script>

<template>
  <BNav />
  <div v-if="layout === 'home'">
    home
  </div>
  <div v-else-if="layout === 'doc'">
    <Content />
  </div>
  <div v-else-if="layout === 'page'">
    page
  </div>
  <div v-else>
    <Content />
  </div>
</template>
