<template>
  <div class="box-border flex cursor-default flex-gap-2 rounded-3 p-3 backdrop-blur transition-200 hover:bg-gray-50 dark:hover:bg-dark-800">
    <div class="h-13 w-13 flex shrink-0 items-center justify-center rounded-3">
      <slot name="icon">
        <div class="text-8 sm:text-9" :class="[icon]"></div>
      </slot>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center flex-gap-2">
        <NuxtLink :href="href" target="_blank" class="w-fit text-4 underline underline-offset-4 sm:text-5">
          {{ name }}
        </NuxtLink>
        <div role="button" class="cursor-pointer" :class="[copyIcon]" @click="copy"></div>
      </div>
      <div class="m-t-2 text-3.5 sm:text-4">
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
