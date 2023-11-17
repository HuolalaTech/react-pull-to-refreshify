import { useEffect, useRef } from "react";
import { getScrollTop } from "./getScrollTop";
import { Events } from "./events";

const getScrollParent = (node: Element) => {
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
};

export const useScrollParent = () => {
  const pullRef = useRef<any>();
  const touchstartYRef = useRef(0);
  const scrollParentRef = useRef<ReturnType<typeof getScrollParent>>(window);
  const unbindScrollParentEvents = useRef(() => {});

  const bindScrollParentEvents = (
    scrollParent: ReturnType<typeof getScrollParent>
  ) => {
    touchstartYRef.current = 0;

    const handleTouchstart = ((event: TouchEvent) => {
      const touch = event.touches[0];
      touchstartYRef.current = touch.pageY;
    }) as EventListener;

    const handleTouchmove = ((event: TouchEvent) => {
      const touch = event.touches[0];
      const currentY = touch.pageY;
      if (
        currentY - touchstartYRef.current > 0 &&
        event.cancelable &&
        getScrollTop(scrollParent) === 0 &&
        pullRef.current?.contains(event.target)
      ) {
        event.preventDefault();
      }
    }) as EventListener;

    const handleTouchend = (() => {
      touchstartYRef.current = 0;
    }) as EventListener;

    Events.on(scrollParent, "touchstart", handleTouchstart);
    Events.on(scrollParent, "touchmove", handleTouchmove);
    Events.on(scrollParent, "touchend", handleTouchend);
    Events.on(scrollParent, "touchcancel", handleTouchend);

    return () => {
      Events.off(scrollParent, "touchstart", handleTouchstart);
      Events.off(scrollParent, "touchmove", handleTouchmove);
      Events.off(scrollParent, "touchend", handleTouchend);
      Events.off(scrollParent, "touchcancel", handleTouchend);
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const nextScrollParent = getScrollParent(pullRef.current);

    if (nextScrollParent !== scrollParentRef.current) {
      unbindScrollParentEvents.current();
      unbindScrollParentEvents.current =
        bindScrollParentEvents(nextScrollParent);
      scrollParentRef.current = nextScrollParent;
    }
  });

  return [pullRef, scrollParentRef] as const;
};
