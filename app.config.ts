export default defineAppConfig({
  docus: {
    title: "科科Cole",
    titleTemplate: "%s",
    description: "Cole.blog",
    url: "https://blog.keke.cc",
    // TODO social card preview
    // image: "https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png",
    socials: {
      "github": "bernankez",
      "keke.cc": {
        label: "keke.cc",
        icon: "tabler:brand-redhat",
        href: "https://keke.cc",
      },
    },
    aside: {
      level: 0,
      exclude: [],
    },
    header: {
      logo: true,
    },
    footer: {
      credits: false,
    },
    github: {
      dir: "content",
      branch: "master",
      repo: "blog",
      owner: "bernankez",
      edit: true,
    },
  },
});
