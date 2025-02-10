<script setup lang="ts">
import type { MaybeElementRef } from "@vueuse/core";
import type { Ref } from "vue";
import type { SidebarItem, SidebarSingle, ThemeConfig } from "../../types";
import type { ButtonVariants } from "./BButton.vue";
import { useMouseInElement } from "@vueuse/core";
import { useData } from "vitepress";
import { ref, toRefs, toValue, useId, watch, watchEffect } from "vue";
import { isSidebarSingle } from "../../utils/sidebar";
import BButton from "./BButton.vue";
import BCow from "./BCow.vue";
import BLink from "./BLink.vue";

const { frontmatter, theme } = useData<ThemeConfig>();

const { sidebar } = toRefs(theme.value);

const fm = frontmatter as Ref<{
  hero?: {
    text?: string;
    taglineRt?: string;
    tagline?: string;
    actions?: {
      theme?: ButtonVariants["variant"];
      text?: string;
      link?: "random" | string;
      target?: string;
      as?: string;
    }[];
  };
}>;

function useShake(elRef: MaybeElementRef<HTMLSpanElement | undefined>) {
  watchEffect(() => {
    const shakeEl = toValue(elRef);
    if (shakeEl) {
      shakeEl.classList.add("hover");
      setTimeout(() => {
        shakeEl.classList.remove("hover");
      }, 870);
    }
  });

  const { isOutside } = useMouseInElement(elRef);
  watch(isOutside, (isOutside) => {
    if (!isOutside) {
      toValue(elRef)?.classList.add("hover");
    } else {
      toValue(elRef)?.classList.remove("hover");
    }
  }, { immediate: true });
}

const shakeElRef1 = ref<HTMLSpanElement>();
const shakeElRef2 = ref<HTMLSpanElement>();
useShake(shakeElRef1);
useShake(shakeElRef2);

function randomPick<T>(arr: T[]) {
  const day = Number(`${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}`);
  return arr[day % arr.length];
}

function lookAround() {
  if (!sidebar?.value) {
    return "/";
  }
  let sidebarSingle: SidebarSingle;
  if (isSidebarSingle(sidebar.value)) {
    sidebarSingle = sidebar.value;
  } else {
    sidebarSingle = sidebar.value[randomPick(Object.keys(sidebar.value))];
  }

  function pick(sidebarItem: SidebarItem) {
    if (sidebarItem.items?.length) {
      return pick(randomPick(sidebarItem.items));
    }
    return sidebarItem.link;
  }

  if (Array.isArray(sidebarSingle)) {
    return pick(randomPick(sidebarSingle));
  }
  return pick(randomPick(sidebarSingle.items));
}
</script>

<template>
  <div class="grid mx-auto h-full max-w-[var(--b-max-width)] min-h-[calc(100vh_-_var(--b-nav-height)_-_var(--b-footer-height))] w-full p-xs">
    <div class="h-full flex flex-col items-center justify-center gap-sm lg:hidden">
      <h1 class="flex flex-col items-center justify-center gap-sm text-3xl font-bold">
        <span ref="shakeElRef1" class="shake inline-block cursor-default select-none text-6xl">
          👋
        </span>
        {{ fm.hero?.text }}
      </h1>
      <h2 class="text-muted-foreground">
        <ruby>
          {{ fm.hero?.tagline }}
          <rt>
            <samp>{{ fm.hero?.taglineRt }}</samp>
          </rt>
        </ruby>
      </h2>
      <BCow />
      <section class="flex items-center gap-xs">
        <!-- eslint-disable-next-line vue/valid-v-for -->
        <BLink v-for="btn in fm.hero?.actions" :key="useId()" :href=" btn.link === 'random' ? lookAround() : btn.link" :target="btn.target">
          <BButton class="rounded-full px-lg" :variant="btn.theme" :as="btn.as">
            {{ btn.text }}
          </BButton>
        </BLink>
      </section>
    </div>
    <div class="hidden items-center justify-evenly lg:flex">
      <section class="flex flex-col gap-sm">
        <h1 class="text-4xl font-bold">
          {{ fm.hero?.text }}
          <span ref="shakeElRef2" class="shake inline-block cursor-default select-none">
            👋
          </span>
        </h1>
        <h2 class="text-muted-foreground">
          <ruby>
            {{ fm.hero?.tagline }}
            <rt>
              <samp>{{ fm.hero?.taglineRt }}</samp>
            </rt>
          </ruby>
        </h2>
        <section class="flex items-center gap-xs">
          <!-- eslint-disable-next-line vue/valid-v-for -->
          <BLink v-for="btn in fm.hero?.actions" :key="useId()" :href=" btn.link === 'random' ? lookAround() : btn.link" :target="btn.target">
            <BButton class="rounded-full px-lg" :variant="btn.theme" :as="btn.as">
              {{ btn.text }}
            </BButton>
          </BLink>
        </section>
      </section>
      <BCow :zoom="2" :height="500" :width="500" />
    </div>
  </div>
</template>

<style scoped>
.shake.hover {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 1px, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, -2px, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 4px, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, -4px, 0);
  }
}
</style>
