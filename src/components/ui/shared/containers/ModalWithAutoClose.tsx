import React, { useEffect, useRef } from "react";

interface ModalWithAutoCloseProps {
  className?: string;
  onCLose: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties | undefined;
}

export default function ModalWithAutoClose({
  className = "",
  onCLose,
  children,
  style = {},
}: ModalWithAutoCloseProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCLose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={style} ref={modalRef} className={className}>
      {children}
    </div>
  );
}
