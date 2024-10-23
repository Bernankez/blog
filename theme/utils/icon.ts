import type { SocialLinkIcon } from "../types";

// @unocss-include
export function getIcon(icon: SocialLinkIcon) {
  switch (icon) {
    case "github":
      return "i-line-md-github-loop";
    case "rss":
      return "i-line-md-rss";
    case "twitter":
      return "i-line-md-twitter";
    case "mastodon":
      return "i-line-md-mastodon";
    case "home":
      return "i-line-md-home";
    default:
      return icon;
  }
}
