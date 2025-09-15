import React, { useRef, forwardRef } from "react";

interface DivWithLongTouchProps extends React.HTMLAttributes<HTMLDivElement> {
  onLongTouch?: (e: React.TouchEvent<HTMLDivElement>) => void;
  delay?: number;
}

const DivWithLongTouch = forwardRef<HTMLDivElement, DivWithLongTouchProps>(
  ({ onLongTouch, delay = 500, ...props }, ref) => {
    const holdTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      holdTimeout.current = setTimeout(() => {
        if (onLongTouch) onLongTouch(e);
      }, delay);
    };

    const handleTouchEnd = () => {
      if (holdTimeout.current) {
        clearTimeout(holdTimeout.current);
        holdTimeout.current = null;
      }
    };

    const handleTouchMove = () => {
      if (holdTimeout.current) {
        clearTimeout(holdTimeout.current);
        holdTimeout.current = null;
      }
    };

    return (
      <div
        {...props}
        ref={ref}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      />
    );
  },
);

DivWithLongTouch.displayName = "DivWithLongTouch";

export default DivWithLongTouch;
