<script setup lang="ts">
import type { Layout, PageClass, ThemeConfig } from "./types";
import { useElementVisibility } from "@vueuse/core";
import mediumZoom from "medium-zoom";
import { useData, useRouter } from "vitepress";
import { computed, markRaw, onMounted, ref, watchEffect } from "vue";
import { toast } from "vue-sonner";
import BBackToTop from "./components/common/BBackToTop.vue";
import BContent from "./components/common/BContent.vue";
import BFooter from "./components/common/BFooter.vue";
import BHome from "./components/common/BHome.vue";
import BNav from "./components/common/BNav.vue";
import BNotFound from "./components/common/BNotFound.vue";
import BPwaPrompt from "./components/common/BPwaPrompt.vue";
import BToast from "./components/common/BToast.vue";
import BToggleTheme from "./components/common/BToggleTheme.vue";
import { useServiceWorker } from "./composables/useServiceWorker";

const { frontmatter, page } = useData<ThemeConfig>();

const layout = computed<Layout>(() => frontmatter.value.layout);
const pageClass = computed<PageClass>(() => frontmatter.value.pageClass || undefined);

const headerEl = ref<HTMLDivElement>();
onMounted(() => {
  const el = document.querySelector(".b-nav");
  if (el) {
    headerEl.value = el as HTMLDivElement;
  }
});

function setupMediumZoom() {
  mediumZoom("[data-zoomable]", {
    background: "transparent",
  });
}

onMounted(setupMediumZoom);

const router = useRouter();
router.onAfterRouteChange = setupMediumZoom;

const visible = useElementVisibility(headerEl);

const { offlineReady, needRefresh, updateServiceWorker, close } = useServiceWorker();

watchEffect(() => {
  if (offlineReady.value) {
    toast.custom(markRaw(BPwaPrompt), {
      componentProps: {
        type: "offlineReady",
      },
      onDismiss: close,
      onAutoClose: close,
    });
  } else if (needRefresh.value && updateServiceWorker.value) {
    toast.custom(markRaw(BPwaPrompt), {
      duration: Infinity,
      componentProps: {
        type: "needRefresh",
        refresh: updateServiceWorker.value,
      },
      onDismiss: close,
      onAutoClose: close,
    });
  }
});
</script>

<template>
  <div v-if="layout !== false" :class="pageClass">
    <BNav />
    <template v-if="page.isNotFound">
      <BNotFound />
      <BFooter />
    </template>
    <template v-else-if="layout === 'home'">
      <BHome />
      <BFooter />
    </template>
    <template v-else-if="layout === 'page'">
      <Content />
    </template>
    <template v-else-if="layout && layout !== 'doc'">
      <component :is="layout" />
    </template>
    <template v-else>
      <BContent />
      <Teleport to="body">
        <Transition name="fade">
          <div v-show="headerEl && !visible" class="fixed bottom-2 right-2 z-[var(--b-floating-buttons-z-index)] flex flex-col gap-sm rounded-full bg-background bg-opacity-0 p-1 ring-0 ring-border transition md:hidden hover:bg-opacity-100 hover:ring-1">
            <BToggleTheme />
            <BBackToTop />
          </div>
        </Transition>
      </Teleport>
    </template>
  </div>
  <Content v-else />
  <BToast />
</template>

<style>
.medium-zoom-overlay {
  backdrop-filter: blur(5rem);
}

.medium-zoom-overlay,
.medium-zoom-image--opened {
  z-index: 999;
}
</style>

<style scoped>
.b-main {
  min-height: calc(100vh - var(--b-nav-height) - var(--b-footer-height));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--b-transition-duration-slow) var(--b-transition-animation);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
