import type { UserConfig } from "vite";
import type { _DirConfig, NavItemWithLink, SidebarItem, ThemeConfig } from "../theme/types";
import { randomUUID } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { basename, parse, relative, resolve } from "node:path";
import process from "node:process";
import { GitChangelog } from "@nolebase/vitepress-plugin-git-changelog";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { withPwa } from "@vite-pwa/vitepress";
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
const buildVersion = randomUUID();
export default async ({ mode }: UserConfig) => {
  const env = loadEnv(mode ?? "", process.cwd()) as ImportMetaEnv;
  const navigation = generateNavigation();
  const config = defineConfigWithTheme<ThemeConfig>({
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
    outDir: resolve(".vitepress/dist"),
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
      ...navigation,
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
      languages: ["typescript"],
      image: {
        lazyLoad: true,
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
      define: { __PWA_VERSION__: JSON.stringify(buildVersion) },
      plugins: [
        {
          name: "pwa-version",
          generateBundle() {
            this.emitFile({
              type: "asset",
              fileName: "sw.js",
              source: `importScripts('./sw-runtime.js');\nself.addEventListener('message', e => { if (e.data?.type === 'GET_VERSION') e.ports[0]?.postMessage('${buildVersion}') })`,
            });
          },
        },
        {
          name: "content-navigation",
          configureServer(server) {
            let previous = JSON.stringify(navigation);
            server.watcher.on("all", (event, file) => {
              const [section] = relative(resolve("content"), file).split(/[/\\]/);
              const relevant = event.endsWith("Dir") || file.endsWith(".md") || _DIR_NAME.includes(basename(file));
              if (!sections.includes(section) || !relevant) {
                return;
              }
              try {
                const next = generateNavigation();
                const snapshot = JSON.stringify(next);
                if (previous === snapshot) {
                  return;
                }
                Object.assign(config.themeConfig!, next);
                previous = snapshot;
                // VitePress caches site data; the theme reads nav/sidebar once at setup.
                const mod = server.moduleGraph.getModuleById("/@siteData");
                if (mod) {
                  server.moduleGraph.invalidateModule(mod);
                }
                server.ws.send({ type: "full-reload" });
              }
              catch (error) {
                server.config.logger.error(`Could not refresh navigation: ${error}`);
              }
            });
          },
        },
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
      injectRegister: false,
      filename: "sw-runtime.js",
      generateSW: {
        clientsClaim: true,
        globIgnores: ["**/sw.js", "**/node_modules/**"],
      },
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
            purpose: "any maskable",
          },
        ],
      },
    },
  });
  return withPwa(config);
};

const _DIR_NAME = ["_dir.yaml", "_dir.yml"];
const sections = ["tech", "blog", "stereotyped-writing"];

function generateNavigation() {
  return {
    nav: sections.map(section => generateNavItem(resolve("content", section))),
    sidebar: Object.fromEntries(sections.map((section) => {
      const options = section === "blog" ? undefined : { indentFromLevel: 0, collapsed: false };
      return [`/${section}/`, generateSidebarItem(resolve("content", section), options)?.items ?? []];
    })),
  };
}

interface GenerateSidebarItemOptions extends SidebarItem {
  base?: string;
}

function generateSidebarItem(path: string, options?: GenerateSidebarItemOptions): SidebarItem | undefined {
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
    if (config.sidebar === false) {
      return undefined;
    }
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
  let config: _DirConfig | undefined;
  if (_dir?.isFile()) {
    const _dirFile = readFileSync(resolve(path, _dir.name), "utf-8");
    config = parseYAML<_DirConfig>(_dirFile);
  }
  navItem.text = config?.title ?? pascalCase(directoryName);
  navItem.icon = config?.icon ?? "i-lucide-folder";
  const md = getFirstMdFile(path);
  if (md) {
    navItem.link = `/${directoryName}/${relative(path, md).replaceAll("\\", "/").slice(0, -3)}`;
  }
  return navItem;
}

function getFirstMdFile(path: string): string | undefined {
  // 递归找到目录下第一个md文件
  const files = readdirSync(path, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      const first = getFirstMdFile(resolve(path, file.name));
      if (first) {
        return first;
      }
    }
    else if (file.name.endsWith(".md")) {
      return resolve(path, file.name);
    }
  }
}

function extractName(filename: string) {
  return parse(filename).name;
}

function pascalCase(str: string) {
  return str.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
}
