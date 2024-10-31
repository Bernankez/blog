<script setup lang="ts">
import { computed, watch } from "vue";
import type { StyleValue, TeleportProps } from "vue";
import { useLockHtmlScroll } from "../composables/useLockHtmlScroll";

defineOptions({
  inheritAttrs: false,
});

const { visible = true, duration = "var(--b-transition-duration)", lockScroll = true, transition = true, to, class: _class, style } = defineProps<{
  visible?: boolean;
  to?: TeleportProps["to"];
  lockScroll?: boolean;
  transition?: boolean;
  duration?: number | string;
  class?: any;
  style?: StyleValue;
}>();

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();

const show = defineModel({
  default: false,
});

const isLocked = computed(() => lockScroll && show.value);

const { markUnlock, lock, unlock } = useLockHtmlScroll(isLocked, { manual: true });

watch(show, (show) => {
  if (show && lockScroll) {
    lock?.();
  } else {
    markUnlock?.();
    if (!transition) {
      unlock?.();
    }
  }
});
</script>

<template>
  <Teleport :to="to ?? 'body'">
    <Transition name="fade" @after-leave="unlock?.()">
      <div v-if="show" class="b-mask fixed bottom-0 left-0 right-0 top-0 z-[var(--b-mask-z-index)] bg-foreground bg-opacity-60" :class="[!visible && 'opacity-0', _class]" :style="[style]" @click="e => emit('click', e)"></div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-timing-function: var(--b-transition-animation);
  transition-duration: v-bind(duration);
  transition-property: opacity;
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
