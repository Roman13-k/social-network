"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import P from "@/components/ui/shared/text/P";
import Message from "./Message";
import { MessageInterface } from "@/interfaces/message";
import { messageDateFormat } from "@/utils/dates/messageDateFormat";
import { useAppSelector } from "@/store/hooks";

interface MessagesListProps {
  messages: MessageInterface[];
  userId: string | undefined;
  messagesRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessagesList({ messages, userId, messagesRef }: MessagesListProps) {
  const activeChat = useAppSelector((s) => s.chats.activeChat);

  return useMemo(() => {
    let lastDate = "";
    return (
      <ul className='flex flex-col items-center gap-2 py-5 max-w-[768px] w-full mx-auto min-w-0'>
        {messages.map((message, index) => {
          const messageDate = messageDateFormat(message.created_at);
          const showHeader = messageDate !== lastDate;
          if (showHeader) lastDate = messageDate;

          let showFooter = false;
          if (activeChat && activeChat?.participants?.length > 1) {
            const next = messages[index + 1];
            showFooter =
              message.sender_id !== userId && (!next || next.sender_id !== message.sender_id);
          }

          return (
            <React.Fragment key={message.id}>
              {showHeader && (
                <li className='bg-gray-100 rounded-full px-2 py-1'>
                  <P variant='secondary' size='xs'>
                    {messageDate}
                  </P>
                </li>
              )}

              <li
                className={`${
                  message.sender_id === userId ? "self-end" : "self-start"
                } flex gap-2 w-full relative max-w-[85%]`}>
                {showFooter && (
                  <Image
                    className='rounded-full self-end absolute top-1/2 left-[-50px]'
                    src={activeChat?.participants[0].avatar_url ?? "/default-avatar.png"}
                    alt='avatar'
                    width={40}
                    height={40}
                  />
                )}
                <Message messagesRef={messagesRef} message={message} />
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    );
  }, [messages]);
}
