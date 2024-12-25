import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import type { EnhanceAppContext } from "vitepress";
import theme from "../../theme";
import "virtual:group-icons.css";
import "@shikijs/vitepress-twoslash/style.css";
import "./shiki-twoslash.css";

export default {
  extends: theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue as any);
  },
};
