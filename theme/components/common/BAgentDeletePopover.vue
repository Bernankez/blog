<script setup lang="ts">
import BButton from "./BButton.vue";
import BPopover from "./BPopover.vue";

defineProps<{ question: string; confirmLabel: string }>();
const emit = defineEmits<{ cancel: []; confirm: [] }>();
const open = defineModel<boolean>({ required: true });
const vFocus = { mounted: (el: HTMLElement) => el.focus({ preventScroll: true }) };
</script>

<template>
  <BPopover v-model="open" to="#message-popovers" placement="bottom-end" strategy="fixed" flip shift :offset="4" :delay="0" :duration="0">
    <template #reference>
      <slot />
    </template>
    <div role="dialog" :aria-label="question" class="delete-confirmation">
      <p class="mx-1.5 mb-2 mt-1 text-sm">
        {{ question }}
      </p>
      <div class="flex justify-end gap-2">
        <BButton v-focus variant="ghost" size="sm" @click="emit('cancel')">
          取消
        </BButton>
        <BButton variant="ghost" size="sm" class="text-primary" @click="emit('confirm')">
          {{ confirmLabel }}
        </BButton>
      </div>
    </div>
  </BPopover>
</template>

<style scoped>
.delete-confirmation button:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
</style>
