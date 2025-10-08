"use client";
import React, { useEffect } from "react";
import { motion } from "motion/react";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClose();
      }}
      className='fixed inset-0 z-70 h-full w-full bg-black/30 flex justify-center items-center'>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25, delay: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className={`bg-background-modal rounded-lg p-5 sm:p-10 flex flex-col justify-center items-center mx-5 gap-3 sm:gap-4 min-w-[300px] ${
          className ?? ""
        }`}>
        {children}
      </motion.div>
    </motion.div>
  );
}
