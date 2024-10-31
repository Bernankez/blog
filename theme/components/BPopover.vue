<script lang="ts" setup>
import { autoUpdate, flip as flipMw, offset as offsetMw, shift as shiftMw, useFloating } from "@floating-ui/vue";
import { isDefined } from "@vueuse/core";
import { computed, ref } from "vue";
import type { Middleware, Placement, Strategy } from "@floating-ui/vue";
import type { ComponentPublicInstance, StyleValue, TeleportProps } from "vue";
import { type DisplayDirective, useDisplayDirective } from "../composables/useDisplayDirective";
import { useMergedState } from "../composables/useMergedState";
import { refDebouncedShow, type Trigger, usePopover, usePopoverTransition } from "../composables/usePopover";
import BMask from "./BMask.vue";
import { BSlot } from "./BSlot";

const { displayDirective = "if", strategy, placement, disabled, lockScroll, keepAliveOnHover = true, to, offset = 10, flip, shift, trigger = "click", delay = 100, duration = 100, rawPopupStyle = false, maskStyle, maskClass } = defineProps<{
  displayDirective?: DisplayDirective;
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
  lockScroll?: boolean;
  rawPopupStyle?: boolean;
  maskClass?: any;
  maskStyle?: StyleValue;
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
const { vIf, vShow } = useDisplayDirective(displayDirective, debouncedShow);

const customPopupClass = computed(() => rawPopupStyle ? [] : ["bg-card b-1 b-solid b-border shadow rounded-lg p-2"]);

const popoverTransition = usePopoverTransition(placement, 10);

defineExpose({
  toggle: (_show?: boolean) => {
    if (isDefined(_show)) {
      show.value = _show;
    } else {
      show.value = !show.value;
    }
  },
});
</script>

<template>
  <BSlot ref="referenceRef" v-bind="$attrs">
    <slot name="reference"></slot>
  </BSlot>
  <BMask v-if="lockScroll" v-model="debouncedShow" :class="maskClass" :style="maskStyle" :visible="false" :lock-scroll />
  <Transition name="fade">
    <Teleport :to="to ?? 'body'">
      <BSlot v-if="vIf" v-show="vShow" ref="floatingRef" class="z-[var(--b-popover-z-index)]" :style="[floatingStyles]" :class="[...customPopupClass]">
        <slot></slot>
      </BSlot>
    </Teleport>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity var(--b-transition-duration) var(--b-transition-animation),
    transform var(--b-transition-duration-slow) var(--b-animation-ease);
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}

.fade-enter-from,
.fade-leave-to {
  transform: v-bind(popoverTransition);
  opacity: 0;
}
</style>
