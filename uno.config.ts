import { defineConfig, presetIcons, presetTypography, presetWind3, transformerDirectives } from "unocss";
import presetShadcn from "./preset.shadcn";

export default defineConfig({
  presets: [presetWind3(), presetTypography(), presetIcons({
    scale: 1.2,
  }), presetShadcn()],
  transformers: [transformerDirectives()],
  theme: {
    duration: {
      DEFAULT: "var(--b-transition-duration)",
    },
    animation: {
      timingFns: {
        DEFAULT: "var(--b-transition-animation)",
      },
    },
  },
});
