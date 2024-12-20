<script setup lang="ts">
import { useMouseInElement } from "@vueuse/core";
import { useData } from "vitepress";
import { onMounted, ref, watch, watchEffect } from "vue";
import BButton from "./BButton.vue";
import BLink from "./BLink.vue";
// import BCow from "./BCow.vue";
import type { ThemeConfig } from "../../types";

const { frontmatter } = useData<ThemeConfig>();
// TODO custom with frontmatter
// TODO responsive style
watchEffect(() => {
  console.log(frontmatter.value);
});

const shakeElRef = ref<HTMLSpanElement>();
onMounted(() => {
  const shakeEl = shakeElRef.value;
  if (shakeEl) {
    shakeEl.classList.add("hover");
    setTimeout(() => {
      shakeEl.classList.remove("hover");
    }, 870);
  }
});

const { isOutside } = useMouseInElement(shakeElRef);
watch(isOutside, (isOutside) => {
  if (!isOutside) {
    shakeElRef.value?.classList.add("hover");
  } else {
    shakeElRef.value?.classList.remove("hover");
  }
}, { immediate: true });
</script>

<template>
  <div class="grid mx-auto h-full max-w-[var(--b-max-width)] min-h-[calc(100vh_-_var(--b-nav-height)_-_var(--b-footer-height))] w-full p-xs">
    <div class="h-full flex flex-col items-center justify-center gap-sm">
      <h1 class="text-6xl">
        <span ref="shakeElRef" class="shake inline-block cursor-default">
          👋
        </span>
      </h1>
      <h1 class="text-3xl font-bold">
        我是科科
      </h1>
      <div class="text-muted-foreground">
        <ruby>
          什么也不会，喜欢睡觉
          <rt>
            <samp>Knows nothing, likes sleeping.</samp>
          </rt>
        </ruby>
      </div>
      <!-- <BCow /> -->
      <div class="flex items-center gap-xs">
        <BLink href="/tech/front-end/tricks">
          <BButton class="rounded-full px-lg" as="div">
            随便看看
          </BButton>
        </BLink>
        <BLink href="https://github.com/Bernankez/blog" target="_blank">
          <BButton variant="secondary" class="rounded-full px-lg">
            GitHub
          </BButton>
        </BLink>
      </div>
      <div class="text-muted-foreground italic">
        🚧
        首页仍在施工中...
      </div>
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
