"use client";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import MessageSkeleton from "@/components/ui/shared/skeletons/MessageSkeleton";
import { MessageInterface } from "@/interfaces/message";
import RenderOrError from "@/components/ui/layout/RenderOrError";
import MessagesList from "./MessagesList";
import { useMessagesLogic } from "@/hooks/useMessagesLogic";

interface MessagesProps {
  messages: MessageInterface[];
  userId: string | undefined;
  chatId: string | undefined;
  isToBootom: boolean;
  setIsToBottom: Dispatch<SetStateAction<boolean>>;
  isPinned?: boolean;
}

export default function Messages({
  userId,
  chatId,
  isToBootom,
  setIsToBottom,
  messages,
  isPinned = false,
}: MessagesProps) {
  const { loading, error } = useAppSelector((state) => state.messages);
  const { bottomRef, messagesRef } = useMessagesLogic(chatId, isPinned, setIsToBottom);

  useEffect(() => {
    if (isToBootom || !isPinned) bottomRef.current?.scrollIntoView();
  }, [messages, isToBootom, isPinned]);

  return (
    <div
      ref={messagesRef}
      className='h-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 px-3 md:px-6 lg:px-8'>
      <RenderOrError error={error}>
        <MessagesList messages={messages} messagesRef={messagesRef} userId={userId} />
        {loading && messages.length === 0 && (
          <div className='flex flex-col items-start gap-4 max-w-[768px] w-full mx-auto min-w-0'>
            <MessageSkeleton />
            <MessageSkeleton />
          </div>
        )}
        <div ref={bottomRef} className='block'></div>
      </RenderOrError>
    </div>
  );
}
