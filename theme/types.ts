export interface ThemeConfig {
  logo?: string;
  logoOnHover?: string;
  siteTitle?: string | false;
  socialLinks?: SocialLink[];
  nav?: NavItem[];
  sidebar?: Sidebar;
}

export type Layout = "home" | "doc" | "page" | false;

export interface SocialLink {
  icon: SocialLinkIcon;
  link: string;
  ariaLabel?: string;
}

export type SocialLinkIcon = "github"
  | "twitter"
  | "rss"
  | "mastodon"
  | "home"
  | {
    svg: string;
  };

// nav -----------------------------------------------------------------------

export type NavItem = NavItemComponent | NavItemWithLink | NavItemWithChildren;

export interface NavItemComponent {
  component: string;
  props?: Record<string, any>;
}

export interface NavItemWithLink {
  text: string;
  link: string;
  items?: never;

  /**
   * `activeMatch` is expected to be a regex string. We can't use actual
   * RegExp object here because it isn't serializable
   */
  activeMatch?: string;
  rel?: string;
  target?: string;
  noIcon?: boolean;
}

export interface NavItemChildren {
  text?: string;
  items: NavItemWithLink[];
}

export interface NavItemWithChildren {
  text?: string;
  items: (NavItemComponent | NavItemChildren | NavItemWithLink)[];

  /**
   * `activeMatch` is expected to be a regex string. We can't use actual
   * RegExp object here because it isn't serializable
   */
  activeMatch?: string;
}

// sidebar --------------------------------------------------------------

export type Sidebar = SidebarSingle | SidebarMulti;

export interface SidebarObject {
  items: SidebarItem[];
  collapsed?: boolean;
  base?: string;
  indentFromLevel?: number;
}

export type SidebarSingle = SidebarItem[] | SidebarObject;

export interface SidebarMulti {
  [path: string]: SidebarSingle;
};

export interface SidebarItem {
  /**
   * The text label of the item.
   */
  text?: string;

  /**
   * The link of the item.
   */
  link?: string;

  /**
   * The children of the item.
   */
  items?: SidebarItem[];

  /**
   * If not specified, group is not collapsible.
   *
   * If `true`, group is collapsible and collapsed by default
   *
   * If `false`, group is collapsible but expanded by default
   */
  collapsed?: boolean;

  /**
   * Base path for the children items.
   */
  base?: string;

  /**
   * Show indent from which level, defaults to 1
   */
  indentFromLevel?: number;

  /**
   * Customize text that appears on the footer of previous/next page.
   */
  docFooterText?: string;

  rel?: string;
  target?: string;
};
