<template>
  <div class="group relative m-t-3">
    <pre class="code-pre">
      <code v-html="code"></code>
    </pre>
    <CopyButton class="copy-button" :content="props.code" />
  </div>
</template>

<script setup lang="ts">
type Highlight = string | RegExp;

const props = defineProps<{
  code?: string;
  highlight?: Highlight | Highlight[];
}>();

const code = computed(() => {
  if (!props.code) { return ""; }
  if (!props.highlight) { return props.code; }
  let code = htmlEscape(props.code);
  if (Array.isArray(props.highlight)) {
    [...new Set(props.highlight)].forEach((hl) => {
      if (hl) {
        code = highlightReplace(hl, code);
      }
    });
    return code;
  }
  return highlightReplace(props.highlight, code);
});

function highlightReplace(highlight: Highlight, code: string) {
  let _highlight: RegExp;
  if (highlight instanceof RegExp) {
    _highlight = highlight;
  } else {
    const escapedHighlight = htmlEscape(highlight.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"));
    _highlight = new RegExp(escapedHighlight, "g");
  }
  return code.replace(_highlight, "<span class='bg-yellow dark:text-gray-800'>$&</span>");
}

function htmlEscape(html: string) {
  return html.replace(/[<>]/g, (c) => {
    return { "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] || c;
  });
}
</script>

<style scoped>
pre {
  all: unset;
}

.code-pre {
  @apply block p-3 text-4.5 bg-gray-100 dark-bg-dark-800 b-solid b-1 b-gray-200 dark-b-dark-300 rounded-2 whitespace-pre-line;
}

.copy-button {
  inset-inline-end: 0.25rem;
  @apply absolute bottom-1 bg-transparent backdrop-blur-4 scale-75 opacity-0 group-hover-scale-100 group-hover-opacity-100 transition-all transition-duration-100;
}
</style>
