<script lang="ts" setup>
import { autoUpdate, flip as flipMw, offset as offsetMw, shift as shiftMw, useFloating } from "@floating-ui/vue";
import { isDefined, useMouseInElement } from "@vueuse/core";
import { computed, ref, watchEffect } from "vue";
import type { Middleware } from "@floating-ui/vue";
import type { StyleValue, TeleportProps } from "vue";
import { useMergedState } from "../composables/useMergedState";
import { type Trigger, usePopover } from "../composables/usePopup";

const { keepAliveOnHover = true, to = "body", offset = 10, flip, shift, trigger = "focus", rawPopupStyle = false, popupClass, popupStyle } = defineProps<{
  keepAliveOnHover?: boolean;
  trigger?: Trigger;
  to?: TeleportProps["to"];
  offset?: number;
  flip?: boolean;
  shift?: boolean;
  rawPopupStyle?: boolean;
  popupClass?: any;
  popupStyle?: StyleValue;
}>();

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

const referenceRef = ref<HTMLDivElement>();
const floatingRef = ref<HTMLDivElement>();

const { floatingStyles, update, isPositioned } = useFloating(referenceRef, floatingRef, {
  whileElementsMounted: autoUpdate,
  middleware,
  open: show,
});

usePopover(referenceRef, floatingRef, {
  show,
});

const customPopupClass = computed(() => rawPopupStyle ? [] : ["bg-card b-1 b-solid b-border shadow rounded-lg p-2"]);

const beforeElTop = computed(() => isDefined(offset) ? `-${offset + 2}px` : "0");
const beforeElHeight = computed(() => isDefined(offset) ? `${offset + 2}px` : "0");
</script>

<template>
  <div ref="referenceRef" v-bind="$attrs">
    <slot name="reference"></slot>
  </div>
  <Transition name="fade">
    <Teleport v-if="show" :to>
      <div ref="floatingRef" class="z-[var(--b-popup-z-index)]" :style="[floatingStyles, popupStyle]" :class="[...customPopupClass, popupClass]">
        <slot></slot>
      </div>
    </Teleport>
  </Transition>
</template>

<style scoped>
.b-floating-offset {
  position: absolute;
  top: v-bind(beforeElTop);
  left: 0;
  height: v-bind(beforeElHeight);
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--b-transition-duration) var(--b-transition-timing-function);
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
