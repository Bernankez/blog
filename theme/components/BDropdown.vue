<script setup lang="ts">
import { computed } from "vue";
import type { Placement } from "@floating-ui/vue";
import BPopover from "./BPopover.vue";

const { level = 0 } = defineProps<{
  level?: number;
}>();

const placement = computed<Placement>(() => level === 0 ? "bottom" : "right");
</script>

<template>
  <BPopover :placement>
    <template #reference>
      <slot>something</slot>
    </template>
    <div>
      <BDropdown :level="level + 1">
        fff
      </BDropdown>
    </div>
  </BPopover>
</template>
