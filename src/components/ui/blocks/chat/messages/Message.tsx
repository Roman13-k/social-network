"use client";
import RenderContentWithLinks from "@/components/ui/layout/RenderContentWithLinks";
import { MessageInterface } from "@/interfaces/message";
import { chatDateFormat, chatTitleDateFormat } from "@/utils/dates/chatDateFormat";
import React, { RefObject, useEffect, useRef, useState } from "react";
import MessageEditingModal from "./MessageEditingModal";
import { getRelativePosition } from "@/utils/getRelativePosition";
import { PositionInterface } from "@/interfaces";
import DivWithLongTouch from "@/components/ui/layout/DivWithLongTouch";
import MessagePreview from "./MessagePreview";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getUserName } from "@/utils/userGetInfo";
import { getMessageById, startReply } from "@/store/redusers/messagesReduser";
import { Pin } from "lucide-react";
import VoiceMessage from "./VoiceMessage";

interface MessageProps {
  message: MessageInterface;
  messagesRef: RefObject<HTMLDivElement | null>;
}

export default function Message({ message, messagesRef }: MessageProps) {
  const user = useAppSelector((state) => state.user.user);
  const activeChat = useAppSelector((state) => state.chats.activeChat);
  const dispatch = useAppDispatch();
  const [replyMessage, setReplyMessage] = useState({} as MessageInterface);
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

  useEffect(() => {
    async function fetchReply() {
      if (message.reply_to) {
        const data = await dispatch(getMessageById(message.reply_to)).unwrap();
        setReplyMessage(data);
      }
    }
    fetchReply();
  }, []);

  return (
    <DivWithLongTouch
      ref={messageRef}
      onContextMenu={(e) => handleOpenEditModal(e)}
      onSwipe={() => dispatch(startReply(message))}
      onLongTouch={(e) => handleOpenEditModal(e)}
      className={`${
        message.sender_id === user?.id ? "bg-white ml-auto" : "bg-button/85"
      } py-1.5 md:py-2 md:px-4 px-1.5 rounded-[20px] border border-border flex flex-col max-w-full relative`}>
      {replyMessage.id && replyMessage.content && (
        <MessagePreview
          color={message.sender_id === user?.id ? "#1da1f2" : "#9b51e0"}
          title={
            replyMessage.sender_id === user?.id
              ? getUserName(user)
              : activeChat?.participants[0].username ?? "anonim"
          }
          content={replyMessage.content}
        />
      )}
      {message.content && (
        <RenderContentWithLinks
          varinant='default'
          className='break-words whitespace-normal'
          content={message.content}
        />
      )}

      {message.audio_url && (
        <VoiceMessage
          url={message.audio_url}
          color={message.sender_id === user?.id ? "#1da1f2" : "#9b51e0"}
        />
      )}

      <span
        className='self-end text-[14px] text-text-secondary flex items-center'
        title={chatTitleDateFormat(message.created_at)}>
        {message.updated ? "edited " : ""}
        {chatDateFormat(message.created_at)}
        {message.ispinned && <Pin size={16} className='rotate-20' />}
      </span>

      {isEditingModal && messagesRef.current && (
        <MessageEditingModal
          message={message}
          style={{
            top: position.y - 120,
            left:
              message.sender_id === user?.id
                ? Math.max(position.x - 130, -100)
                : Math.min(position.x + 60, messagesRef.current.offsetWidth - 200),
          }}
          onClose={() => setIsEditingModal(false)}
        />
      )}
    </DivWithLongTouch>
  );
}
