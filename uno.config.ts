import { defineConfig, presetIcons, presetTypography, presetUno, transformerDirectives } from "unocss";
import presetShadcn from "./preset.shadcn";

export default defineConfig({
  presets: [presetUno(), presetTypography(), presetIcons({
    scale: 1.2,
  }), presetShadcn()],
  transformers: [transformerDirectives()],
  theme: {
    duration: {
      DEFAULT: "var(--b-transition-duration)",
    },
    animation: {
      timingFns: {
        DEFAULT: "var(--b-transition-timing-function)",
      },
    },
  },
});
