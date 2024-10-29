<script setup lang="ts">
import { useElementVisibility } from "@vueuse/core";
import { useData } from "vitepress";
import { onMounted, ref } from "vue";
import { useToc } from "../composables/useToc";
import { resolveTitle } from "../utils/toc";
import BButton from "./BButton.vue";
import BDrawer from "./BDrawer.vue";
import BLogo from "./BLogo.vue";
import BPopover from "./BPopover.vue";
import BSidebar from "./BSidebar.vue";
import BToc from "./BToc.vue";
import type { ThemeConfig } from "../types";

const { theme } = useData<ThemeConfig>();
const { headers } = useToc();

const popoverRef = ref<InstanceType<typeof BPopover>>();

const showSidebar = ref(false);

const showToc = ref(false);

const headerEl = ref<HTMLDivElement>();
onMounted(() => {
  const el = document.querySelector(".b-nav");
  if (el) {
    headerEl.value = el as HTMLDivElement;
  }
});

const visible = useElementVisibility(headerEl);
</script>

<template>
  <div class="sticky top-0 z-[var(--b-toc-bar-z-index)] h-[var(--b-toc-bar-height)] b-0 b-b-1 b-border bg-card bg-opacity-70 backdrop-blur-8 backdrop-saturate-50 md:top-[var(--b-nav-height)]">
    <div class="grid grid-cols-3 mx-auto h-full max-w-[var(--b-max-width)]">
      <section class="flex items-center">
        <BButton variant="text" class="flex items-center gap-1 px-xs" size="sm" @click="showSidebar = true">
          <div class="i-line-md-menu"></div>
          菜单
        </BButton>
      </section>
      <section class="flex items-center justify-center">
        <Transition name="logo-fade">
          <BLogo v-if="headerEl && !visible" size="sm" />
        </Transition>
      </section>
      <section class="flex items-center justify-end">
        <BPopover v-if="headers.length" ref="popoverRef" v-model="showToc" raw-popup-style lock-scroll placement="bottom-start" :offset="10">
          <template #reference>
            <BButton variant="text" size="sm" class="flex items-center gap-1 px-xs">
              {{ resolveTitle(theme) }}
              <div class="i-line-md-chevron-small-right transition motion-reduce:transition-none" :class="[showToc && 'rotate-90']"></div>
            </BButton>
          </template>
          <div class="overflow-hidden b-1 rounded-lg b-solid bg-background shadow left-sm! right-sm!">
            <div class="max-h-70vh overflow-y-auto px-2xl py-1.5">
              <BToc @click="() => popoverRef?.toggle(false)" />
            </div>
          </div>
        </BPopover>
      </section>
    </div>
  </div>
  <BDrawer v-model="showSidebar" display-directive="show" class="px-3xl">
    <BSidebar />
  </BDrawer>
</template>

<style scoped>
.logo-fade-enter-active,
.logo-fade-leave-active {
  transition: opacity var(--b-transition-duration) var(--b-transition-animation);
}

@media (prefers-reduced-motion: reduce) {
  .logo-fade-enter-active,
  .logo-fade-leave-active {
    transition: none;
  }
}

.logo-fade-enter-from,
.logo-fade-leave-to {
  opacity: 0;
}
</style>
