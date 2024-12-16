import type { Theme } from "vitepress";
import BBadge from "./components/global/BBadge.vue";
import Layout from "./Layout.vue";
import "virtual:uno.css";
import "@unocss/reset/tailwind-compat.css";
import "./styles/base.css";
import "./styles/var.css";
import "./styles/components/vp-code.css";
import "./styles/components/custom-block.css";
import "./styles/components/vp-code-group.css";

export default {
  Layout,
  enhanceApp: ({ app }) => {
    app.component("Badge", BBadge);
  },
} satisfies Theme;
