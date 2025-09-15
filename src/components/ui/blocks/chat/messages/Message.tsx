"use client";
import RenderContentWithLinks from "@/components/ui/layout/RenderContentWithLinks";
import { MessageInterface } from "@/interfaces/message";
import { chatDateFormat, chatTitleDateFormat } from "@/utils/dates/chatDateFormat";
import React, { useRef, useState } from "react";
import MessageEditingModal from "./MessageEditingModal";
import { getRelativePosition } from "@/utils/getRelativePosition";
import { PositionInterface } from "@/interfaces";
import DivWithLongTouch from "@/components/ui/layout/DivWithLongTouch";

interface MessageProps {
  message: MessageInterface;
  userId: string | undefined;
}

export default function Message({ message, userId }: MessageProps) {
  const [isEditingModal, setIsEditingModal] = useState(false);
  const [position, setPosition] = useState<PositionInterface>({ x: 0, y: 0 });
  const messageRef = useRef<HTMLDivElement | null>(null);

  const handleOpenEditModal = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    setPosition(getRelativePosition(e, messageRef));
    setIsEditingModal(true);
  };

  return (
    <DivWithLongTouch
      ref={messageRef}
      onContextMenu={(e) => handleOpenEditModal(e)}
      delay={500}
      onLongTouch={(e) => handleOpenEditModal(e)}
      className={`${
        message.sender_id === userId ? "bg-white ml-auto" : "bg-button/85"
      } py-1.5 md:py-2 md:px-4 px-2.5 rounded-[20px] border border-border flex flex-col max-w-full relative`}>
      <RenderContentWithLinks
        varinant='default'
        className='break-words whitespace-normal'
        content={message.content}
      />

      <span
        className='self-end text-[14px] text-text-secondary'
        title={chatTitleDateFormat(message.created_at)}>
        {message.updated ? "edited " : ""}
        {chatDateFormat(message.created_at)}
      </span>

      {isEditingModal && messageRef.current && (
        <MessageEditingModal
          message={message}
          style={{
            top: position.y - 120,
            left: Math.min(Math.max(position.x - 120, 60), messageRef.current.offsetWidth - 120),
          }}
          onClose={() => setIsEditingModal(false)}
        />
      )}
    </DivWithLongTouch>
  );
}
