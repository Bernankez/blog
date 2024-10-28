export interface ThemeConfig {
  logo?: string;
  logoOnHover?: string;
  siteTitle?: string | false;
  socialLinks?: SocialLink[];
  nav?: NavItem[];
  sidebar?: Sidebar;
  toc?: TocOutline | TocOutline["level"] | false;
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

// table of content -----------------------------------------------
export interface TocOutline {
  /**
   * toc 中要显示的标题级别。
   * 单个数字表示只显示该级别的标题。
   * 如果传递的是一个元组，第一个数字是最小级别，第二个数字是最大级别。
   * `'deep'` 与 `[2, 6]` 相同，将显示从 `<h2>` 到 `<h6>` 的所有标题。
   *
   * @default 2
   */
  level?: number | [number, number] | "deep";

  /**
   * 显示在 toc 上的标题。
   *
   * @default 'Table of content'
   */
  label?: string;
}

export interface TocItem {
  element: HTMLHeadElement;
  title: string;
  link: string;
  level: number;
  children?: TocItem[];
}
