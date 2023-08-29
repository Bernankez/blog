<template>
  <div class="grid box-border gap-8 p-y-20 lg:grid-cols-3 lg:p-y-32 sm:p-y-24">
    <div class="lg:grid-col-span-2">
      <div class="text-center font-nuxt-sans text-15 font-bold lg:text-left">
        <ContentSlot :use="$slots.title" unwrap="p" />
      </div>
      <div class="text-center text-5 text-nuxt-gray-400 lg:text-left">
        <ContentSlot :use="$slots.subtitle" unwrap="p" />
      </div>
      <div class="m-t-10 flex items-center justify-center flex-gap-6 text-center lg:justify-start lg:text-left">
        <ContentSlot :use="$slots.action" unwrap="p" />
        <NuxtLink class="font-500 text-nuxt-gray-400 hover:text-nuxt-gray-900 dark:hover:text-nuxt-gray-50" target="_blank" href="https://github.com/Bernankez/blog">
          GitHub 上看看 →
        </NuxtLink>
      </div>
    </div>
    <div class="flex justify-center lg:grid-col-span-1 lg:block">
      <img class="h-70 w-70 lg:rounded-10" :src="src" alt="avatar" @mouseenter="() => toggleAvatar('wink')" @mouseleave="() => toggleAvatar()" @touchstart.passive="() => toggleAvatar('wink')" @touchend.passive="() => toggleAvatar()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import avatar from "/avatar.webp";
import avatarWink from "/avatar-wink.webp";

const src = ref(avatar);

function toggleAvatar(type: "default" | "wink" = "default") {
  if (type === "wink") {
    src.value = avatarWink;
  } else {
    src.value = avatar;
  }
}
</script>
