const topPaddingCSS = `
@media (max-width: 767px) {
  #app > div > header > div > section:nth-child(1) > a {
    display: none;
  }
}

@media (max-width: 1539px) {
  #app > div > header > div > section:nth-child(1) > a > img {
    display: none;
  }
  #app > div > header > div > section:nth-child(1) > a {
    padding-top: 20px;
  }
}
`;

const SCROLL_THRESHOLD = 54;

const scrollCSS = `
@media (max-width: 767px) {
  #app
    > div
    > main
    > div
    > div.w-0.flex-1
    > div.lg\\:hidden.sticky.left-0.right-0.top-0.z-\\[var\\(--b-toc-bar-z-index\\)\\].h-\\[var\\(--b-toc-bar-height\\)\\].b-0.b-b-1.b-border.bg-card.bg-opacity-70.backdrop-blur-8.backdrop-saturate-50.md\\:top-\\[var\\(--b-nav-height\\)\\]
    > div
    > section:nth-child(1)
    > button {
    margin-left: 70px;
  }
}
`;

const isMac = navigator.platform.toUpperCase().includes("MAC");
if (window.pakeConfig?.hide_title_bar && isMac) {
  const topPaddingStyleElement = document.createElement("style");
  topPaddingStyleElement.innerHTML = topPaddingCSS;
  document.head.appendChild(topPaddingStyleElement);

  let scrollStyleElement = null;
  let hasAppliedScrollStyle = false;

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > SCROLL_THRESHOLD && !hasAppliedScrollStyle) {
      if (!scrollStyleElement) {
        scrollStyleElement = document.createElement("style");
        scrollStyleElement.innerHTML = scrollCSS;
        document.head.appendChild(scrollStyleElement);
      }
      hasAppliedScrollStyle = true;
    }
    else if (scrollY <= SCROLL_THRESHOLD && hasAppliedScrollStyle) {
      if (scrollStyleElement) {
        scrollStyleElement.remove();
        scrollStyleElement = null;
      }
      hasAppliedScrollStyle = false;
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  handleScroll();
}
