<script setup lang="ts">
import { cva } from "cva";
import { twMerge } from "tailwind-merge";
import type { VariantProps } from "cva";

const { as = "button", variant = "primary", size = "md", disabled, class: classVal } = defineProps<{
  as?: string;
  disabled?: boolean;
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  class?: any;
}>();

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();

const buttonVariants = cva("transition motion-reduce:transition-none hover:bg-opacity-90", {
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      outline: "bg-background b-1 b-border b-solid hover:b-primary",
      text: "bg-transparent opacity-70 hover:opacity-100",
      ghost: "bg-transparent hover:bg-accent",
      disabled: "bg-muted text-muted-foreground",
    },
    disabled: {
      true: "bg-muted text-muted-foreground cursor-not-allowed",
    },
    size: {
      sm: "text-sm py-1 px-2 rounded-lg",
      md: "rounded-xl p-2",
      lg: "px-sm py-2 text-lg rounded-xl",
      icon: "w-10 h-10 rounded-xl flex justify-center items-center",
    },
  },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;

function onClick(e: MouseEvent) {
  if (!disabled) {
    emit("click", e);
  }
}
</script>

<template>
  <as type="button" :class="twMerge([buttonVariants({ variant, size, disabled }), classVal])" @click="onClick">
    <slot></slot>
  </as>
</template>
