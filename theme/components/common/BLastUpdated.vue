<script setup lang="ts">
import type { ThemeConfig } from "../../types";
import { useData } from "vitepress";
import { computed, onMounted, ref, watchEffect } from "vue";

const { theme, page, lang } = useData<ThemeConfig>();

const date = computed(() => new Date(page.value.lastUpdated!));
const isoDatetime = computed(() => date.value.toISOString());
const datetime = ref("");

// set time on mounted hook to avoid hydration mismatch due to
// potential differences in timezones of the server and clients
onMounted(() => {
  watchEffect(() => {
    datetime.value = new Intl.DateTimeFormat(
      theme.value.lastUpdated?.formatOptions?.forceLocale ? lang.value : undefined,
      theme.value.lastUpdated?.formatOptions ?? {
        dateStyle: "short",
        timeStyle: "short",
      },
    ).format(date.value);
  });
});
</script>

<template>
  <div>
    {{ theme.lastUpdated?.text || 'Last updated' }}:
    <time :datetime="isoDatetime">{{ datetime }}</time>
  </div>
</template>
