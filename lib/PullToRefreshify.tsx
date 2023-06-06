import { useState } from "react";
import { useScrollParent } from "./utils/useScrollParent";

import type { CSSProperties } from "react";
import { useUnmountedRef } from "./utils/useUnmountedRef";
import { useUpdateEffect } from "./utils/useUpdateEffect";
import { useDrag } from "./utils/useDrag";
import { getScrollTop } from "./utils/getScrollTop";
import { isSupportsPassive } from "./utils/event";
import { PULL_STATUS, PullToRefreshifyProps } from "./types";

export function PullToRefreshify({
  className,
  style,
  animationDuration = 300,
  completeDelay = 500,
  refreshing = false,
  headHeight = 50,
  startDistance = 30,
  threshold = headHeight,
  onRefresh,
  disabled = false,
  prefixCls = "pull-to-refreshify",
  renderText,
  children,
}: PullToRefreshifyProps) {
  const { ref: pullRef, scrollParent } = useScrollParent();
  const unmountedRef = useUnmountedRef();
  const [{ offsetY, duration, pullStatus }, setState] = useState({
    offsetY: 0,
    duration: 0,
    pullStatus: PULL_STATUS.normal,
  });

  const updatePullStatus = (status: PULL_STATUS, dragOffsetY = 0) => {
    switch (status) {
      case PULL_STATUS.pulling:
      case PULL_STATUS.canRelease:
        setState({
          pullStatus: status,
          duration: 0,
          offsetY: dragOffsetY,
        });
        break;

      case PULL_STATUS.refreshing:
        setState({
          pullStatus: status,
          duration: animationDuration,
          offsetY: headHeight,
        });
        break;

      case PULL_STATUS.complete:
        setState({
          pullStatus: status,
          duration: animationDuration,
          offsetY: headHeight,
        });
        if (unmountedRef.current) return;
        setTimeout(() => {
          updatePullStatus(PULL_STATUS.normal);
        }, completeDelay);
        break;

      default:
        setState({
          pullStatus: status,
          duration: animationDuration,
          offsetY: 0,
        });
    }
  };

  // Skip the first render
  useUpdateEffect(() => {
    updatePullStatus(
      refreshing ? PULL_STATUS.refreshing : PULL_STATUS.complete
    );
  }, [refreshing]);

  // Handle darg events
  const { ref: dragRef } = useDrag({
    onDragMove: (event, { offsetY: dragOffsetY }) => {
      if (
        // Not set onRefresh event
        !onRefresh ||
        // Pull up
        dragOffsetY <= 0 ||
        // Not scrolled to top
        (dragOffsetY > 0 && getScrollTop(scrollParent) > 0) ||
        // Refreshing state has been triggered
        pullStatus >= PULL_STATUS.refreshing ||
        disabled
      ) {
        return false;
      }

      // Solve the bug that the low-end Android system only triggers the touchmove event once
      if (!isSupportsPassive()) {
        event.preventDefault();
      }

      const ratio = dragOffsetY / window.screen.height;
      const offset = dragOffsetY * (1 - ratio) * 0.6;

      // Determine whether the condition for releasing immediate refresh is met
      const action =
        offset - startDistance < threshold
          ? PULL_STATUS.pulling
          : PULL_STATUS.canRelease;

      updatePullStatus(action, offset);
      return true;
    },
    onDragEnd: (_, { offsetY: dragOffsetY }) => {
      // No drag offset
      if (!dragOffsetY) {
        return;
      }

      // When the current state is the pulling state
      if (pullStatus === PULL_STATUS.pulling) {
        updatePullStatus(PULL_STATUS.normal);
        return;
      }

      // Execute the callback that triggers the refresh externally
      if (typeof onRefresh === "function") {
        onRefresh();
      }
    },
  });

  const translateY = pullStatus < PULL_STATUS.canRelease ? headHeight : offsetY;
  const transformStyle: CSSProperties = {
    willChange: "transform",
    WebkitTransition: `all ${duration}ms`,
    transition: `all ${duration}ms`,
    WebkitTransform: `translate3d(0, ${translateY}px, 0)`,
    transform: `translate3d(0, ${translateY}px, 0)`,
  };

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
        className={`${prefixCls}__content`}
        style={transformStyle}
        ref={pullRef}
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
          {renderText(pullStatus, percent)}
        </div>
        <div className={`${prefixCls}__body`}>{children}</div>
      </div>
    </div>
  );
}
