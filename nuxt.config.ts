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
  runtimeConfig: {
    githubClientID: "40827213be1939c08aba",
    githubClientSecret: "40da0008fb88ccd7c81fb004c1292543e66998c9",
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
