<script setup lang="ts">
import BButton from "./BButton.vue";
import BPopover from "./BPopover.vue";
</script>

<template>
  <div class="sticky top-0 z-[var(--b-toc-bar-z-index)] b-0 b-b-1 b-border bg-card bg-opacity-70 backdrop-blur-8 backdrop-saturate-50 md:top-[var(--b-nav-height)]">
    <div class="mx-auto max-w-[var(--b-max-width)] flex items-center justify-between p-sm">
      <div>
        <BPopover>
          <template #reference>
            <BButton>testing</BButton>
          </template>
          testing
        </BPopover>
      </div>
      <div>
        Back up top
      </div>
    </div>
  </div>
</template>
