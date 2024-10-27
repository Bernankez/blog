import { useDebounceFn, useEventListener } from "@vueuse/core";
import { computed, type MaybeRefOrGetter, onMounted, type Ref, ref, toValue, watch } from "vue";

export type Trigger = "click" | "hover" | "focus" | "manual";

export interface UsePopoverOptions {
  show?: Ref<boolean>;
  trigger?: MaybeRefOrGetter<Trigger>;
  keepAliveOnHover?: MaybeRefOrGetter<boolean>;
}

export function usePopover(referenceRef: MaybeRefOrGetter<HTMLElement | undefined>, floatingRef: MaybeRefOrGetter<HTMLElement | undefined>, options?: UsePopoverOptions) {
  const { show = ref(false), trigger = "click", keepAliveOnHover = true } = options || {};

  const stopHandlers = ref<(() => void)[]>([]);

  watch(() => toValue(trigger), () => {
    stopHandlers.value.forEach(fn => fn());
    stopHandlers.value = [];
    registerEventHandlers();
  }, { immediate: true });

  function registerEventHandlers() {
    switch (toValue(trigger)) {
      case "click": {
        onMounted(() => {
          stopHandlers.value.push(useEventListener(document.body, "click", handleClick));
        });
        break;
      }
      case "hover": {
        stopHandlers.value.push(useEventListener(referenceRef, "mouseenter", handleMouseEnter));
        stopHandlers.value.push(useEventListener(referenceRef, "mouseleave", handleMouseLeave));
        stopHandlers.value.push(useEventListener(floatingRef, "mouseenter", handleMouseEnter));
        stopHandlers.value.push(useEventListener(floatingRef, "mouseleave", handleMouseLeave));
        break;
      }
      case "focus": {
        stopHandlers.value.push(useEventListener(referenceRef, "focusin", handleFocus));
        stopHandlers.value.push(useEventListener(referenceRef, "focusout", handleBlur));
        break;
      }
    }
  }

  function handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (toValue(referenceRef)?.contains(target)) {
      // click reference
      show.value = !show.value;
      return;
    }
    if (toValue(floatingRef)?.contains(target)) {
      // click floating
      if (toValue(keepAliveOnHover)) {
        return;
      }
    }
    show.value = false;
  }

  function handleMouseEnter(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (toValue(referenceRef)?.contains(target)) {
    // mouseenter reference
      show.value = true;
      return;
    }
    if (toValue(floatingRef)?.contains(target)) {
      // mouseenter floating
      if (toValue(keepAliveOnHover)) {
        show.value = true;
      }
    }
  }

  function handleMouseLeave(_e: MouseEvent) {
    show.value = false;
  }

  function handleFocus(_e: FocusEvent) {
    show.value = true;
  }

  function handleBlur(_e: FocusEvent) {
    show.value = false;
  }

  return {
    show,
  };
}

export function refDebouncedShow(_show?: Ref<boolean>, options?: {
  delay?: MaybeRefOrGetter<number>;
  duration?: MaybeRefOrGetter<number>;
}) {
  const { delay, duration } = options || {};

  const show = _show || ref(false);
  const debouncedShowRef = ref(show.value);

  const syncShow = useDebounceFn(() => {
    debouncedShowRef.value = show.value;
  }, computed(() => show.value ? toValue(delay) ?? 0 : toValue(duration) ?? 0));

  watch(show, syncShow);

  return debouncedShowRef;
}
