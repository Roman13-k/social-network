// components/ui/MessagePreview.tsx
import React from "react";
import clsx from "clsx";
import P from "@/components/ui/shared/text/P";

interface MessagePreviewProps {
  title: string;
  content: string;
  className?: string;
}

export default function MessagePreview({ title, content, className }: MessagePreviewProps) {
  return (
    <div
      className={clsx(
        "border-l-3 px-2 py-1 border-accent rounded-md bg-accent/30 flex-1 min-w-0",
        className,
      )}>
      <P size='xs' className='text-accent font-medium'>
        {title}
      </P>
      <P className='truncate' size='xs'>
        {content}
      </P>
    </div>
  );
}
