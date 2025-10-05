"use client";
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react";
import Message from "./Message";
import P from "@/components/ui/shared/text/P";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearMessages, loadMessages, loadPinMessages } from "@/store/redusers/messagesReduser";
import MessageSkeleton from "@/components/ui/shared/skeletons/MessageSkeleton";
import { messageDateFormat } from "@/utils/dates/messageDateFormat";
import { MessageInterface } from "@/interfaces/message";
import RenderOrError from "@/components/ui/layout/RenderOrError";
import Image from "next/image";

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
  const activeChat = useAppSelector((state) => state.chats.activeChat);
  const { offset, loading, error, pinOffset } = useAppSelector((state) => state.messages);

  const dispatch = useAppDispatch();
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isToBootom || !isPinned) bottomRef.current?.scrollIntoView();
  }, [messages, isToBootom, isPinned]);

  useEffect(() => {
    if (chatId) {
      if (isPinned) {
        if (pinOffset !== null && !loading && !error) {
          dispatch(loadPinMessages({ chatId, offset: pinOffset }));
          setIsToBottom(true);
        }
      } else {
        if (offset !== null && !loading && !error) {
          dispatch(loadMessages({ offset, chatId }));
          setIsToBottom(true);
        }
      }
    }

    return () => {
      dispatch(clearMessages());
    };
  }, [chatId, isPinned]);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el || !chatId) return;

    const handleScroll = () => {
      setIsToBottom(false);

      if (el.scrollTop < 100) {
        if (isPinned) {
          if (pinOffset !== null && !loading && !error) {
            const prevHeight = el.scrollHeight;
            const prevScrollTop = el.scrollTop;

            dispatch(loadPinMessages({ chatId, offset: pinOffset }))
              .unwrap()
              .then((newMessages) => {
                if (newMessages?.messages?.length > 0) {
                  const newHeight = el.scrollHeight;
                  el.scrollTop = newHeight - prevHeight + prevScrollTop;
                }
              });
          }
        } else {
          if (offset !== null && !loading && !error) {
            const prevHeight = el.scrollHeight;
            const prevScrollTop = el.scrollTop;

            dispatch(loadMessages({ offset, chatId }))
              .unwrap()
              .then((newMessages) => {
                if (newMessages.length > 0) {
                  const newHeight = el.scrollHeight;
                  el.scrollTop = newHeight - prevHeight + prevScrollTop;
                }
              });
          }
        }
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [chatId, isPinned, offset, loading, error, pinOffset]);

  const messagesList = useMemo(() => {
    let lastDate = "";
    return (
      <ul className='flex flex-col items-center gap-2 py-5 max-w-[768px] w-full mx-auto min-w-0'>
        {messages.map((message, index) => {
          const messageDate = messageDateFormat(message.created_at);
          const showHeader = messageDate !== lastDate;
          if (showHeader) lastDate = messageDate;

          let showFooter = false;
          if (activeChat && activeChat?.participants?.length > 1) {
            const nextMessage = messages[index + 1];
            showFooter =
              message.sender_id !== userId &&
              (!nextMessage || nextMessage.sender_id !== message.sender_id);
          }

          return (
            <React.Fragment key={message.id}>
              {showHeader && (
                <li className='bg-gray-100 rounded-full px-2 py-1'>
                  <P variant={"secondary"} size={"xs"}>
                    {messageDate}
                  </P>
                </li>
              )}
              <li
                className={`${
                  message.sender_id === userId ? "self-end " : "self-start"
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

  return (
    <div
      ref={messagesRef}
      className='h-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 px-3 md:px-6 lg:px-8'>
      <RenderOrError error={error}>
        {messagesList}
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
