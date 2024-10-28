<script lang="ts" setup>
import { autoUpdate, flip as flipMw, offset as offsetMw, shift as shiftMw, useFloating } from "@floating-ui/vue";
import { isDefined } from "@vueuse/core";
import { computed, ref } from "vue";
import type { Middleware, Placement, Strategy } from "@floating-ui/vue";
import type { ComponentPublicInstance, StyleValue, TeleportProps } from "vue";
import { useMergedState } from "../composables/useMergedState";
import { refDebouncedShow, type Trigger, usePopover, usePopoverTransition } from "../composables/usePopover";
import { BSlot } from "./BSlot";

const { strategy, placement, disabled, keepAliveOnHover = true, to = "body", offset = 10, flip, shift, trigger = "click", delay = 100, duration = 100, rawPopupStyle = false, popupClass, popupStyle } = defineProps<{
  strategy?: Strategy;
  disabled?: boolean;
  placement?: Placement;
  keepAliveOnHover?: boolean;
  trigger?: Trigger;
  to?: TeleportProps["to"];
  offset?: number ;
  flip?: boolean;
  shift?: boolean;
  delay?: number;
  duration?: number;
  rawPopupStyle?: boolean;
  popupClass?: any;
  popupStyle?: StyleValue;
}>();

const referenceRef = ref<ComponentPublicInstance>();
const floatingRef = ref<ComponentPublicInstance>();

const _show = defineModel({
  default: false,
});
const uncontrolled = ref(false);
const show = useMergedState(_show, uncontrolled);

const middleware = computed(() => {
  const _middleware: Middleware[] = [];
  if (isDefined(offset)) {
    _middleware.push(offsetMw(offset));
  }
  if (flip) {
    _middleware.push(flipMw());
  }
  if (shift) {
    _middleware.push(shiftMw());
  }
  return _middleware;
});
const { floatingStyles } = useFloating(referenceRef, floatingRef, {
  strategy,
  whileElementsMounted: autoUpdate,
  middleware,
  placement,
  transform: false,
});

usePopover(referenceRef, floatingRef, {
  disabled,
  trigger,
  show,
  keepAliveOnHover,
});
const debouncedShow = refDebouncedShow(show, { delay, duration });

const customPopupClass = computed(() => rawPopupStyle ? [] : ["bg-card b-1 b-solid b-border shadow rounded-lg p-2"]);

const popoverTransition = usePopoverTransition(placement, 10);
</script>

<template>
  <BSlot ref="referenceRef" v-bind="$attrs">
    <slot name="reference"></slot>
  </BSlot>
  <Transition name="fade">
    <Teleport v-if="debouncedShow" :to>
      <BSlot ref="floatingRef" class="z-[var(--b-popup-z-index)]" :style="[floatingStyles, popupStyle]" :class="[...customPopupClass, popupClass]">
        <slot></slot>
      </BSlot>
    </Teleport>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity var(--b-transition-duration-fast) var(--b-transition-animation),
    transform var(--b-transition-duration) var(--b-animation-ease),
    scale var(--b-transition-duration) var(--b-animation-ease);
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}

.fade-enter-from,
.fade-leave-to {
  scale: 0.7;
  transform: v-bind(popoverTransition);
  opacity: 0;
}
</style>
