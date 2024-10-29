import vueJsx from "@vitejs/plugin-vue-jsx";
import UnoCSS from "unocss/vite";
import DevTools from "vite-plugin-vue-devtools";
import { defineConfigWithTheme } from "vitepress";
import type { ThemeConfig } from "../theme/types";

// https://vitepress.dev/reference/site-config
export default async () => {
  return defineConfigWithTheme<ThemeConfig>({
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
    // TODO
    ignoreDeadLinks: true,
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      logo: "/logo.webp",
      logoOnHover: "/logo-wink.webp",
      // editLink: {
      //   text: "在GitHub上编辑",
      //   pattern: "https://github.com/bernankez/blog/edit/master/src/:path",
      // },
      // lastUpdated: {
      //   text: "上次更新于",
      //   formatOptions: {
      //     dateStyle: "full",
      //     timeStyle: "medium",
      //   },
      // },
      // search: {
      //   provider: "algolia",
      //   options: {
      //     apiKey: "f3c4b78009a6ed7d455512effbadf33a",
      //     appId: "4U4R8B36SX",
      //     indexName: "keke",
      //   },
      // },
      // docFooter: {
      //   prev: "上一页",
      //   next: "下一页",
      // },
      // darkModeSwitchLabel: "外观",
      // darkModeSwitchTitle: "切换到深色模式",
      // lightModeSwitchTitle: "切换到浅色模式",
      // returnToTopLabel: "回到顶部",
      // externalLinkIcon: true,
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
            { text: "Search", link: "/blog/search" },
            { text: "JS/TS中的AST节点类型示例", link: "/blog/front-end/ts-node" },
          ],
        },
        {
          text: "参考",
          items: [
            { text: "站点配置", link: "/site-config" },
            { text: "frontmatter 配置", link: "/frontmatter-config" },
            { text: "运行时 API", link: "/runtime-api" },
            { text: "CLI", link: "/cli" },
            {
              text: "默认主题",
              base: "/zh/reference/default-theme-",
              items: [
                { text: "概览", link: "config" },
                { text: "导航栏", link: "nav" },
                { text: "侧边栏", link: "sidebar" },
                { text: "主页", link: "home-page" },
                { text: "页脚", link: "footer" },
                { text: "布局", link: "layout" },
                { text: "徽章", link: "badge" },
                { text: "团队页", link: "team-page" },
                { text: "上下页链接", link: "prev-next-links" },
                { text: "编辑链接", link: "edit-link" },
                { text: "最后更新时间戳", link: "last-updated" },
                { text: "搜索", link: "search" },
                { items: [
                  {
                    text: "默认主题",
                    base: "/zh/reference/default-theme-",
                    collapsed: true,
                    items: [
                      { text: "概览", link: "config" },
                      { text: "导航栏", link: "nav" },
                      { text: "侧边栏", link: "sidebar" },
                      { text: "主页", link: "home-page" },
                      { text: "页脚", link: "footer" },
                      { text: "布局", link: "layout" },
                      { text: "徽章", link: "badge" },
                      { text: "团队页", link: "team-page" },
                      { text: "上下页链接", link: "prev-next-links" },
                      { text: "编辑链接", link: "edit-link" },
                      { text: "最后更新时间戳", link: "last-updated" },
                      { text: "搜索", link: "search" },
                      { text: "Carbon Ads", link: "carbon-ads" },
                    ],
                  },
                ] },
              ],
            },
          ],
        },
      ],
      toc: {
        title: "页面导航",
      },

      socialLinks: [
        { icon: "github", link: "https://github.com/Bernankez/blog", ariaLabel: "GitHub" },
      ],
    },
    vite: {
      plugins: [vueJsx(), UnoCSS(), DevTools()],
    },
  });
};

// function generateRoutes() {}
