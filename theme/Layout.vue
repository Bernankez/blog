<script setup lang="ts">
import BContent from "./components/BContent.vue";
import BFooter from "./components/BFooter.vue";
import BNav from "./components/BNav.vue";
</script>

<template>
  <BNav />
  <BContent />
  <BFooter class="b-footer" />
</template>

<style scoped>
.b-main {
  min-height: calc(100vh - var(--b-nav-height) - var(--b-footer-height));
}
</style>
