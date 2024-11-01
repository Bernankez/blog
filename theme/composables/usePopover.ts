import { useDebounceFn, useEventListener } from "@vueuse/core";
import { type ComponentPublicInstance, computed, type MaybeRefOrGetter, onMounted, type Ref, ref, toValue, watch } from "vue";
import type { Placement } from "@floating-ui/vue";

export type Trigger = "click" | "hover" | "focus" | "manual";

export interface UsePopoverOptions {
  disabled?: MaybeRefOrGetter<boolean>;
  show?: Ref<boolean>;
  trigger?: MaybeRefOrGetter<Trigger>;
  keepAliveOnHover?: MaybeRefOrGetter<boolean>;
}

export function usePopover(referenceRef: MaybeRefOrGetter<HTMLElement | ComponentPublicInstance | undefined>, floatingRef: MaybeRefOrGetter<HTMLElement | ComponentPublicInstance | undefined>, options?: UsePopoverOptions) {
  const { disabled, show = ref(false), trigger = "click", keepAliveOnHover = true } = options || {};

  if (disabled) {
    return {
      show,
    };
  }

  const referenceEl = computed(() => {
    const el = toValue(referenceRef);
    if (!el || el instanceof HTMLElement) {
      return el;
    }
    return el.$el;
  });

  const floatingEl = computed(() => {
    const el = toValue(floatingRef);
    if (!el || el instanceof HTMLElement) {
      return el;
    }
    return el.$el;
  });

  const stopHandlers = ref<(() => void)[]>([]);

  // TODO 当子Popover的floating element未消失时，自身floating element不应消失
  // TODO 当子Popover的floating element消失时，应向父Popover发出通知，父Popover执行自身消失逻辑

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
        stopHandlers.value.push(useEventListener(referenceEl, "mouseenter", handleMouseEnter));
        stopHandlers.value.push(useEventListener(referenceEl, "mouseleave", handleMouseLeave));
        stopHandlers.value.push(useEventListener(floatingEl, "mouseenter", handleMouseEnter));
        stopHandlers.value.push(useEventListener(floatingEl, "mouseleave", handleMouseLeave));
        break;
      }
      case "focus": {
        stopHandlers.value.push(useEventListener(referenceEl, "focusin", handleFocus));
        stopHandlers.value.push(useEventListener(referenceEl, "focusout", handleBlur));
        break;
      }
    }
  }

  function handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (toValue(referenceEl)?.contains(target)) {
      // click reference
      show.value = !show.value;
      return;
    }
    if (toValue(floatingEl)?.contains(target)) {
      // click floating
      if (toValue(keepAliveOnHover)) {
        return;
      }
    }
    show.value = false;
  }

  function handleMouseEnter(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (toValue(referenceEl)?.contains(target)) {
      // mouseenter reference
      show.value = true;
      return;
    }
    if (toValue(floatingEl)?.contains(target)) {
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

export function usePopoverTransition(placement?: MaybeRefOrGetter<Placement>, offset: MaybeRefOrGetter<string | number> = "10px") {
  return computed(() => {
    const _placement = toValue(placement);
    let _offset = toValue(offset);
    if (typeof _offset === "number") {
      _offset = `${_offset}px`;
    } else if (!Number.isNaN(Number(_offset))) {
      _offset = `${_offset}px`;
    }

    const placementMap: Record<Placement | "", string> = {
      "": `translateY(-${_offset})`,
      "top": `translateY(${_offset})`,
      "top-start": `translateY(${_offset})`,
      "top-end": `translateY(${_offset})`,
      "bottom": `translateY(-${_offset})`,
      "bottom-start": `translateY(-${_offset})`,
      "bottom-end": `translateY(-${_offset})`,
      "left": `translateX(${_offset})`,
      "left-start": `translateX(${_offset})`,
      "left-end": `translateX(${_offset})`,
      "right": `translateX(-${_offset})`,
      "right-start": `translateX(-${_offset})`,
      "right-end": `translateX(-${_offset})`,
    };

    return placementMap[_placement || ""];
  });
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
