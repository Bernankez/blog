<script setup lang="ts">
import { useWindowScroll } from "@vueuse/core";
import LineMdArrowCloseUp from "~icons/line-md/arrow-close-up";
import BButton from "./BButton.vue";

const { y } = useWindowScroll();
</script>

<template>
  <BButton variant="outline" size="icon" title="返回顶部" class="rounded-full opacity-50 hover:bg-opacity-100 hover:opacity-100" @click="y = 0">
    <LineMdArrowCloseUp />
  </BButton>
</template>
