<script setup lang="ts">
import { cva } from "cva";
import { computed } from "vue";
import type { VariantProps } from "cva";
import type { StyleValue, TeleportProps } from "vue";
import { useDisplayDirective } from "../composables/useDisplayDirective";
import BIcon from "./BIcon.vue";
import BMask from "./BMask.vue";
import type { DisplayDirective } from "../composables/useDisplayDirective";

defineOptions({
  inheritAttrs: false,
});

const { to = "body", showMask = true, lockScroll = true, showClose = true, placement = "left", closeOnMask = true, maskClass, maskStyle, displayDirective = "if", maskVisible = true } = defineProps<{
  to?: TeleportProps["to"];
  lockScroll?: boolean;
  showMask?: boolean;
  showClose?: boolean;
  placement?: DrawerVariants["placement"];
  displayDirective?: DisplayDirective;
  closeOnMask?: boolean;
  maskClass?: any;
  maskStyle?: StyleValue;
  maskVisible?: boolean;
}>();

const show = defineModel({
  default: false,
});

const drawerVariants = cva("fixed", {
  variants: {
    placement: {
      left: "top-0 bottom-0 left-0",
      right: "top-0 bottom-0 right-0",
      top: "left-0 right-0 top-0",
      bottom: "left-0 right-0 bottom-0",
    },
  },
});

const transform = computed(() => {
  switch (placement) {
    case "top":
      return "translateY(-100%)";
    case "left":
      return "translateX(-100%)";
    case "right":
      return "translateX(100%)";
    case "bottom":
      return "translateY(100%)";
  }
  return "";
});

type DrawerVariants = VariantProps<typeof drawerVariants>;

const { vIf, vShow } = useDisplayDirective(displayDirective, show);
</script>

<template>
  <BMask :to :model-value="showMask && show" :visible="maskVisible" :lock-scroll="lockScroll" :class="[maskClass]" :style="[maskStyle]" duration="var(--b-transition-duration-slow)" @update:model-value="value => show = value" @click="closeOnMask && (show = false)" />
  <Transition name="slide-fade">
    <Teleport :to>
      <aside v-if="vIf" v-show="vShow" v-bind="$attrs" :class="[drawerVariants({ placement })]" class="z-[var(--b-aside-z-index)] box-border overflow-auto bg-background p-sm">
        <div v-if="showClose" class="flex justify-end">
          <BIcon icon="i-line-md-close-small" class="p-sm pr-0" @click="show = false" />
        </div>
        <slot></slot>
      </aside>
    </Teleport>
  </Transition>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition:
    opacity var(--b-transition-duration) var(--b-transition-animation),
    transform var(--b-transition-duration-slow) var(--b-animation-ease);
}

@media (prefers-reduced-motion: reduce) {
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: none;
  }
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: v-bind(transform);
  opacity: 0;
}
</style>
