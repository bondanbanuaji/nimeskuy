"use client";

import { useRef, useCallback, useState, useEffect } from "react";

export function useDragScroll() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDragged = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    isDown.current = true;
    hasDragged.current = false;
    setIsDragging(true);
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const el = ref.current;
    if (!el) return;
    isDown.current = true;
    hasDragged.current = false;
    setIsDragging(true);
    startX.current = e.touches[0].pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
  }, []);

  const onMouseLeave = useCallback(() => {
    isDown.current = false;
    setIsDragging(false);
    const el = ref.current;
    if (el) {
      el.style.cursor = "grab";
      el.style.removeProperty("user-select");
    }
  }, []);

  const onMouseUp = useCallback(() => {
    isDown.current = false;
    setIsDragging(false);
    const el = ref.current;
    if (el) {
      el.style.cursor = "grab";
      el.style.removeProperty("user-select");
    }
    setTimeout(() => {
      hasDragged.current = false;
    }, 0);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown.current || !el) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = x - startX.current;
      if (Math.abs(walk) > 5) hasDragged.current = true;
      el.scrollLeft = scrollLeft.current - walk;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDown.current || !el) return;
      const x = e.touches[0].pageX - el.offsetLeft;
      const walk = x - startX.current;
      if (Math.abs(walk) > 5) hasDragged.current = true;
      el.scrollLeft = scrollLeft.current - walk;
    };

    const handleClickCapture = (e: MouseEvent) => {
      if (hasDragged.current) {
        e.preventDefault();
        e.stopPropagation();
        hasDragged.current = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false } as AddEventListenerOptions);
    window.addEventListener("touchend", onMouseUp);
    el.addEventListener("click", handleClickCapture as unknown as EventListener, true);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", onMouseUp);
      el.removeEventListener("click", handleClickCapture as unknown as EventListener, true);
    };
  }, [onMouseUp]);

  return { ref, onMouseDown, onTouchStart, onMouseLeave, onMouseUp, isDragging };
}
