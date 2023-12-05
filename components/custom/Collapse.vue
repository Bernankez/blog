<template>
  <div class="collapse grid overflow-hidden rounded-2 bg-gray-50 dark:bg-dark-800" :class="[collapsed ? 'p-b-0 grid-rows-[auto_0fr]' : 'p-b-5 grid-rows-[auto_1fr]']">
    <div class="z-1 flex cursor-pointer justify-between p-5" @click="collapsed = !collapsed">
      <ContentSlot :use="$slots.summary" unwrap="p" />
      <div class="i-icon-park-outline:right text-5 transition" :class="[collapsed ? '' : 'rotate-90']"></div>
    </div>
    <div class="content p-x-5" :class="[collapsed ? 'opacity-0 min-h-0' : 'min-h-fit']">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const collapsed = ref(false);
</script>

<style scoped>
.collapse {
  transition-property: padding, grid-template-rows;
  transition-duration: .2s;
  transition-timing-function: ease-in-out;
}

.content {
  transition-property: opacity;
  transition-duration: .2s;
  transition-timing-function: ease-in-out;
}
</style>
