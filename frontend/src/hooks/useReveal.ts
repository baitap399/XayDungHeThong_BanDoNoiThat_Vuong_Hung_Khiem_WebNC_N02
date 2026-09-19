import { useEffect } from 'react';

const REVEAL_SELECTOR = '.reveal, .reveal-left, .reveal-right';

/**
 * Observes all elements with the `.reveal`, `.reveal-left` or `.reveal-right`
 * classes and adds `.visible` to them once they scroll into view.
 *
 * The CSS for these classes (see styles/user.css) starts elements at
 * opacity: 0 and only shows them once `.visible` is present — this hook is
 * what used to be a plain-JS IntersectionObserver in the original static
 * template, ported over for the React app.
 *
 * Mount this ONCE from a top-level layout (e.g. UserLayout) so it applies to
 * every page. Internally it also watches the DOM with a MutationObserver,
 * so elements that appear later — after a route change, or after an async
 * fetch (e.g. featured products) finishes and renders new cards — are
 * picked up automatically without any page needing to call this itself.
 */
export function useReveal() {
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            intersectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const observe = (node: Element) => {
      if (node.classList.contains('visible')) return;
      const rect = node.getBoundingClientRect();
      // Already in view when it appears (e.g. above the fold) — show
      // immediately instead of waiting for a scroll event that may never
      // fire.
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        node.classList.add('visible');
      } else {
        intersectionObserver.observe(node);
      }
    };

    const scan = (root: ParentNode) => {
      root.querySelectorAll(REVEAL_SELECTOR).forEach(observe);
    };

    // Initial scan (after paint, so freshly-mounted DOM is present).
    const raf = requestAnimationFrame(() => scan(document));

    // Watch for elements added later — route changes, async data (e.g.
    // featured products) rendering new .reveal cards, etc.
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((added) => {
          if (!(added instanceof Element)) return;
          if (added.matches(REVEAL_SELECTOR)) observe(added);
          scan(added);
        });
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
