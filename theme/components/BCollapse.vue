<script setup lang="ts">
import { cva } from "cva";
import { twMerge } from "tailwind-merge";
import { ref } from "vue";
import type { VariantProps } from "cva";
import { useMergedState } from "../composables/useMergedState";

const { disabled, headerClass, titleClass, title, readonly, defaultCollapsed = false } = defineProps<{
  disabled?: boolean;
  readonly?: boolean;
  headerClass?: string;
  titleClass?: string;
  title?: string;
  defaultCollapsed?: boolean;
}>();

const collapseVariants = cva("cursor-pointer", {
  variants: {
    disabled: {
      true: "cursor-not-allowed text-muted-foreground",
    },
    readonly: {
      true: "cursor-default",
    },
  },
});

const _collapsed = defineModel({
  default: false,
});

const uncontrolled = ref(defaultCollapsed);
const collapsed = useMergedState(_collapsed, uncontrolled);

export type CollapseVariants = VariantProps<typeof collapseVariants>;
</script>

<template>
  <div>
    <div :class="[twMerge(collapseVariants({ disabled, readonly }))]" @click="collapsed = !collapsed">
      <slot name="header" :collapsed>
        <div :class="twMerge(headerClass)" class="flex items-center justify-between">
          <div :class="twMerge(titleClass)">
            {{ title }}
          </div>
          <div>
            <div class="i-line-md-chevron-small-right transition" :class="[!collapsed && 'rotate-90']"></div>
          </div>
        </div>
      </slot>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
