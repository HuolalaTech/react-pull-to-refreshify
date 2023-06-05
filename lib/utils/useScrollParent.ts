import { useEffect, useRef, useState } from "react";
import { getScrollTop } from "./getScrollTop";
import { disableEventPassiveOptions } from "./event";

function getScrollParent(node: Element) {
  while (node && node.parentNode && node.parentNode !== document.body) {
    const computedStyle = window.getComputedStyle(node);
    if (
      // The value of `overflow/overflowY` is scroll/auto
      (["scroll", "auto"].indexOf(computedStyle.overflowY) > -1 ||
        ["scroll", "auto"].indexOf(computedStyle.overflow) > -1) &&
      // The value of `height/max-height` grather than 0  `
      (parseInt(computedStyle.height, 10) > 0 ||
        parseInt(computedStyle.maxHeight, 10) > 0)
    ) {
      return node;
    }
    node = node.parentNode as Element;
  }

  return window;
}

export function useScrollParent() {
  const ref = useRef<any>();
  const [scrollParent, setScrollParent] =
    useState<ReturnType<typeof getScrollParent>>(window);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setScrollParent(getScrollParent(ref.current));
  });

  // Handle the scroll parent's touch events
  useEffect(() => {
    let touchstartY = 0;

    const handleTouchstart = (event: any) => {
      const touch = event.touches[0];
      touchstartY = touch.pageY;
    };
    const handleTouchmove = (event: any) => {
      const touch = event.touches[0];
      const currentY = touch.pageY;
      if (
        currentY - touchstartY > 0 &&
        event.cancelable &&
        getScrollTop(scrollParent) === 0 &&
        ref.current?.contains(event.target)
      ) {
        event.preventDefault();
      }
    };
    const handleTouchend = () => {
      touchstartY = 0;
    };

    scrollParent.addEventListener(
      "touchstart",
      handleTouchstart,
      disableEventPassiveOptions()
    );
    scrollParent.addEventListener(
      "touchmove",
      handleTouchmove,
      disableEventPassiveOptions()
    );
    scrollParent.addEventListener(
      "touchend",
      handleTouchend,
      disableEventPassiveOptions()
    );
    scrollParent.addEventListener(
      "touchcancel",
      handleTouchend,
      disableEventPassiveOptions()
    );

    return () => {
      scrollParent.removeEventListener("touchstart", handleTouchstart);
      scrollParent.removeEventListener("touchmove", handleTouchmove);
      scrollParent.removeEventListener("touchend", handleTouchend);
      scrollParent.removeEventListener("touchcancel", handleTouchend);
    };
  }, [scrollParent]);

  return { ref, scrollParent };
}
