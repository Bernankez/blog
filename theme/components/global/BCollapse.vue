<script setup lang="ts">
import { cva } from "cva";
import { twMerge } from "tailwind-merge";
import { ref } from "vue";
import type { VariantProps } from "cva";
import { useMergedState } from "../../composables/useMergedState";

const { type = "tip", disabled, headerClass, titleClass, title, readonly, defaultCollapsed = true } = defineProps<{
  type?: CollapseVariants["type"];
  disabled?: boolean;
  readonly?: boolean;
  headerClass?: string;
  titleClass?: string;
  title?: string;
  desc?: string;
  defaultCollapsed?: boolean;
}>();

const collapseVariants = cva("cursor-pointer max-h-fit text-sm", {
  variants: {
    type: {
      default: "bg-muted/30 text-foreground b-1 b-solid b-muted",
      note: "bg-muted/30 text-foreground b-1 b-solid b-muted",
      info: "bg-info/10 text-info b-1 b-solid b-info",
      tip: "bg-info/10 text-info b-1 b-solid b-info",
      success: "bg-success/10 text-success b-1 b-solid b-success",
      warning: "bg-warning/10 text-warning b-1 b-solid b-warning",
      error: "bg-error/10 text-error b-1 b-solid b-error",
    },
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
  <div class="b-collapse grid my overflow-hidden rounded-lg" :class="[collapsed ? 'grid-rows-[min-content_0fr]' : 'grid-rows-[min-content_1fr]', collapseVariants({ type })]">
    <div v-if="title ?? $slots.header ?? $slots.title ?? $slots.desc" :class="[twMerge('p-4', collapseVariants({ disabled, readonly }))]" @click="onCollapse">
      <slot name="header" :collapsed>
        <div :class="twMerge(headerClass)" class="flex items-center justify-between">
          <div :class="twMerge(titleClass)">
            <slot name="title">
              {{ title }}
            </slot>
          </div>
          <div class="flex items-center gap-1">
            <slot name="desc">
              <span class="text-xs opacity-70">
                {{ desc }}
              </span>
            </slot>
            <div class="i-line-md-chevron-small-right transition motion-reduce:transition-none" :class="[!collapsed && 'rotate-90']"></div>
          </div>
        </div>
      </slot>
    </div>
    <div class="flex flex-col-reverse overflow-hidden px-4 transition-all motion-reduce:transition-none" :class="[collapsed && 'opacity-0 py-0', !collapsed && 'py-4']">
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

.b-collapse :deep(p) {
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .b-collapse {
    transition: none;
  }
}
</style>
