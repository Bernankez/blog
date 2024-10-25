import { type MaybeRefOrGetter, type Ref, ref } from "vue";

export type Trigger = "click" | "hover" | "focus";

export interface UsePopoverOptions {
  show?: Ref<boolean>;
  trigger?: MaybeRefOrGetter<Trigger>;
  keepAliveOnHover?: MaybeRefOrGetter<boolean>;
  delay?: MaybeRefOrGetter<number>;
  duration?: MaybeRefOrGetter<number>;
}

// const triggerEventMap = {
//   click: ["click"],
//   hover: ["mouseenter", "mouseleave"],
//   focus: ["focus", "blur"],
// } as const;

// interface TriggerEventHandlers {
//   click: (e: MouseEvent) => void;
//   mouseenter: (e: MouseEvent) => void;
//   mouseleave: (e: MouseEvent) => void;
//   focus: (e: MouseEvent) => void;
//   blur: (e: MouseEvent) => void;
// }

export function usePopover(referenceRef: MaybeRefOrGetter<HTMLElement | undefined>, floatingRef: MaybeRefOrGetter<HTMLElement | undefined>, options?: UsePopoverOptions) {
  const { show = ref(false), trigger = "click", keepAliveOnHover = true, delay, duration } = options || {};

  // TODO
  // 1 click
  // 1.1 click reference -> toggle show
  // 1.2 click outside reference -> show = false
  // 1.2.1 click floatingRef && keepAliveOnHover -> skip
  // 1.2.2 click floatingRef && !keepAliveOnHover show = false

  // 2 hover
  // 1.1 mouseenter reference show = true
  // 1.2 mouseleave reference show = false
  // 1.2.1 mouseenter floating && keepAliveOnHover -> show = true
  // 1.2.2 mouseleave floating && !keepAliveOnHover -> show = false

  // 3 hover
  // 1.1 focus reference show = true
  // 1.2 blur reference show = false
  // 1.2.1 focus floating && keepAliveOnHover -> show = true
  // 1.2.1 blur floating && !keepAliveOnHover -> show = true

  return {
    show,
  };
}
