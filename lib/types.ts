import type { CSSProperties, ReactNode } from "react";

export type PullStatus =
  | "normal"
  | "pulling"
  | "canRelease"
  | "refreshing"
  | "complete";

export interface PullToRefreshifyProps {
  className?: string;
  style?: CSSProperties;
  /**
   * Whether to display the refreshing status
   */
  refreshing?: boolean;
  // Handler function when refresh triggered
  onRefresh: () => void;
  /**
   * The time for the delay to disappear after completion, the unit is ms
   */
  completeDelay?: number;
  /**
   * The time for animation duration, the unit is ms
   */
  animationDuration?: number;
  /**
   * The height of the head prompt content area, the unit is px
   */
  headHeight?: number;
  /**
   * How far to start the pulling status, unit is px
   */
  startDistance?: number;
  /**
   * How far to pull down to trigger refresh, unit is px
   */
  threshold?: number;
  /**
   * Whether the PullToRefresh is disabled
   */
  disabled?: boolean;
  /**
   * Customize the pulling content according to the pulling status
   */
  renderText: (status: PullStatus, percent: number) => React.ReactNode;
  /**
   * prefix class
   */
  prefixCls?: string;
  children?: ReactNode;
}
