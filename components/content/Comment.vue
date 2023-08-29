<template>
  <div ref="commentRef" class="docs-comment">
    <div class="w-full flex justify-center">
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

const commentRef = ref<HTMLDivElement>();
onMounted(() => {
  const gitalk = new Gitalk({
    clientID: "40827213be1939c08aba",
    clientSecret: "40da0008fb88ccd7c81fb004c1292543e66998c9",
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
