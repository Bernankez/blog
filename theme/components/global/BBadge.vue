<script setup lang="ts">
import { cva } from "cva";
import type { VariantProps } from "cva";

const { type = "default", text } = defineProps<{
  type?: BadgeVariants["type"];
  text?: string;
}>();

const badgeVariants = cva("inline-block vertical-middle -translate-y-0.5 rounded-full ml-1 px-2 py-0.5 text-xs font-medium", {
  variants: {
    type: {
      default: "bg-secondary text-secondary-foreground",
      primary: "bg-primary text-primary-foreground",
      info: "bg-info text-info-foreground",
      success: "bg-success text-success-foreground",
      warning: "bg-warning text-warning-foreground",
      error: "bg-error text-error-foreground",
    },
  },
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;
</script>

<template>
  <span :class="badgeVariants({ type })">
    <slot>
      {{ text }}
    </slot>
  </span>
</template>
