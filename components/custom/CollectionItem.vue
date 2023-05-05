<template>
  <div class="flex flex-gap-2 p-3 rounded-3 box-border backdrop-blur cursor-default hover:bg-gray-50 dark:hover:bg-dark-800 transition-200">
    <div class="shrink-0 flex justify-center items-center h-13 w-13 rounded-3">
      <slot name="icon">
        <div class="text-8 sm:text-9" :class="[icon]"></div>
      </slot>
    </div>
    <div class="flex flex-col">
      <NuxtLink :href="href" target="_blank" class="text-4 sm:text-5 underline underline-offset-4">
        {{ name }}
      </NuxtLink>
      <div class="text-3.5 sm:text-4 m-t-2">
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string;
  name?: string;
  href?: string;
  description?: string;
}>(), {
  icon: "",
  name: "",
  href: "",
  description: "",
});
</script>
