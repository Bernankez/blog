<template>
  <div ref="commentRef" class="docs-comment">
    <div class=" flex justify-center w-full">
      评论加载中 (ง •̀ω•́)ง
    </div>
  </div>
</template>

<script setup lang="ts">
import Gitalk from "gitalk";
import "gitalk/dist/gitalk.css";
import "@/styles/gitalk-overwrite.css";

const route = useRoute();
const { page } = useContent();
const pageTitle = computed(() => page.value?.title || "");
const title = route.path.split("/")?.pop() || route.path;
const runtimeConfig = useRuntimeConfig();

const commentRef = ref<HTMLDivElement>();
onMounted(() => {
  const gitalk = new Gitalk({
    clientID: runtimeConfig.githubClientID,
    clientSecret: runtimeConfig.githubClientSecret,
    repo: "blog-comment",
    owner: "Bernankez",
    admin: ["Bernankez"],
    id: title,
    labels: ["comment"],
    title,
    body: `${location.href}\n\n${pageTitle.value}`,
    distractionFreeMode: false,
    pagerDirection: "last",
    flipMoveOptions: {
      appearAnimation: "fade",
      enterAnimation: "fade",
      leaveAnimation: "fade",
    },
  });
  gitalk.render(commentRef.value!);
});
</script>

<style lang="scss" scoped>
</style>
