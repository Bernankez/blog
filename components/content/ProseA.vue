<template>
  <NuxtLink :to="href" :target="target">
    <slot></slot>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps({
  href: {
    type: String,
    default: "",
  },
  target: {
    type: String as PropType<"_blank" | "_parent" | "_self" | "_top" | (string & {}) | null>,
    default: "_blank",
  },
});

const target = computed(() => props.href.includes("://") ? props.target : "_self");
</script>

<style lang="ts" scoped>
css({
  a: {
    fontFamily: '{typography.font.body}',
    fontWeight: '{prose.a.fontWeight}',
    textDecoration: '{prose.a.textDecoration}',
    borderBottomWidth: '{prose.a.border.width}',
    borderBottomStyle: '{prose.a.border.style.static}',
    borderBottomColor: '{prose.a.border.color.static}',
    paddingBottom: '{prose.a.border.distance}',
    color: '{prose.a.color.static}',
    '&:hover': {
      color: '{prose.a.color.hover}',
      borderColor: '{prose.a.border.color.hover}',
      borderStyle: '{prose.a.border.style.hover}',
    },
    '&:has(img)': {
      borderWidth: '0'
    },
    '&:has(code)': {
      borderBottom: '{prose.a.hasCode.borderBottom}',
      ':deep(code)': {
        color: '{prose.a.code.color.static}',
        borderWidth: '{prose.a.code.border.width}',
        borderStyle: '{prose.a.code.border.style}',
        borderColor: '{prose.a.code.border.color.static}',
      },
      '&:hover': {
        borderBottom: '{prose.a.hasCode.borderBottom}',
        ':deep(code)': {
          color: '{prose.a.code.color.hover}',
          borderColor: '{prose.a.code.border.color.hover}',
          backgroundColor: '{prose.a.code.background.hover}',
        },
      },
    },
  },
})
</style>
