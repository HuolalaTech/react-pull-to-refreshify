import { MouseEvent, useEffect, useRef } from "react";
import { disableEventPassiveOptions } from "./event";
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

export function useDrag({
  onDragStart,
  onDragMove,
  onDragEnd,
}: {
  onDragStart?: (event: DragEvent, dragState: DragState) => void;
  onDragMove?: (event: DragEvent, dragState: DragState) => boolean;
  onDragEnd?: (event: DragEvent, dragState: DragState) => void;
}) {
  const ref = useRef<any>(null);
  const onDragStartRef = useLatest(onDragStart);
  const onDragMoveRef = useLatest(onDragMove);
  const onDragEndRef = useLatest(onDragEnd);

  useEffect(() => {
    const dragEl = ref && ref.current;

    if (!dragEl) return;

    let dragState = {
      ...initialDragState,
    };
    let isStart = false;

    const initDragState = () => {
      dragState = {
        ...initialDragState,
      };
    };

    const handleTouchstart = (event: DragEvent) => {
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
    };

    const handleTouchmove = (event: DragEvent) => {
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
    };

    const handleTouchend = (event: DragEvent) => {
      isStart = false;
      onDragEndRef.current?.(event, dragState);
      initDragState();
    };

    // touch events
    dragEl.addEventListener(
      "touchstart",
      handleTouchstart,
      disableEventPassiveOptions()
    );
    dragEl.addEventListener(
      "touchmove",
      handleTouchmove,
      disableEventPassiveOptions()
    );
    dragEl.addEventListener(
      "touchend",
      handleTouchend,
      disableEventPassiveOptions()
    );
    dragEl.addEventListener(
      "touchcancel",
      handleTouchend,
      disableEventPassiveOptions()
    );
    dragEl.addEventListener(
      "mousedown",
      handleTouchstart,
      disableEventPassiveOptions()
    );
    dragEl.addEventListener(
      "mousemove",
      handleTouchmove,
      disableEventPassiveOptions()
    );
    dragEl.addEventListener(
      "mouseup",
      handleTouchend,
      disableEventPassiveOptions()
    );

    return () => {
      dragEl.removeEventListener("touchstart", handleTouchstart);
      dragEl.removeEventListener("touchmove", handleTouchmove);
      dragEl.removeEventListener("touchend", handleTouchend);
      dragEl.removeEventListener("touchcancel", handleTouchend);
      dragEl.removeEventListener("mousedown", handleTouchstart);
      dragEl.removeEventListener("mousemove", handleTouchmove);
      dragEl.removeEventListener("mouseup", handleTouchend);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref };
}
