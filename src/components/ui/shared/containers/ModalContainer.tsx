"use client";
import React, { useEffect } from "react";

interface ModalContainerProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

export default function ModalContainer({ children, onClose, className }: ModalContainerProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("overflow-hidden");

    return () => root.classList.remove("overflow-hidden");
  }, []);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClose();
      }}
      className='fixed inset-0 z-70 h-full w-full bg-black/30 flex justify-center items-center '>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-background-modal rounded-lg p-5 sm:p-10 flex flex-col justify-center items-center mx-5 gap-3 sm:gap-4 min-w-[300px] ${
          className ?? ""
        } `}>
        {children}
      </div>
    </div>
  );
}
