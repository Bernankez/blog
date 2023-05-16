---
title: "获取隐藏元素（display: none）的样式"
---

# 获取隐藏元素（`display: none`）的样式

隐藏的元素（`display: none`）无法获取到它的样式，因此大致思路是，获取到该元素，将它的`display`设置为可见，设置`visibility`为`hidden`，设置`position`为`absolute`，然后获取样式。之后复原它的`display`、`visibility`和`position`即可。

我写了一个简单的Vue3下适用SSR的Composable。

`useHiddenElementStyle.ts`
```typescript
import type { Fn, MaybeComputedElementRef, MaybeElement, UnRefElementReturn } from "@vueuse/core";
import { unrefElement, useEventListener } from "@vueuse/core";
import { onMounted, onUnmounted, ref, watch } from "vue";

export function useHiddenElementStyle(target: MaybeComputedElementRef) {
  const style = ref<Record<keyof CSSStyleDeclaration, string>>({} as any);

  function updateStyle<T extends MaybeElement>(el: UnRefElementReturn<T>) {
    if (!el) { return; }
    const _style = el.style;
    const _computedStyle = window.getComputedStyle(el);
    const { getStyle } = createStyleSelector({ style: _style, computedStyle: _computedStyle });
    const display = getStyle("display");
    const visibility = getStyle("visibility");
    const position = getStyle("position");
    if (display === "none") {
      el.style.display = "unset";
      el.style.visibility = "hidden";
      el.style.position = "absolute";
      style.value = transformCSSProperties(window.getComputedStyle(el));
      el.style.position = <string>position;
      el.style.visibility = <string>visibility;
      el.style.display = <string>display;
    } else {
      style.value = transformCSSProperties(window.getComputedStyle(el));
    }
  }

  watch(
    () => unrefElement(target),
    (el) => {
      updateStyle(el);
    });

  let stopListenResize: Fn, stopListenOrientationChange: Fn;
  onMounted(() => {
    stopListenResize = useEventListener(window, "resize", () => {
      updateStyle(unrefElement(target));
    });

    stopListenOrientationChange = useEventListener(window, "orientationchange", () => {
      updateStyle(unrefElement(target));
    });
  });

  onUnmounted(() => {
    stopListenResize();
    stopListenOrientationChange();
  });

  return {
    style,
  };
}

function transformCSSProperties(styles: CSSStyleDeclaration) {
  const style: Record<string, string> = {};
  const length = styles.length;
  for (let i = 0; i < length; i++) {
    const prop = styles[i];
    const value = styles.getPropertyValue(prop);
    style[prop] = value;
  }
  return style as Record<keyof CSSStyleDeclaration, string>;
}

function createStyleSelector(options?: { style?: CSSStyleDeclaration; computedStyle?: CSSStyleDeclaration }) {
  const { style = {}, computedStyle = {} } = options || {};
  return {
    getStyle(prop: keyof CSSStyleDeclaration) {
      return (style as CSSStyleDeclaration)[prop] || (computedStyle as CSSStyleDeclaration)[prop] || "";
    },
  };
}
```