import type { Theme } from "vitepress";
import BBadge from "./components/global/BBadge.vue";
import BCodePreview from "./components/global/BCodePreview.vue";
import BCollapse from "./components/global/BCollapse.vue";
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
    app.component("CodePreview", BCodePreview);
    app.component("Collapse", BCollapse);
  },
} satisfies Theme;
