import { computed, type MaybeRefOrGetter, toValue } from "vue";

export type DisplayDirective = "show" | "if";

export function useDisplayDirective(displayDirective: MaybeRefOrGetter<DisplayDirective | undefined>, show: MaybeRefOrGetter<boolean>) {
  const vIf = computed(() => toValue(displayDirective) === "show" || toValue(show));
  const vShow = computed(() => toValue(displayDirective) === "if" || toValue(show));

  return {
    vIf,
    vShow,
  };
}
