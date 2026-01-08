<script setup lang="ts">
import type { ThemeConfig } from "../../types";
import { useChangelog } from "@nolebase/vitepress-plugin-git-changelog/client";
import { useData } from "vitepress";
import { computed, onMounted, ref } from "vue";
import BCollapse from "./BCollapse.vue";
import BEditLink from "./BEditLink.vue";
import BLastUpdated from "./BLastUpdated.vue";
import BLink from "./BLink.vue";

const { theme, lang } = useData<ThemeConfig>();

const { commits, useHmr } = useChangelog();
const changelogObj = computed(() => theme.value.changelog || {});
const enableChangelog = computed(() => theme.value.changelog !== false && commits.value.length);

onMounted(() => {
  useHmr();
});

const collapsed = ref(true);
const sort = ref<"asc" | "desc">(changelogObj.value.sortOptions?.default ?? "desc");
const sortedCommits = computed(() => {
  if (sort.value === "desc") {
    return commits.value;
  }
  return commits.value.toReversed();
});

function onCollapse() {
  if (!enableChangelog.value) {
    return;
  }
  collapsed.value = !collapsed.value;
}

function formatDatetime(value: number, options?: { pad?: boolean }) {
  const date = new Date(value);
  const isoDatetime = date.toISOString();

  const formatter = new Intl.DateTimeFormat(
    changelogObj.value.formatOptions?.forceLocale ? lang.value : undefined,
    changelogObj.value.formatOptions ?? {
      dateStyle: "short",
      timeStyle: "short",
    },
  );

  let datetime: string;
  if (options?.pad) {
    // Use formatToParts to pad numeric values
    const parts = formatter.formatToParts(date);
    datetime = parts
      .map((part) => {
        if (
          part.type === "month"
          || part.type === "day"
          || part.type === "hour"
          || part.type === "minute"
          || part.type === "second"
        ) {
          return part.value.padStart(2, "0");
        }
        return part.value;
      })
      .join("");
  }
  else {
    datetime = formatter.format(date);
  }

  return {
    date,
    isoDatetime,
    datetime,
  };
}
</script>

<template>
  <BCollapse v-model="collapsed" readonly class="my-sm mt-6xl">
    <template #header>
      <div class="flex flex-col-reverse items-center justify-between gap-sm sm:flex-row">
        <div class="flex items-center">
          <BLink v-if="theme.editLink" class="w-fit flex items-center gap-1 text-sm text-foreground text-opacity-60 font-medium transition motion-reduce:transition-none" :class="[enableChangelog ? 'hover:text-primary cursor-pointer select-none' : '']" @click="onCollapse">
            <div v-if="enableChangelog" role="button" class="cursor-pointer transition motion-reduce:transition-none" :class="!collapsed && 'rotate-90'">
              <div class="i-lucide-chevron-right"></div>
            </div>
            <BLastUpdated />
          </BLink>
          <div
            v-if="enableChangelog"
            :class="[sort === 'desc' ? 'i-lucide-sort-desc' : 'i-lucide-sort-asc', collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100']"
            class="ml-2 cursor-pointer select-none text-foreground text-opacity-60 transition hover:text-primary motion-reduce:transition-none"
            :title="sort === 'desc' ? (changelogObj.sortOptions?.text?.desc ?? 'From new to old') : (changelogObj.sortOptions?.text?.asc ?? 'From old to new')"
            @click="sort = (sort === 'desc' ? 'asc' : 'desc')"
          ></div>
        </div>
        <BEditLink />
      </div>
    </template>
    <div v-if="enableChangelog" class="pt-2">
      <div v-for="commit in sortedCommits" :key="commit.hash" class="flex items-center text-sm leading-10">
        <span class="hidden shrink-0 text-xs text-foreground text-opacity-60 font-mono md:inline">
          <time :datetime="formatDatetime(commit.date_timestamp).isoDatetime">{{ formatDatetime(commit.date_timestamp, { pad: true }).datetime }}</time>
        </span>
        <div class="i-lucide-git-commit-vertical shrink-0 text-foreground text-opacity-60"></div>
        <a :href="commit.hash_url" target="_blank">
          <code>
            {{ commit.hash.slice(0, 4) }}
          </code>
        </a>
        <span class="select-none whitespace-pre"> - </span>
        <span class="truncate">
          {{ commit.message }}
        </span>
        <a v-for="(author, i) in commit.authors" :key="i" class="ml-2 hidden shrink-0 md:inline" :href="author.url" target="_blank" :title="author.name">
          <img class="h-6 w-6 rounded-full" :src="author.avatarUrl" :alt="author.name" />
        </a>
      </div>
    </div>
  </BCollapse>
</template>

<style scoped>
code {
  border-radius: 4px;
  padding: 3px 6px;
  transition:
    color 0.25s,
    background-color 0.5s;

  font-size: var(--b-code-font-size);
  line-height: var(--b-code-line-height);
  color: var(--b-code-color);
  background-color: var(--b-code-bg);
}

a > code {
  color: var(--b-code-link-color);
}

a:hover > code {
  color: var(--b-code-link-hover-color);
}
</style>
