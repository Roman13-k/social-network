"use client";
import dynamic from "next/dynamic";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Smile } from "lucide-react";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false },
);

interface EmojiButtonProps {
  setContent: Dispatch<SetStateAction<string>>;
  className?: string;
  color?: string;
}

function EmojiButtonComponent({ setContent, className = "", color = "#aab8c2" }: EmojiButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className='relative shrink-0'>
      <button onClick={() => setOpen((prev) => !prev)} className='cursor-pointer'>
        <Smile color={color} />
      </button>
      <Picker
        previewConfig={{ showPreview: false }}
        style={{ position: "absolute" }}
        className={`${className} z-60`}
        height={300}
        width={280}
        open={open}
        lazyLoadEmojis
        onEmojiClick={(emoji) => setContent((prev) => prev + emoji.emoji)}
      />
    </div>
  );
}

export default React.memo(EmojiButtonComponent);
