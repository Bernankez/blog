import { defineConfig, presetIcons, presetTypography, presetUno, transformerDirectives } from "unocss";
import presetShadcn from "./preset.shadcn";

export default defineConfig({
  presets: [presetUno(), presetTypography(), presetIcons(), presetShadcn()],
  transformers: [transformerDirectives()],
});
