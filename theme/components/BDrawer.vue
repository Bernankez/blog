<script setup lang="ts">
import { useMounted } from "@vueuse/core";
import { twMerge } from "tailwind-merge";
import { ref, watchEffect } from "vue";
import BIcon from "./BIcon.vue";

const { closeOnMask = true } = defineProps<{
  closeOnMask?: boolean;
}>();

const show = defineModel({
  default: true,
});

const mounted = useMounted();

const overflow = ref<string>();
watchEffect(() => {
  if (mounted.value) {
    if (show.value) {
      overflow.value = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = overflow.value || "";
    }
  }
});
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="b-mask fixed bottom-0 left-0 right-0 top-0 z-[var(--b-mask-z-index)] bg-foreground bg-opacity-60" @click="closeOnMask && (show = false)"></div>
  </Transition>
  <Transition name="slide">
    <aside v-if="show" class="fixed bottom-0 left-0 top-0 z-[var(--b-aside-z-index)] max-w-100vw w-[var(--b-drawer-width)] overflow-auto bg-background">
      <div :class="twMerge('relative box-border p-sm', $attrs.class as string)" v-bind="$attrs">
        <div class="flex justify-end">
          <BIcon icon="i-line-md-close-small" class="p-sm pr-0" @click="show = false" />
        </div>
        <slot></slot>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition-property: transform opacity;
  transition-duration: 0.25s;
  transition-timing-function: ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
