<template>
  <div class="grid lg:grid-cols-3 gap-8 p-y-20 sm:p-y-24 lg:p-y-32 box-border">
    <div class="lg:grid-col-span-2">
      <div class="text-center lg:text-left font-bold text-15 font-nuxt-sans">
        <ContentSlot :use="$slots.title" unwrap="p" />
      </div>
      <div class="text-center lg:text-left text-5 text-gray">
        <ContentSlot :use="$slots.subtitle" unwrap="p" />
      </div>
    </div>
    <div class="flex justify-center lg:block lg:grid-col-span-1">
      <img class="w-70 h-70 lg:rounded-10" src="/avatar.png" alt="avatar" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
