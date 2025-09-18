"use client";
import React, { PropsWithChildren } from "react";

export default function ChatContainer({
  children,
  className,
  wrapper,
}: PropsWithChildren<{ className?: string; wrapper?: string }>) {
  return (
    <div
      className={`${
        wrapper ?? ""
      }bg-[url("/chatbg.jpg")] bg-no-repeat bg-center bg-cover  w-full rounded-tl-lg md:rounded-tl-none rounded-tr-lg `}>
      <div className={`flex flex-col h-full ${className ?? ""}`}>{children}</div>
    </div>
  );
}
