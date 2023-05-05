import { defineConfig, presetIcons, presetUno, transformerDirectives } from "unocss";
import { color } from "./utils";

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  transformers: [transformerDirectives()],
  // see https://github.com/unocss/unocss/discussions/1947
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
});
