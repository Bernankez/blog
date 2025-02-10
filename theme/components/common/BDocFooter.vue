<script setup lang="ts">
import type { ThemeConfig } from "../../types";
import { useData } from "vitepress";
import { usePrevNext } from "../../composables/usePrevNext";

const { theme } = useData<ThemeConfig>();

const control = usePrevNext();
</script>

<template>
  <nav class="b-doc-footer grid grid-cols-1 gap-sm sm:grid-cols-2">
    <div>
      <a v-if="control.prev?.link" :href="control.prev.link" class="b-doc-footer-item">
        <div class="text-sm text-foreground/70">
          {{ theme.docFooter?.prev || 'Previous page' }}
        </div>
        <div class="text-primary">
          {{ control.prev.text }}
        </div>
      </a>
    </div>
    <div>
      <a v-if="control.next?.link" :href="control.next.link" class="b-doc-footer-item items-end">
        <div class="text-sm text-foreground/70">
          {{ theme.docFooter?.next || 'Next page' }}
        </div>
        <div class="text-primary">
          {{ control.next.text }}
        </div>
      </a>
    </div>
  </nav>
</template>

<style scoped>
.b-doc-footer-item {
  @apply b-1 b-solid b-border flex flex-col gap-sm p-sm box-border hover:bg-muted/30 rounded-lg transition motion-reduce:transition-none hover:b-primary;
}
</style>
