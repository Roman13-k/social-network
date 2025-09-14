"use client";
import RenderContentWithLinks from "@/components/ui/layout/RenderContentWithLinks";
import { MessageInterface } from "@/interfaces/message";
import { chatDateFormat, chatTitleDateFormat } from "@/utils/dates/chatDateFormat";
import React, { useRef, useState } from "react";
import MessageEditingModal from "./MessageEditingModal";
import { getRelativePosition } from "@/utils/getRelativePosition";
import { PositionInterface } from "@/interfaces";

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
    e.preventDefault();
    setIsEditingModal(true);

    setPosition(getRelativePosition(e, messageRef));
  };

  return (
    <div
      ref={messageRef}
      onContextMenu={(e) => handleOpenEditModal(e)}
      onTouchEnd={(e) => handleOpenEditModal(e)}
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
        {chatDateFormat(message.created_at)}
      </span>
      {isEditingModal && (
        <MessageEditingModal
          message={message}
          style={{ top: position.y - 120, left: position.x - 130 }}
          onClose={() => setIsEditingModal(false)}
        />
      )}
    </div>
  );
}
