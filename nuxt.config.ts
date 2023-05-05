/// <reference types="@nuxtjs/algolia" />
/// <reference types="vite/client" />

export default defineNuxtConfig({
  extends: "@nuxt-themes/docus",
  app: {
    head: {
      htmlAttrs: {
        lang: "zh-CN",
      },
    },
  },
  modules: ["@unocss/nuxt", "@nuxtjs/algolia"],
  components: [
    {
      // import all the components under ~/components recursively
      path: "~/components",
      pathPrefix: false,
      // register globally, not on demand
      global: true,
    },
  ],
  algolia: {
    apiKey: "f3c4b78009a6ed7d455512effbadf33a",
    applicationId: "4U4R8B36SX",
    docSearch: {
      indexName: "keke",
    },
  },
});
