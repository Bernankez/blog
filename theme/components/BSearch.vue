<script setup lang="ts">
import { isDefined, useActiveElement, useMagicKeys, whenever } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import BButton from "./BButton.vue";

const show = ref(false);

const activeElement = useActiveElement();
const shouldNotTrigger = computed(() => {
  const dataset = activeElement.value?.dataset;
  if (isDefined(dataset?.disableCommand)) {
    return dataset.disableCommand !== "false";
  }
  return activeElement.value?.tagName === "INPUT" || activeElement.value?.tagName === "TEXTAREA";
});

const { Slash } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.code === "Slash" && !show.value && !shouldNotTrigger.value) {
      e.preventDefault();
    }
  },
});

whenever(() => Slash.value && !shouldNotTrigger.value, () => {
  show.value = true;
});

watch(show, () => {
  // eslint-disable-next-line no-alert
  alert(show.value);
});
</script>

<template>
  <BButton variant="outline" class="mr-xs flex shrink-0 items-center justify-between gap-1.5 text-sm opacity-70 lg:w-40 hover:opacity-100" @click="show = true">
    <div class="flex items-center gap-1.5">
      <div class="i-line-md-search -scale-x-100"></div>
      搜索...
    </div>
    <kbd class="b-1 b-border rounded b-solid px-1">/</kbd>
  </BButton>
</template>
