<script setup lang="ts">
import { useDebounceFn, useElementHover, useElementVisibility, useMounted } from "@vueuse/core";
import { twMerge } from "tailwind-merge";
import { useData } from "vitepress";
import { computed, ref, watchEffect } from "vue";
import { useToc } from "../composables/useToc";
import BButton from "./BButton.vue";
import BDocFooter from "./BDocFooter.vue";
import BFooter from "./BFooter.vue";
import BGitalk from "./BGitalk.vue";
import BSidebar from "./BSidebar.vue";
import BToc from "./BToc.vue";
import BTocBar from "./BTocBar.vue";
import type { ThemeConfig, TocItem } from "../types";
import "../styles/components/b-content.css";

const { theme } = useData<ThemeConfig>();

const { headers } = useToc();

const expandSidebar = ref(true);
const mounted = useMounted();

watchEffect(() => {
  if (mounted.value) {
    if (expandSidebar.value) {
      document.documentElement.style.setProperty("--b-sidebar-width", "var(--b-sidebar-expand-width)");
    } else {
      document.documentElement.style.setProperty("--b-sidebar-width", "var(--b-sidebar-fold-width)");
    }
  }
});

const sidebarWrapperClass = computed(() => twMerge([
  "sticky top-[var(--b-nav-height)] z-[var(--b-toc-bar-z-index)]",
  expandSidebar.value ? "b-0 b-r-1 b-border b-solid" : "",
  "transition-max-width motion-reduce:transition-none",
  "h-[calc(100vh_-_var(--b-nav-height))] overflow-hidden",
  "max-w-0 md:max-w-[var(--b-sidebar-width)]",
]));

const tocWrapperRef = ref<HTMLDivElement>();
const mouseInTocWrapper = useElementHover(tocWrapperRef);
const scroll = useDebounceFn((el: HTMLDivElement) => {
  if (el) {
    const visible = useElementVisibility(el);
    if (!visible.value && tocWrapperRef.value && !mouseInTocWrapper.value) {
      const halfOffsetHeight = tocWrapperRef.value.offsetHeight / 2;
      const scrollTop = tocWrapperRef.value.scrollTop;
      const tocElementTop = el.offsetTop;
      const tocElementHeight = el.offsetHeight;
      // keep scroll in block center
      const targetTop = tocElementTop - halfOffsetHeight + 2 * tocElementHeight;
      if (targetTop > scrollTop) {
        tocWrapperRef.value.scrollTo({
          behavior: "smooth",
          top: targetTop,
        });
      } else {
        tocWrapperRef.value.scrollTo({
          behavior: "smooth",
          top: targetTop,
        });
      }
    }
  }
}, 1500);
function onActive(index: number, item?: TocItem) {
  if (!tocWrapperRef.value) {
    return;
  }
  if (index === -1) {
    tocWrapperRef.value.scrollTo({
      behavior: "smooth",
      top: 0,
    });
    return;
  }
  if (item?.tocElement) {
    scroll(item.tocElement);
  }
}
</script>

<template>
  <main class="b-main">
    <div class="mx-auto max-w-[var(--b-max-width)] flex">
      <div :class="sidebarWrapperClass">
        <div class="h-full w-[var(--b-sidebar-expand-width)] flex flex-col">
          <div class="box-border h-full overflow-y-auto p-sm transition motion-reduce:transition-none" :class="[expandSidebar ? '' : 'opacity-0 pointer-events-none']">
            <BSidebar />
          </div>
          <div class="flex px-sm py-1.5" :class="[expandSidebar ? 'b-0 b-t-1 b-border b-solid' : '']">
            <div class="transition-width motion-reduce:transition-none" :class="[expandSidebar ? 'w-full' : 'w-0']"></div>
            <BButton class="shrink-0" :title="expandSidebar ? '收起' : '展开'" variant="ghost" size="icon" @click="expandSidebar = !expandSidebar">
              <div :class="[expandSidebar ? 'i-lucide-panel-left-close' : 'i-lucide-panel-left-open']"></div>
            </BButton>
          </div>
        </div>
      </div>
      <div class="w-0 flex-1">
        <BTocBar class="lg:hidden" />
        <div class="box-border p-2xl md:px-4xl">
          <Content class="b-doc" />
        </div>
        <BDocFooter />
        <BGitalk v-if="theme.comment?.gitalk" v-bind="theme.comment.gitalk" />
        <BFooter class="b-footer" />
      </div>
      <div v-if="headers.length" ref="tocWrapperRef" class="sticky top-[var(--b-nav-height)] z-[var(--b-toc-bar-z-index)] box-border hidden h-[calc(100vh_-_var(--b-nav-height))] w-[var(--b-toc-width)] overflow-y-auto px-lg py-4xl lg:block">
        <BToc show-indicator show-title hide-inactive @active="onActive" />
      </div>
    </div>
  </main>
</template>
