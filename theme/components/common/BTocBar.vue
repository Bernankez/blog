<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints, useElementVisibility } from "@vueuse/core";
import LineMdCloseToMenu from "~icons/line-md/close-to-menu-alt-transition";
import LineMdMenu from "~icons/line-md/menu";
import LineMdMenuToClose from "~icons/line-md/menu-to-close-alt-transition";
import { useData } from "vitepress";
import { onMounted, ref, watchEffect } from "vue";
import { useSidebar } from "../../composables/useSidebar";
import { useToc } from "../../composables/useToc";
import { isActive } from "../../utils/sidebar";
import { resolveTitle } from "../../utils/toc";
import BButton from "./BButton.vue";
import BDrawer from "./BDrawer.vue";
import BLogo from "./BLogo.vue";
import BPopover from "./BPopover.vue";
import BSidebar from "./BSidebar.vue";
import BToc from "./BToc.vue";
import type { SidebarItem, ThemeConfig } from "../../types";

defineOptions({
  inheritAttrs: false,
});

const { theme } = useData<ThemeConfig>();
const { headers } = useToc();

const { md, lg } = useBreakpoints(breakpointsTailwind);

const popoverRef = ref<InstanceType<typeof BPopover>>();

const showSidebar = ref<boolean>();
watchEffect(() => {
  if (md.value) {
    showSidebar.value = false;
  }
});

const showToc = ref(false);
watchEffect(() => {
  if (lg.value) {
    showToc.value = false;
  }
});

const headerEl = ref<HTMLDivElement>();
onMounted(() => {
  const el = document.querySelector(".b-nav");
  if (el) {
    headerEl.value = el as HTMLDivElement;
  }
});

const visible = useElementVisibility(headerEl);

const { path } = useSidebar();

function onClickSidebar(_: MouseEvent, item: SidebarItem) {
  if (isActive(path.value, item.link)) {
    return;
  }
  showSidebar.value = false;
}
</script>

<template>
  <div v-if="headers.length || !md" v-bind="$attrs" class="sticky left-0 right-0 top-0 z-[var(--b-toc-bar-z-index)] h-[var(--b-toc-bar-height)] b-0 b-b-1 b-border bg-card bg-opacity-70 backdrop-blur-8 backdrop-saturate-50 md:top-[var(--b-nav-height)]">
    <div class="grid grid-cols-3 mx-auto h-full max-w-[var(--b-max-width)]">
      <section class="flex items-center">
        <BButton variant="text" class="flex shrink-0 cursor-pointer items-center gap-1 px-xs md:hidden" size="sm" @click="showSidebar = true">
          <LineMdMenu v-if="showSidebar === undefined" />
          <LineMdMenuToClose v-else-if="showSidebar === true" />
          <LineMdCloseToMenu v-else-if="showSidebar === false" />
          菜单
        </BButton>
      </section>
      <section class="flex items-center justify-center">
        <Transition name="logo-fade">
          <BLogo v-if="headerEl && !visible" :show-logo="false" size="sm" />
        </Transition>
      </section>
      <section class="flex items-center justify-end">
        <BPopover v-if="headers.length && !lg" ref="popoverRef" v-model="showToc" raw-popup-style placement="bottom-start" :offset="10">
          <template #reference>
            <BButton variant="text" size="sm" class="flex shrink-0 cursor-pointer items-center gap-1 px-xs">
              {{ resolveTitle(theme) }}
              <div class="i-line-md-chevron-small-right transition motion-reduce:transition-none" :class="[showToc && 'rotate-90']"></div>
            </BButton>
          </template>
          <div class="overflow-hidden b-1 b-border rounded-lg b-solid bg-background shadow left-sm! right-sm! md:left-[calc(var(--b-sidebar-width)_+_0.875rem)]!">
            <div class="max-h-70vh overflow-y-auto px-2xl py-1.5">
              <BToc @click="() => popoverRef?.toggle(false)" />
            </div>
          </div>
        </BPopover>
      </section>
    </div>
  </div>
  <BDrawer v-model="showSidebar" display-directive="show" class="max-w-100vw w-[var(--b-drawer-width)] px-3xl">
    <BSidebar @click="onClickSidebar" />
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
