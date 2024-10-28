<script setup lang="ts">
import { useToc } from "../composables/useToc";
import BButton from "./BButton.vue";
import BPopover from "./BPopover.vue";
import BToc from "./BToc.vue";

const { headers } = useToc();
</script>

<template>
  <div class="sticky top-0 z-[var(--b-toc-bar-z-index)] b-0 b-b-1 b-border bg-card bg-opacity-70 backdrop-blur-8 backdrop-saturate-50 md:top-[var(--b-nav-height)]">
    <div class="mx-auto max-w-[var(--b-max-width)] flex items-center justify-between p-xs">
      <div>
        <BPopover placement="bottom-start" :offset="0">
          <template #reference>
            <BButton variant="text" size="sm">
              页面导航
            </BButton>
          </template>
          <div>
            <BToc :headers />
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
