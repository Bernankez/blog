import bernankez from "@bernankez/eslint-config";

export default bernankez({
  formatters: {
    html: true,
    css: true,
    xml: true,
    svg: false,
    graphql: true,
    markdown: "dprint",
  },
  unocss: true,
  vue: true,
  markdown: false,
});
