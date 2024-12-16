<script setup lang="ts">
import Gitalk from "gitalk";
import { useData, useRoute } from "vitepress";
import { computed, onMounted, ref } from "vue";
import type { ThemeConfig } from "../../types";
import "gitalk/dist/gitalk.css";
import "../../styles/components/b-gitalk.css";

export interface GitalkOptions {
  clientID: string;
  clientSecret: string;
  repo: string;
  owner: string;
  admin: string[];
  /**
   * @default ['comment']
   */
  labels?: string[];
  /**
   * @default 'last'
   */
  pagerDirection?: "last" | "first";
};

const props = defineProps<GitalkOptions>();

const { frontmatter } = useData<ThemeConfig>();
const route = useRoute();
const pageTitle = computed(() => frontmatter.value.title as string);
const documentPath = computed(() => route.path.split("/").pop() || route.path);

const commentRef = ref<HTMLDivElement>();

onMounted(() => {
  const gitalk = new Gitalk({
    ...props,
    labels: props.labels || ["comment"],
    pagerDirection: props.pagerDirection || "last",
    id: documentPath.value,
    title: documentPath.value,
    body: `${location.href}\n\n${pageTitle.value}`,
    distractionFreeMode: false,
    flipMoveOptions: {
      appearAnimation: "fade",
      enterAnimation: "fade",
      leaveAnimation: "fade",
    },
  });

  gitalk.render(commentRef.value!);
});
</script>

<template>
  <div ref="commentRef" class="b-doc-comment">
    <div class="w-full flex justify-center">
      评论加载中 (ง •̀ω•́)ง
    </div>
  </div>
</template>

<style scoped>
.b-doc-comment {
}
</style>
