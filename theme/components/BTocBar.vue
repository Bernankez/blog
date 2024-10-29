<script setup lang="ts">
import { useData } from "vitepress";
import { ref } from "vue";
import { resolveTitle } from "../utils/toc";
import BButton from "./BButton.vue";
import BPopover from "./BPopover.vue";
import BToc from "./BToc.vue";
import type { ThemeConfig } from "../types";

const { theme } = useData<ThemeConfig>();

const popoverRef = ref<InstanceType<typeof BPopover>>();
</script>

<template>
  <div class="sticky top-0 z-[var(--b-toc-bar-z-index)] b-0 b-b-1 b-border bg-card bg-opacity-70 backdrop-blur-8 backdrop-saturate-50 md:top-[var(--b-nav-height)]">
    <div class="mx-auto max-w-[var(--b-max-width)] flex items-center justify-between p-xs">
      <div>
        <BPopover ref="popoverRef" raw-popup-style lock-scroll placement="bottom-start" :offset="0">
          <template #reference>
            <BButton variant="text" size="sm">
              {{ resolveTitle(theme) }}
            </BButton>
          </template>
          <div class="left-sm right-sm overflow-hidden b-1 rounded-lg b-solid bg-background shadow">
            <div class="max-h-70vh overflow-y-auto px-2xl py-1.5">
              <BToc @click="() => popoverRef?.toggle(false)" />
            </div>
          </div>
        </BPopover>
      </div>
      <div>
        <BButton variant="text" size="sm">
          Back up top
        </BButton>
      </div>
    </div>
  </div>
</template>
