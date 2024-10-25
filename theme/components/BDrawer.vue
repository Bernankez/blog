<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import { useDisplayDirective } from "../composables/useDisplayDirective";
import BIcon from "./BIcon.vue";
import BMask from "./BMask.vue";

const { closeOnMask = true, displayDirective = "if" } = defineProps<{
  displayDirective?: "show" | "if";
  closeOnMask?: boolean;
}>();

const show = defineModel({
  default: true,
});

const { vIf, vShow } = useDisplayDirective(displayDirective, show);
</script>

<template>
  <BMask v-model="show" duration="0.5s" @click="closeOnMask && (show = false)" />
  <Transition name="slide-fade">
    <aside v-if="vIf" v-show="vShow" class="reduce:top-1 fixed bottom-0 left-0 top-0 z-[var(--b-aside-z-index)] max-w-100vw w-[var(--b-drawer-width)] overflow-auto bg-background">
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
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition:
    opacity var(--b-transition-duration) var(--b-transition-timing-function),
    transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

@media (prefers-reduced-motion: reduce) {
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: none;
  }
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
