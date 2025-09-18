import React from "react";
import P from "@/components/ui/shared/text/P";

interface MessagePreviewProps {
  title: string;
  content: string;
  className?: string;
  color?: string; // hex или css var
}

export default function MessagePreview({
  title,
  content,
  className = "",
  color = "#1da1f2",
}: MessagePreviewProps) {
  return (
    <div
      style={{
        backgroundColor: `${color}4D`,
        borderLeft: `3px solid ${color}`,
      }}
      className={`${className} px-2 py-1 rounded-md flex-1 min-w-0`}>
      <P size='xs' style={{ color, fontWeight: 500 }}>
        {title}
      </P>
      <P className='truncate' size='xs'>
        {content}
      </P>
    </div>
  );
}
