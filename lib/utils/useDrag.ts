import { MouseEvent, useEffect, useRef } from "react";
import { Events } from "./events";
import { useLatest } from "./useLatest";

export interface DragState {
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

const initialDragState: DragState = {
  startX: 0,
  startY: 0,
  offsetX: 0,
  offsetY: 0,
};

export type DragEvent = MouseEvent | TouchEvent;

function isMouseEvent(e: DragEvent): e is MouseEvent {
  return e && !("touches" in e);
}

export const useDrag = ({
  onDragStart,
  onDragMove,
  onDragEnd,
}: {
  onDragStart?: (event: DragEvent, dragState: DragState) => void;
  onDragMove?: (event: DragEvent, dragState: DragState) => boolean;
  onDragEnd?: (event: DragEvent, dragState: DragState) => void;
}) => {
  const ref = useRef<any>(null);
  const onDragStartRef = useLatest(onDragStart);
  const onDragMoveRef = useLatest(onDragMove);
  const onDragEndRef = useLatest(onDragEnd);

  useEffect(() => {
    const dragEl = ref && ref.current;

    if (!dragEl) return;

    let dragState: DragState;
    let isStart = false;

    const initDragState = () => {
      dragState = {
        ...initialDragState,
      };
    };

    initDragState();

    const handleTouchstart = ((event: DragEvent) => {
      isStart = true;
      initDragState();
      if (isMouseEvent(event)) {
        dragState.startX = event.clientX;
        dragState.startY = event.clientY;
      } else {
        const {
          touches: [touch],
        } = event;
        dragState.startX = touch.pageX;
        dragState.startY = touch.pageY;
      }
      onDragStartRef.current?.(event, dragState);
    }) as EventListener;

    const handleTouchmove = ((event: DragEvent) => {
      if (!isStart) return;

      let currentX = 0;
      let currentY = 0;

      if (isMouseEvent(event)) {
        currentX = event.clientX;
        currentY = event.clientY;
      } else {
        const touch = event.touches[0];
        currentX = touch.pageX;
        currentY = touch.pageY;
      }

      const offsetX = currentX - dragState.startX;
      const offsetY = currentY - dragState.startY;

      const state = {
        ...dragState,
        offsetX,
        offsetY,
      };

      if (onDragMoveRef.current?.(event, state)) {
        dragState = state;
      }
    }) as EventListener;

    const handleTouchend = ((event: DragEvent) => {
      isStart = false;
      onDragEndRef.current?.(event, dragState);
      initDragState();
    }) as EventListener;

    Events.on(dragEl, "touchstart", handleTouchstart);
    Events.on(dragEl, "touchmove", handleTouchmove);
    Events.on(dragEl, "touchend", handleTouchend);
    Events.on(dragEl, "touchcancel", handleTouchend);
    Events.on(dragEl, "mousedown", handleTouchstart);
    Events.on(dragEl, "mousemove", handleTouchmove);
    Events.on(dragEl, "mouseup", handleTouchend);

    return () => {
      Events.off(dragEl, "touchstart", handleTouchstart);
      Events.off(dragEl, "touchmove", handleTouchmove);
      Events.off(dragEl, "touchend", handleTouchend);
      Events.off(dragEl, "touchcancel", handleTouchend);
      Events.off(dragEl, "mousedown", handleTouchstart);
      Events.off(dragEl, "mousemove", handleTouchmove);
      Events.off(dragEl, "mouseup", handleTouchend);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
};
