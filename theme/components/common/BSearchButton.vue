<script setup lang="ts">
import { isDefined, onKeyStroke } from "@vueuse/core";
import BButton from "./BButton.vue";

const show = defineModel<boolean>({
  default: false,
});

onKeyStroke("k", (event) => {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();
    show.value = true;
  }
});

onKeyStroke("/", (event) => {
  if (!shouldNotTrigger(event)) {
    event.preventDefault();
    show.value = true;
  }
});

function shouldNotTrigger(event: KeyboardEvent) {
  const element = event.target as HTMLElement;
  const tagName = element.tagName;
  const dataset = element.dataset;

  if (isDefined(dataset.disableCommand)) {
    return dataset.disableCommand !== "false";
  }

  return element.isContentEditable || tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
}
</script>

<template>
  <BButton variant="outline" aria-label="搜索博客" class="search-button mr-xs flex items-center justify-between gap-1.5 whitespace-nowrap text-sm opacity-70 lg:w-40 hover:opacity-100" @click="show = true">
    <div class="flex items-center gap-1.5">
      <div class="i-line-md-search -scale-x-100"></div>
      <span>搜索...</span>
    </div>
    <kbd class="b-1 b-border rounded b-solid px-1">/</kbd>
  </BButton>
</template>

<style scoped>
@media (max-width: 480px) {
  .search-button {
    @apply mr-0 appearance-none b-0 rounded-none bg-transparent p-xs text-base;
  }

  .search-button :is(span, kbd) {
    display: none;
  }
}
</style>
