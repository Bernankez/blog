<script setup lang="ts">
import type { SearchResult } from "minisearch";
import type { Ref } from "vue";
import type { ModalTranslations } from "../../local-search";
import type { ThemeConfig } from "../../types";
import localSearchIndex from "@localSearchIndex";
import { computedAsync, debouncedWatch, onKeyStroke, useEventListener, useLocalStorage, useScrollLock, useSessionStorage } from "@vueuse/core";
import { useFocusTrap } from "@vueuse/integrations/useFocusTrap";
import Mark from "mark.js";
import MiniSearch from "minisearch";
import { dataSymbol, inBrowser, useData, useRouter } from "vitepress";
import { computed, createApp, markRaw, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch, watchEffect } from "vue";
import { escapeRegExp, pathToFile } from "../../utils";
import { LRUCache } from "../../utils/lru";
import { createSearchTranslate } from "../../utils/translation";

const emit = defineEmits<{
  close: [];
}>();

const el = ref<HTMLElement>();
const resultsEl = ref<HTMLElement>();

const searchIndexData = shallowRef(localSearchIndex);

if (import.meta.hot) {
  import.meta.hot.accept("/@localSearchIndex", (m) => {
    if (m) {
      searchIndexData.value = m.default;
    }
  });
}

interface Result {
  title: string;
  titles: string[];
  text?: string;
}

const vitePressData = useData<ThemeConfig>();
const { theme, localeIndex } = vitePressData;
// @see https://github.com/vueuse/vueuse/issues/3240
const { activate } = useFocusTrap(el as any, {
  immediate: true,
  allowOutsideClick: true,
  clickOutsideDeactivates: true,
  escapeDeactivates: true,
});
const searchIndex = computedAsync(async () =>
  markRaw(
    MiniSearch.loadJSON<Result>(
      (await searchIndexData.value[localeIndex.value]?.())?.default,
      {
        fields: ["title", "titles", "text"],
        storeFields: ["title", "titles"],
        searchOptions: {
          fuzzy: 0.2,
          prefix: true,
          boost: { title: 4, text: 2, titles: 1 },
          ...(theme.value.search?.options?.miniSearch?.searchOptions),
        },
        ...(theme.value.search?.options?.miniSearch?.options),
      },
    ),
  ),
);

const disableQueryPersistence = computed(() => theme.value.search?.options?.disableQueryPersistence === true);

const filterText = disableQueryPersistence.value ? ref("") : useSessionStorage("vitepress:local-search-filter", "");

const showDetailedList = useLocalStorage(
  "vitepress:local-search-search-detailed-list",
  theme.value.search?.options?.detailedView === true,
);

const disableDetailedView = computed(() => theme.value.search?.options?.detailedView === false);

const buttonText = computed(() => {
  const options = theme.value.search?.options;

  return (
    options?.locales?.[localeIndex.value]?.translations?.button?.buttonText
    || options?.translations?.button?.buttonText
    || "Search"
  );
});

watchEffect(() => {
  if (disableDetailedView.value) {
    showDetailedList.value = false;
  }
});

const results: Ref<(SearchResult & Result)[]> = shallowRef([]);

const enableNoResults = ref(false);

watch(filterText, () => {
  enableNoResults.value = false;
});

const mark = computedAsync(async () => {
  if (!resultsEl.value) {
    return;
  }
  return markRaw(new Mark(resultsEl.value));
}, null);

const cache = new LRUCache<string, Map<string, string>>(16); // 16 files

debouncedWatch(
  () => [searchIndex.value, filterText.value, showDetailedList.value] as const,
  async ([index, filterTextValue, showDetailedListValue], old, onCleanup) => {
    if (old?.[0] !== index) {
      // in case of hmr
      cache.clear();
    }

    let canceled = false;
    onCleanup(() => {
      canceled = true;
    });

    if (!index) {
      return;
    }

    // Search
    results.value = index.search(filterTextValue).slice(0, 16) as (SearchResult & Result)[];
    enableNoResults.value = true;

    // Highlighting
    const mods = showDetailedListValue ? await Promise.all(results.value.map(r => fetchExcerpt(r.id))) : [];
    if (canceled) {
      return;
    }
    for (const { id, mod } of mods) {
      const mapId = id.slice(0, id.indexOf("#"));
      let map = cache.get(mapId);
      if (map) {
        continue;
      }
      map = new Map();
      cache.set(mapId, map);
      const comp = mod.default ?? mod;
      if (comp?.render || comp?.setup) {
        const app = createApp(comp);
        // Silence warnings about missing components
        app.config.warnHandler = () => {};
        app.provide(dataSymbol, vitePressData);
        Object.defineProperties(app.config.globalProperties, {
          $frontmatter: {
            get() {
              return vitePressData.frontmatter.value;
            },
          },
          $params: {
            get() {
              return vitePressData.page.value.params;
            },
          },
        });
        const div = document.createElement("div");
        app.mount(div);
        const headings = div.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headings.forEach((el) => {
          const href = el.querySelector("a")?.getAttribute("href");
          const anchor = href?.startsWith("#") && href.slice(1);
          if (!anchor) {
            return;
          }
          let html = "";
          // eslint-disable-next-line no-cond-assign
          while ((el = el.nextElementSibling!) && !/^h[1-6]$/i.test(el.tagName)) {
            html += el.outerHTML;
          }
          map!.set(anchor, html);
        });
        app.unmount();
      }
      if (canceled) {
        return;
      }
    }

    const terms = new Set<string>();

    results.value = results.value.map((r) => {
      const [id, anchor] = r.id.split("#");
      const map = cache.get(id);
      const text = map?.get(anchor) ?? "";
      for (const term in r.match) {
        terms.add(term);
      }
      return { ...r, text };
    });

    await nextTick();
    if (canceled) {
      return;
    }

    await new Promise((r) => {
      mark.value?.unmark({
        done: () => {
          mark.value?.markRegExp(formMarkRegex(terms), { done: r });
        },
      });
    });

    const excerpts = el.value?.querySelectorAll(".result .excerpt") ?? [];
    for (const excerpt of excerpts) {
      excerpt
        .querySelector("mark[data-markjs=\"true\"]")
        ?.scrollIntoView({ block: "center" });
    }
    // FIXME: without this whole page scrolls to the bottom
    resultsEl.value?.firstElementChild?.scrollIntoView({ block: "start" });
  },
  { debounce: 200, immediate: true },
);

async function fetchExcerpt(id: string) {
  const file = pathToFile(id.slice(0, id.indexOf("#")));
  try {
    if (!file) {
      throw new Error(`Cannot find file for id: ${id}`);
    }
    return { id, mod: await import(/* @vite-ignore */ file) };
  }
  catch (e) {
    console.error(e);
    return { id, mod: {} };
  }
}

/* Search input focus */

const searchInput = ref<HTMLInputElement>();
const disableReset = computed(() => {
  return filterText.value?.length <= 0;
});
function focusSearchInput(select = true) {
  searchInput.value?.focus();
  if (select) {
    searchInput.value?.select();
  }
}

onMounted(() => {
  focusSearchInput();
});

function onSearchBarClick(event: PointerEvent) {
  if (event.pointerType === "mouse") {
    focusSearchInput();
  }
}

/* Search keyboard selection */

const selectedIndex = ref(-1);
const disableMouseOver = ref(true);

watch(results, (r) => {
  selectedIndex.value = r.length ? 0 : -1;
  scrollToSelectedResult();
});

function scrollToSelectedResult() {
  nextTick(() => {
    const selectedEl = document.querySelector(".result.selected");
    selectedEl?.scrollIntoView({ block: "nearest" });
  });
}

onKeyStroke("ArrowUp", (event) => {
  event.preventDefault();
  selectedIndex.value--;
  if (selectedIndex.value < 0) {
    selectedIndex.value = results.value.length - 1;
  }
  disableMouseOver.value = true;
  scrollToSelectedResult();
});

onKeyStroke("ArrowDown", (event) => {
  event.preventDefault();
  selectedIndex.value++;
  if (selectedIndex.value >= results.value.length) {
    selectedIndex.value = 0;
  }
  disableMouseOver.value = true;
  scrollToSelectedResult();
});

const router = useRouter();

onKeyStroke("Enter", (e) => {
  if (e.isComposing) {
    return;
  }

  if (e.target instanceof HTMLButtonElement && e.target.type !== "submit") {
    return;
  }

  const selectedPackage = results.value[selectedIndex.value];
  if (e.target instanceof HTMLInputElement && !selectedPackage) {
    e.preventDefault();
    return;
  }

  if (selectedPackage) {
    router.go(selectedPackage.id);
    emit("close");
  }
});

onKeyStroke("Escape", () => {
  emit("close");
});

// Translations
const defaultTranslations: { modal: ModalTranslations } = {
  modal: {
    displayDetails: "Display detailed list",
    resetButtonTitle: "Reset search",
    backButtonTitle: "Close search",
    noResultsText: "No results for",
    footer: {
      selectText: "to select",
      selectKeyAriaLabel: "enter",
      navigateText: "to navigate",
      navigateUpKeyAriaLabel: "up arrow",
      navigateDownKeyAriaLabel: "down arrow",
      closeText: "to close",
      closeKeyAriaLabel: "escape",
    },
  },
};

const translate = createSearchTranslate(defaultTranslations);

// Back

onMounted(() => {
  // Prevents going to previous site
  window.history.pushState(null, "", null);
});

useEventListener("popstate", (event) => {
  event.preventDefault();
  emit("close");
});

/** Lock body */
const isLocked = useScrollLock(inBrowser ? document.body : null);

onMounted(() => {
  nextTick(() => {
    isLocked.value = true;
    nextTick().then(() => activate());
  });
});

onBeforeUnmount(() => {
  isLocked.value = false;
});

function resetSearch() {
  filterText.value = "";
  nextTick().then(() => focusSearchInput(false));
}

function formMarkRegex(terms: Set<string>) {
  return new RegExp(
    [...terms]
      .sort((a, b) => b.length - a.length)
      .map(term => `(${escapeRegExp(term)})`)
      .join("|"),
    "gi",
  );
}

function onMouseMove(e: MouseEvent) {
  if (!disableMouseOver.value) {
    return;
  }
  const el = (e.target as HTMLElement)?.closest<HTMLAnchorElement>(".result");
  // eslint-disable-next-line ts/no-non-null-asserted-optional-chain
  const index = Number.parseInt(el?.dataset.index!);
  if (index >= 0 && index !== selectedIndex.value) {
    selectedIndex.value = index;
  }
  disableMouseOver.value = false;
}
</script>

<template>
  <Teleport to="body">
    <div
      ref="el"
      role="button"
      :aria-owns="results?.length ? 'localsearch-list' : undefined"
      aria-expanded="true"
      aria-haspopup="listbox"
      aria-labelledby="localsearch-label"
      class="b-local-search-box"
    >
      <div class="backdrop" @click="$emit('close')"></div>

      <div class="shell">
        <form
          class="search-bar"
          @pointerup="onSearchBarClick($event)"
          @submit.prevent=""
        >
          <label
            id="localsearch-label"
            :title="buttonText"
            for="localsearch-input"
          >
            <div class="search-icon local-search-icon i-line-md-search"></div>
            <!-- <span aria-hidden="true" class="vpi-search search-icon local-search-icon"></span> -->
          </label>
          <div class="search-actions before">
            <button
              class="back-button"
              :title="translate('modal.backButtonTitle')"
              @click="$emit('close')"
            >
              <div class="local-search-icon i-line-md-chevron-left"></div>
            </button>
          </div>
          <input
            id="localsearch-input"
            ref="searchInput"
            v-model="filterText"
            :aria-activedescendant="selectedIndex > -1 ? (`localsearch-item-${selectedIndex}`) : undefined"
            aria-autocomplete="both"
            :aria-controls="results?.length ? 'localsearch-list' : undefined"
            aria-labelledby="localsearch-label"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            class="search-input"
            enterkeyhint="go"
            maxlength="64"
            :placeholder="buttonText"
            spellcheck="false"
          />
          <div class="search-actions">
            <button
              class="clear-button"
              type="reset"
              :disabled="disableReset"
              :title="translate('modal.resetButtonTitle')"
              @click="resetSearch"
            >
              <div class="local-search-icon i-lucide-x"></div>
            </button>
            <button
              v-if="!disableDetailedView"
              class="toggle-layout-button"
              type="button"
              :class="{ 'detailed-list': showDetailedList }"
              :title="translate('modal.displayDetails')"
              @click="
                selectedIndex > -1 && (showDetailedList = !showDetailedList)
              "
            >
              <div class="local-search-icon i-lucide-layout-list"></div>
            </button>
          </div>
        </form>

        <ul
          :id="results?.length ? 'localsearch-list' : undefined"
          ref="resultsEl"
          :role="results?.length ? 'listbox' : undefined"
          :aria-labelledby="results?.length ? 'localsearch-label' : undefined"
          class="results"
          @mousemove="onMouseMove"
        >
          <li
            v-for="(p, index) in results"
            :id="`localsearch-item-${index}`"
            :key="p.id"
            :aria-selected="selectedIndex === index ? 'true' : 'false'"
            role="option"
          >
            <a
              :href="p.id"
              class="result"
              :class="{
                selected: selectedIndex === index,
              }"
              :aria-label="[...p.titles, p.title].join(' > ')"
              :data-index="index"
              @mouseenter="!disableMouseOver && (selectedIndex = index)"
              @focusin="selectedIndex = index"
              @click="$emit('close')"
            >
              <div>
                <div class="titles">
                  <span class="title-icon">#</span>
                  <span
                    v-for="(t, i) in p.titles"
                    :key="i"
                    class="title"
                  >
                    <span class="text" v-html="t"></span>
                    <div class="i-lucide-chevron-right text-sm"></div>
                  </span>
                  <span class="title main">
                    <span class="text" v-html="p.title"></span>
                  </span>
                </div>

                <div v-if="showDetailedList" class="excerpt-wrapper">
                  <div v-if="p.text" class="excerpt" inert>
                    <div class="b-doc" v-html="p.text"></div>
                  </div>
                  <div class="excerpt-gradient-bottom"></div>
                  <div class="excerpt-gradient-top"></div>
                </div>
              </div>
            </a>
          </li>
          <li
            v-if="filterText && !results.length && enableNoResults"
            class="no-results"
          >
            {{ translate('modal.noResultsText') }} "<strong>{{ filterText }}</strong>"
          </li>
        </ul>

        <div class="search-keyboard-shortcuts">
          <span>
            <kbd :aria-label="translate('modal.footer.navigateUpKeyAriaLabel')">
              <div class="navigate-icon i-lucide-arrow-up"></div>
            </kbd>
            <kbd :aria-label="translate('modal.footer.navigateDownKeyAriaLabel')">
              <div class="navigate-icon i-lucide-arrow-down"></div>
            </kbd>
            {{ translate('modal.footer.navigateText') }}
          </span>
          <span>
            <kbd :aria-label="translate('modal.footer.selectKeyAriaLabel')">
              <div class="navigate-icon i-lucide-corner-down-left"></div>
            </kbd>
            {{ translate('modal.footer.selectText') }}
          </span>
          <span>
            <kbd :aria-label="translate('modal.footer.closeKeyAriaLabel')">esc</kbd>
            {{ translate('modal.footer.closeText') }}
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@import "../../styles/components/b-local-search-box.css";

.b-local-search-box .title-icon {
  display: none;
}

.b-local-search-box .result.selected .excerpt-gradient-top {
  background: linear-gradient(var(--b-local-search-result-selected-bg), transparent) !important;
}

.b-local-search-box .result.selected .excerpt-gradient-bottom {
  background: linear-gradient(transparent, var(--b-local-search-result-selected-bg)) !important;
}
</style>
