/// <reference types="@unocss/nuxt" />
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
  modules: ["@unocss/nuxt"],
  unocss: {
    uno: true,
    icons: true,
    transformers: [transformerDirectives()],
    theme: {
      colors: {
        nuxtGray: "var(--color-gray-900)",
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
});
