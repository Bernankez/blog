<script setup lang="ts">
import { cva } from "cva";
import { twMerge } from "tailwind-merge";
import { ref } from "vue";
import type { VariantProps } from "cva";
import { useMergedState } from "../../composables/useMergedState";

const { disabled, headerClass, titleClass, title, readonly, defaultCollapsed = false } = defineProps<{
  disabled?: boolean;
  readonly?: boolean;
  headerClass?: string;
  titleClass?: string;
  title?: string;
  defaultCollapsed?: boolean;
}>();

const collapseVariants = cva("max-h-fit", {
  variants: {
    disabled: {
      true: "cursor-not-allowed text-muted-foreground",
    },
    readonly: {
      true: "cursor-default",
    },
  },
});

const _collapsed = defineModel<boolean>({
  default: undefined,
});

const uncontrolled = ref(defaultCollapsed);
const collapsed = useMergedState(_collapsed, uncontrolled);

export type CollapseVariants = VariantProps<typeof collapseVariants>;

function onCollapse() {
  if (readonly || disabled) {
    return;
  }
  collapsed.value = !collapsed.value;
}
</script>

<template>
  <div class="b-collapse grid overflow-hidden" :class="[collapsed ? 'grid-rows-[min-content_0fr]' : 'grid-rows-[min-content_1fr]']">
    <div v-if="title ?? $slots.header" :class="[twMerge('cursor-pointer', collapseVariants({ disabled, readonly }))]" @click="onCollapse">
      <slot name="header" :collapsed>
        <div :class="twMerge(headerClass)" class="flex items-center justify-between">
          <div :class="twMerge(titleClass)">
            {{ title }}
          </div>
          <div>
            <div class="i-line-md-chevron-small-right transition motion-reduce:transition-none" :class="[!collapsed && 'rotate-90']"></div>
          </div>
        </div>
      </slot>
    </div>
    <div class="flex flex-col-reverse overflow-hidden transition motion-reduce:transition-none" :class="[collapsed && 'opacity-0']">
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.b-collapse {
  transition-duration: var(--b-transition-duration);
  transition-timing-function: var(--b-transition-animation);
  transition-property: grid-template-rows;
}

@media (prefers-reduced-motion: reduce) {
  .b-collapse {
    transition: none;
  }
}
</style>
