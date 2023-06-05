/**
 * get element scroll top
 */
export const getScrollTop = (ele: Element | Window): number => {
  if (ele === document.documentElement) {
    return (document.scrollingElement || document.documentElement).scrollTop;
  }
  if (ele === window) {
    return Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
  }
  return (ele as Element).scrollTop;
};
