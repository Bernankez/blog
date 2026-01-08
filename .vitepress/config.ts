import type { UserConfig } from "vite";
import type { _DirConfig, NavItemWithLink, SidebarItem, ThemeConfig } from "../theme/types";
import { readdirSync, readFileSync } from "node:fs";
import { basename, parse, relative, resolve } from "node:path";
import process from "node:process";
import { GitChangelog } from "@nolebase/vitepress-plugin-git-changelog";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { withPwa } from "@vite-pwa/vitepress";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { parseYAML } from "confbox";
import matter from "gray-matter";
import UnoCSS from "unocss/vite";
import Icons from "unplugin-icons/vite";
import DevTools from "vite-plugin-vue-devtools";
import { defineConfigWithTheme, loadEnv } from "vitepress";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";
import lightbox from "vitepress-plugin-lightbox";
import llmstxt, { copyOrDownloadAsMarkdownButtons } from "vitepress-plugin-llms";
import { RssPlugin } from "vitepress-plugin-rss";

// https://vitepress.dev/reference/site-config
export default async ({ mode }: UserConfig) => {
  const env = loadEnv(mode ?? "", process.cwd()) as ImportMetaEnv;
  return withPwa(defineConfigWithTheme<ThemeConfig>({
    lang: "zh-CN",
    title: "科科Cole",
    titleTemplate: ":title · 科科Cole",
    description: "Cole.blog",
    head: [
      ["link", { rel: "icon", href: "/favicon.ico" }],
      /**
       * polyfill
       * @see https://devhints.io/polyfill.io
       */
      ["script", { src: "https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?version=4.8.0&features=default%2Cdom4%2Ces2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019%2Ces2020%2Ces2021%2Ces2022%2Ces2023%2Ces5%2Ces6%2Ces7" }],
    ],
    sitemap: {
      hostname: "https://blog.keke.cc",
    },
    srcDir: "content",
    cleanUrls: true,
    lastUpdated: true,
    ignoreDeadLinks: true,
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      logo: "/logo.webp",
      logoOnHover: "/logo-wink.webp",
      socialLinks: [
        { icon: "rss", link: "/feed.xml", ariaLabel: "RSS", title: "RSS", target: "_self" },
        { icon: "github", link: "https://github.com/Bernankez/blog", ariaLabel: "GitHub", title: "GitHub" },
        { icon: "home", link: "https://keke.cc", ariaLabel: "Home", title: "Home" },
      ],
      nav: [
        generateNavItem(resolve(process.cwd(), "content", "tech")),
        generateNavItem(resolve(process.cwd(), "content", "blog")),
        generateNavItem(resolve(process.cwd(), "content", "stereotyped-writing")),
      ],
      sidebar: {
        "/tech/": [
          ...generateSidebarItem(resolve(process.cwd(), "content", "tech"), {
            indentFromLevel: 0,
          }).items!,
        ],
        "/blog/": [
          ...generateSidebarItem(resolve(process.cwd(), "content", "blog")).items!,
        ],
        "/stereotyped-writing/": [
          ...generateSidebarItem(resolve(process.cwd(), "content", "stereotyped-writing"), {
            indentFromLevel: 0,
            collapsed: false,
          }).items!,
        ],
      },
      toc: {
        title: "页面导航",
      },
      notFound: {
        homeButton: "返回首页",
        lifeGame: {
          play: "播放",
          pause: "暂停",
          prevStep: "上一步",
          nextStep: "下一步",
          reset: "重置",
        },
      },
      comment: {
        gitalk: {
          clientID: env.VITE_GH_CLIENT_ID,
          clientSecret: env.VITE_GH_CLIENT_SECRET,
          repo: "blog-comment",
          owner: "Bernankez",
          admin: ["Bernankez"],
        },
      },
      docFooter: {
        prev: "上一页",
        next: "下一页",
      },
      editLink: {
        text: "在GitHub上编辑",
        pattern: "https://github.com/bernankez/blog/edit/master/content/:path",
      },
      lastUpdated: {
        text: "上次更新于",
        formatOptions: {
          dateStyle: "full",
          timeStyle: "medium",
        },
      },
      changelog: {
        sortOptions: {
          text: {
            desc: "从新到旧",
            asc: "从旧到新",
          },
        },
        formatOptions: {
          dateStyle: "short",
          timeStyle: "short",
        },
      },
      search: {
        provider: "local",
        options: {
          locales: {
            root: {
              translations: {
                button: {
                  buttonText: "搜索文档",
                  buttonAriaLabel: "搜索文档",
                },
                modal: {
                  searchResultTitle: "搜索结果",
                  askAiPlaceholder: "没找到答案？试试问AI",
                  displayDetails: "显示预览",
                  resetButtonTitle: "清空",
                  backButtonTitle: "返回",
                  footer: {
                    selectText: "选择",
                    navigateText: "切换",
                    closeText: "关闭",
                  },
                  noResultsText: "无法找到相关结果",
                },
              },
            },
          },
        },
      },
      // search: {
      //   provider: "algolia",
      //   options: {
      //     apiKey: env.VITE_ALGOLIA_API_KEY,
      //     appId: env.VITE_ALGOLIA_APP_ID,
      //     indexName: env.VITE_ALGOLIA_INDEX_NAME,
      //   },
      // },
    },
    markdown: {
      image: {
        lazyLoading: true,
      },
      codeTransformers: [
        transformerTwoslash() as any,
      ],
      config(md) {
        md.use(groupIconMdPlugin);
        md.use(lightbox);
        md.use(md => copyOrDownloadAsMarkdownButtons(md, "MarkdownButtons"));
      },
    },
    vite: {
      plugins: [
        vueJsx(),
        UnoCSS(),
        Icons({
          scale: 1.2,
        }),
        groupIconVitePlugin(),
        RssPlugin({
          title: "科科Cole",
          description: "Knows nothing, likes sleeping.",
          baseUrl: "https://blog.keke.cc",
          copyright: "Copyright ©️ 2023-PRESENT 科科Cole",
          image: "https://blog.keke.cc/avatar.webp",
          favicon: "https://blog.keke.cc/favicon.ico",
          // NEVER enable icon. Since the theme is custom, this option can cause style issues.
          icon: false,
          language: "zh-CN",
          author: {
            name: "科科Cole",
            email: "bernankeic@gmail.com",
            link: "https://blog.keke.cc",
          },
          filename: "feed.xml",
          ignoreHome: true,
          ignorePublish: false,
        }),
        GitChangelog({
          repoURL: () => "https://github.com/Bernankez/blog",
        }),
        llmstxt(),
        DevTools(),
      ],
    },
    pwa: {
      registerType: "prompt",
      experimental: {
        includeAllowlist: true,
      },
      manifest: {
        id: "/",
        name: "科科的Blog",
        short_name: "Blog",
        description: "科科Cole's blog",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    },
  }));
};

const _DIR_NAME = ["_dir.yaml", "_dir.yml"];

interface GenerateSidebarItemOptions extends SidebarItem {
  base?: string;
}

function generateSidebarItem(path: string, options?: GenerateSidebarItemOptions): SidebarItem {
  const { base = "", ...restOptions } = options || {};
  const files = readdirSync(path, { withFileTypes: true });
  const sortedFiles = files
    .filter((file) => {
      if (file.isDirectory()) {
        return true;
      }
      if (_DIR_NAME.includes(file.name)) {
        return true;
      }
      const ext = parse(file.name).ext;
      return ext === ".md";
    })
    .toSorted((a, b) => a.name.localeCompare(b.name));

  const sidebarItem: SidebarItem = {
    ...restOptions,
  };

  const directoryName = basename(path);
  const _dir = files.find(file => file.name === "_dir.yml" || file.name === "_dir.yaml");
  if (_dir?.isFile()) {
    const _dirFile = readFileSync(resolve(path, _dir.name), "utf-8");
    const config = parseYAML<_DirConfig>(_dirFile);
    sidebarItem.text = config.title;
  }
  else {
    sidebarItem.text = pascalCase(directoryName);
  }

  sidebarItem.items = sortedFiles.map((file) => {
    if (file.isDirectory()) {
      return generateSidebarItem(resolve(path, file.name), {
        base: `${base ? `${base}/${directoryName}` : `/${directoryName}`}`,
        ...restOptions,
      });
    }
    if (_DIR_NAME.includes(file.name)) {
      return undefined;
    }
    const fileContent = readFileSync(resolve(path, file.name), "utf-8");
    const { data = {} } = matter(fileContent);
    return {
      text: data.title || pascalCase(extractName(file.name)),
      link: `${base ? `${base}/${directoryName}` : `/${directoryName}`}/${extractName(file.name)}`,
    };
  }).filter(item => item !== undefined);

  return sidebarItem;
}

function generateNavItem(path: string) {
  const navItem: NavItemWithLink = {} as NavItemWithLink;
  const directoryName = basename(path);
  navItem.activeMatch = `/${directoryName}/`;
  const files = readdirSync(path, { withFileTypes: true });
  const _dir = files.find(file => file.name === "_dir.yml" || file.name === "_dir.yaml");
  if (_dir?.isFile()) {
    const _dirFile = readFileSync(resolve(path, _dir.name), "utf-8");
    const config = parseYAML<_DirConfig>(_dirFile);
    navItem.text = config.title;
  }
  else {
    navItem.text = pascalCase(directoryName);
  }
  const md = getFirstMdFile(path);
  if (md) {
    navItem.link = `/${directoryName}/${relative(path, md.path)}/${extractName(md.filename)}`;
  }
  return navItem;
}

function getFirstMdFile(path: string) {
  // 递归找到目录下第一个md文件
  const files = readdirSync(path, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      return getFirstMdFile(resolve(path, file.name));
    }
    if (file.name === "_dir.yml" || file.name === "_dir.yaml") {
      continue;
    }
    if (file.name.endsWith(".md")) {
      return {
        path,
        filename: file.name,
      };
    }
  }
}

function extractName(filename: string) {
  return parse(filename).name;
}

function pascalCase(str: string) {
  return str.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
}
