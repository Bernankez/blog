<template>
  <div class="grid lg:grid-cols-3 gap-8 p-y-20 sm:p-y-24 lg:p-y-32 box-border">
    <div class="lg:grid-col-span-2">
      <div class="text-center lg:text-left font-bold text-15 font-nuxt-sans">
        <ContentSlot :use="$slots.title" unwrap="p" />
      </div>
      <div class="text-center lg:text-left text-5 text-nuxt-gray-400">
        <ContentSlot :use="$slots.subtitle" unwrap="p" />
      </div>
      <div class="flex justify-center lg:justify-start items-center flex-gap-6 text-center lg:text-left m-t-10">
        <ContentSlot :use="$slots.action" unwrap="p" />
        <NuxtLink class="text-nuxt-gray-400 hover:text-nuxt-gray-900 dark:hover:text-nuxt-gray-50 font-500" target="_blank" href="https://github.com/Bernankez/blog">
          GitHub 上看看 →
        </NuxtLink>
      </div>
    </div>
    <div class="flex justify-center lg:block lg:grid-col-span-1">
      <img class="w-70 h-70 lg:rounded-10" :src="src" alt="avatar" @mouseenter="() => toggleAvatar('wink')" @mouseleave="() => toggleAvatar()" @touchstart.passive="() => toggleAvatar('wink')" @touchend.passive="() => toggleAvatar()" />
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
