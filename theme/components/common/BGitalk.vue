<script setup lang="ts">
import type { ThemeConfig } from "../../types";
import Gitalk from "gitalk";
import { useData, useRoute } from "vitepress";
import { computed, ref, watchEffect } from "vue";
import "gitalk/dist/gitalk.css";
import "../../styles/components/b-gitalk.css";

export interface GitalkOptions {
  clientID: string;
  clientSecret: string;
  repo: string;
  owner: string;
  admin: string[];
  /**
   * @default 'last'
   */
  pagerDirection?: "last" | "first";
};

const props = defineProps<GitalkOptions>();

/**
 * FNV-1a
 * 产出: 6-7 位 Base36 字符串 (如 "1z8p4q")
 */
function getShortHash(str: string): string {
  let h = 0x811C9DC5; // 32-bit FNV offset basis

  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193); // FNV prime
  }

  // (h >>> 0) 强制转为无符号整数，确保结果总是正数
  return (h >>> 0).toString(36);
}

const { frontmatter } = useData<ThemeConfig>();
const route = useRoute();
// 文档标题
const documentTitle = computed(() => frontmatter.value.title as string);
// 文档路径哈希
const hash = computed(() => getShortHash(route.path));

const commentRef = ref<HTMLDivElement>();

watchEffect(() => {
  if (!commentRef.value) {
    return;
  }
  const gitalk = new Gitalk({
    ...props,
    labels: [],
    pagerDirection: props.pagerDirection || "last",
    id: hash.value,
    title: documentTitle.value,
    body: `[${documentTitle.value}](${location.href})`,
    distractionFreeMode: false,
    flipMoveOptions: {
      appearAnimation: "fade",
      enterAnimation: "fade",
      leaveAnimation: "fade",
    },
  });
  // remove existing comments
  commentRef.value.innerHTML = "";
  gitalk.render(commentRef.value);
});
</script>

<template>
  <div ref="commentRef" class="b-doc-comment">
    <div class="w-full flex justify-center">
      评论加载中 (ง •̀ω•́)ง
    </div>
  </div>
</template>
