export default defineAppConfig({
  docus: {
    title: "科科Cole",
    description: "Cole.blog",
    url: "https://blog.keke.cc",
    layout: "default",
    // TODO social card preview
    // image: "https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2db-5e65c785bf88.png",
    socials: {
      "github": undefined,
      "github-custom": {
        label: "Bernankez",
        icon: "line-md:github-loop",
        href: "https://github.com/Bernankez/blog",
      },
      "keke.cc": {
        label: "keke.cc",
        icon: "line-md:home-md",
        href: "https://keke.cc",
      },
    },
    aside: {
      level: 1,
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
