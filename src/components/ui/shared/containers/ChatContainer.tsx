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
      } w-full bg-[url("/chatbg.jpg")] bg-no-repeat bg-center bg-cover rounded-tl-lg md:rounded-tl-none rounded-tr-lg `}>
      <div className={`flex flex-col h-full gap-5 ${className ?? ""}`}>{children}</div>
    </div>
  );
}
