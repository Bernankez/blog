<template>
  <div class="flex flex-gap-2 p-3 rounded-3 box-border backdrop-blur cursor-default hover:bg-gray-50 dark:hover:bg-dark-800 transition-200">
    <div class="shrink-0 flex justify-center items-center h-13 w-13 rounded-3">
      <slot name="icon">
        <div class="text-8 sm:text-9" :class="[icon]"></div>
      </slot>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center flex-gap-2">
        <NuxtLink :href="href" target="_blank" class="w-fit text-4 sm:text-5 underline underline-offset-4">
          {{ name }}
        </NuxtLink>
        <div role="button" class=" cursor-pointer" :class="[copyIcon]" @click="copy"></div>
      </div>
      <div class="text-3.5 sm:text-4 m-t-2">
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
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

const copyIconDefault = ref("i-material-symbols:content-copy-outline-rounded");
const successIcon = ref("i-line-md:confirm");
const copyIcon = ref(copyIconDefault.value);

const copy = async () => {
  await navigator.clipboard.writeText(props.href);
  copyIcon.value = successIcon.value;
  setTimeout(() => {
    copyIcon.value = copyIconDefault.value;
  }, 1500);
};
</script>
