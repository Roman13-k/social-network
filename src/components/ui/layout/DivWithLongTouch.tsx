import React, { forwardRef, useState } from "react";

interface DivWithLongTouchProps extends React.HTMLAttributes<HTMLDivElement> {
  onLongTouch?: (e: React.TouchEvent<HTMLDivElement>) => void;
  onSwipe?: () => void;
  delay?: number;
}

const DivWithLongTouch = forwardRef<HTMLDivElement, DivWithLongTouchProps>(
  ({ onLongTouch, delay = 400, onSwipe, ...props }, ref) => {
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const threshold = 50;

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("[data-ignore-touch]")) return;
      setStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("[data-ignore-touch]")) return;
      if (translateX > threshold && onSwipe) {
        onSwipe();
        setTranslateX(0);
      } else {
        setTimeout(() => {
          if (onLongTouch) onLongTouch(e);
        }, delay);
      }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
      const deltaX = e.touches[0].clientX - startX;
      if (deltaX > 0) {
        setTranslateX(deltaX);
      }
    };

    return (
      <div
        {...props}
        ref={ref}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        style={{ transform: `translateX(${translateX}px)` }}
      />
    );
  },
);

DivWithLongTouch.displayName = "DivWithLongTouch";

export default DivWithLongTouch;
