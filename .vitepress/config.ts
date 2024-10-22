import UnoCSS from "unocss/vite";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default async () => {
  return defineConfig({
    lang: "zh-CN",
    title: "科科Cole",
    titleTemplate: ":title · 科科Cole",
    description: "Cole.blog",
    head: [
      ["link", { rel: "icon", href: "/favicon.ico" }],
    ],
    srcDir: "src",
    cleanUrls: true,
    lastUpdated: true,
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      logo: "/logo.webp",
      editLink: {
        text: "在GitHub上编辑",
        pattern: "https://github.com/bernankez/blog/edit/master/src/:path",
      },
      lastUpdated: {
        text: "上次更新于",
        formatOptions: {
          dateStyle: "full",
          timeStyle: "medium",
        },
      },
      search: {
        provider: "algolia",
        options: {
          apiKey: "f3c4b78009a6ed7d455512effbadf33a",
          appId: "4U4R8B36SX",
          indexName: "keke",
        },
      },
      docFooter: {
        prev: "上一页",
        next: "下一页",
      },
      darkModeSwitchLabel: "外观",
      darkModeSwitchTitle: "切换到深色模式",
      lightModeSwitchTitle: "切换到浅色模式",
      returnToTopLabel: "回到顶部",
      externalLinkIcon: true,
      nav: [
        { text: "Blog", link: "/blog/tricks", activeMatch: "/blog/" },
        { text: "八股文", link: "/stereotyped-writing", activeMatch: "/stereotyped-writing/" },
      ],

      sidebar: [
        {
          text: "Blog",
          items: [
            { text: "小技巧", link: "/blog/tricks" },
            { text: "TS重载类型推断", link: "/blog/front-end/ts-inferring-type" },
          ],
        },
      ],

      socialLinks: [
        { icon: "github", link: "https://github.com/Bernankez/blog" },
      ],
    },
    vite: {
      plugins: [UnoCSS()],
    },
  });
};

// function generateRoutes() {}
