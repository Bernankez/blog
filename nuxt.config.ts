/// <reference types="@unocss/nuxt" />
/// <reference types="@nuxtjs/algolia" />
/// <reference types="vite/client" />
import { defineNuxtConfig } from "nuxt/config";
import { transformerDirectives } from "unocss";
import { color } from "./utils";

export default defineNuxtConfig({
  extends: "@nuxt-themes/docus",
  app: {
    head: {
      htmlAttrs: {
        lang: "zh-CN",
      },
    },
  },
  modules: ["@unocss/nuxt", "@nuxtjs/algolia"],
  unocss: {
    uno: true,
    icons: true,
    transformers: [transformerDirectives()],
    // refer https://github.com/unocss/unocss/discussions/1947
    extraContent: {
      filesystem: ["./content/**/*.md"],
    },
    theme: {
      colors: {
        nuxtGray: {
          50: "var(--color-gray-50)",
          900: "var(--color-gray-900)",
          400: "var(--color-gray-400)",
        },
        primary: color.primary,
      },
      fontFamily: {
        "nuxt-sans": "var(--font-sans)",
      },
      fontSize: {
        "nuxt-xl": "var(--fontSize-xl)",
      },
    },
  },
  algolia: {
    apiKey: "f3c4b78009a6ed7d455512effbadf33a",
    applicationId: "4U4R8B36SX",
    docSearch: {
      indexName: "keke",
    },
  },
});
