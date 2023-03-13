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
});
