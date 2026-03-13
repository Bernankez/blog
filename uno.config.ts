import { globSync, readFileSync } from "node:fs";
import { parseYAML } from "confbox";
import { defineConfig, presetIcons, presetTypography, presetWind3, transformerDirectives } from "unocss";
import presetShadcn from "./preset.shadcn";

export default defineConfig({
  safelist: [...getDirIcons(), "i-lucide-folder"],
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

function getDirIcons() {
  const files = globSync("content/**/_dir.{yml,yaml}");
  return files.flatMap((file) => {
    const content = readFileSync(file, "utf-8");
    const config = parseYAML<{ icon?: string }>(content);
    return config?.icon ? [config.icon] : [];
  });
}
