"use client";
import React, { useEffect, useState } from "react";
import ChatContainer from "../../../shared/containers/ChatContainer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { enterChat } from "@/store/redusers/chatsReduser";
import Messages from "../messages/Messages";
import { usePathname } from "next/navigation";
import ChatInput from "../input/ChatInput";
import ChatHeader from "./ChatHeader";
import { useMessagesRealtime } from "@/hooks/useMessagesRealtime";
import { useChatMessages } from "@/hooks/useChatMessages";

export default function Chat() {
  const path = usePathname();
  const chatId = path.split("/")[2];
  const [isToBootom, setIsToBottom] = useState(true);
  const { activeChat, chats } = useAppSelector((state) => state.chats);
  const { isPinnedModal, pinnedMessages, messages } = useAppSelector((state) => state.messages);
  const dispatch = useAppDispatch();

  const { message, setMessage, handleNewMessage } = useChatMessages(chatId);
  useMessagesRealtime(setIsToBottom, chatId);

  useEffect(() => {
    if (!chatId || !chats) return;
    dispatch(enterChat(chatId));
  }, [chats, chatId]);

  return (
    <ChatContainer
      wrapper={`${activeChat ? "flex" : "hidden"} lg:flex justify-center w-full min-w-0 `}
      className='min-w-0 w-full'>
      <ChatHeader activeChat={activeChat} />
      <Messages
        isPinned={isPinnedModal}
        messages={isPinnedModal ? pinnedMessages.messages : messages}
        chatId={activeChat?.id}
        isToBootom={isToBootom}
        setIsToBottom={setIsToBottom}
      />
      {!isPinnedModal && (
        <ChatInput handleNewMessage={handleNewMessage} message={message} setMessage={setMessage} />
      )}
    </ChatContainer>
  );
}
