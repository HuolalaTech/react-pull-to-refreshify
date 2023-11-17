import { useState } from "react";
import { useScrollParent } from "./utils/useScrollParent";

import { useUnmountedRef } from "./utils/useUnmountedRef";
import { useUpdateEffect } from "./utils/useUpdateEffect";
import { useDrag } from "./utils/useDrag";
import { getScrollTop } from "./utils/getScrollTop";
import type { PullStatus, PullToRefreshifyProps } from "./types";
import { Events } from "./utils/events";

export const PullToRefreshify = ({
  className,
  style,
  animationDuration = 300,
  completeDelay = 500,
  refreshing = false,
  headHeight = 50,
  startDistance = 30,
  resistance = 0.6,
  threshold = headHeight,
  onRefresh,
  disabled = false,
  prefixCls = "pull-to-refreshify",
  renderText,
  children,
}: PullToRefreshifyProps) => {
  const [pullRef, scrollParentRef] = useScrollParent();
  const unmountedRef = useUnmountedRef();
  const [[offsetY, duration, status], setState] = useState<
    [number, number, PullStatus]
  >(
    refreshing
      ? [headHeight, animationDuration, "refreshing"]
      : [0, 0, "normal"]
  );

  const dispatch = (status: PullStatus, dragOffsetY = 0) => {
    switch (status) {
      case "pulling":
      case "canRelease":
        setState([dragOffsetY, 0, status]);
        break;

      case "refreshing":
        setState([headHeight, animationDuration, status]);
        break;

      case "complete":
        setState([headHeight, animationDuration, status]);
        if (unmountedRef.current) return;
        setTimeout(() => {
          dispatch("normal");
        }, completeDelay);
        break;

      default:
        setState([0, animationDuration, status]);
    }
  };

  // Skip the first render
  useUpdateEffect(() => {
    dispatch(refreshing ? "refreshing" : "complete");
  }, [refreshing]);

  // Handle darg events
  const dragRef = useDrag({
    onDragMove: (event, { offsetY: dragOffsetY }) => {
      if (
        // Not set onRefresh event
        !onRefresh ||
        // Pull up
        dragOffsetY <= 0 ||
        // Not scrolled to top
        (dragOffsetY > 0 && getScrollTop(scrollParentRef.current) > 0) ||
        // Refreshing state has been triggered
        ["refreshing", "complete"].includes(status) ||
        disabled
      ) {
        return false;
      }

      // Solve the bug that the low-end Android system only triggers the touchmove event once
      if (!Events.isSupportsPassive()) {
        event.preventDefault();
      }

      const ratio = dragOffsetY / window.screen.height;
      const offset = dragOffsetY * (1 - ratio) * resistance;

      // Determine whether the condition for releasing immediate refresh is met
      const action =
        offset - startDistance < threshold ? "pulling" : "canRelease";

      dispatch(action, offset);
      return true;
    },
    onDragEnd: (_, { offsetY: dragOffsetY }) => {
      // No drag offset
      if (!dragOffsetY) {
        return;
      }

      // When the current state is the pulling state
      if (status === "pulling") {
        dispatch("normal");
        return;
      }

      // Execute the callback that triggers the refresh externally
      if (typeof onRefresh === "function") {
        onRefresh();
      }
    },
  });

  let percent = 0;
  if (offsetY >= startDistance) {
    percent =
      ((offsetY - startDistance < threshold
        ? offsetY - startDistance
        : threshold) *
        100) /
      threshold;
  }

  return (
    <div
      ref={dragRef}
      className={className ? `${prefixCls} ${className}` : prefixCls}
      style={{
        minHeight: headHeight,
        overflowY: "hidden",
        touchAction: "pan-y",
        ...style,
      }}
    >
      <div
        ref={pullRef}
        className={`${prefixCls}__content`}
        style={{
          willChange: "transform",
          WebkitTransition: `all ${duration}ms`,
          transition: `all ${duration}ms`,
          WebkitTransform: `translate3d(0, ${offsetY}px, 0)`,
          transform: `translate3d(0, ${offsetY}px, 0)`,
        }}
      >
        <div
          key={offsetY.toFixed(0)}
          className={`${prefixCls}__refresh`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#909090",
            fontSize: "14px",
            marginTop: -headHeight,
            height: headHeight,
          }}
        >
          {renderText(status, percent)}
        </div>
        <div className={`${prefixCls}__body`}>{children}</div>
      </div>
    </div>
  );
};
