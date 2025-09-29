"use client";
import React, { useEffect, useState } from "react";
import ChatContainer from "../../shared/containers/ChatContainer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { enterChat, leaveChat } from "@/store/redusers/chatsReduser";
import {
  canselEdit,
  canselReply,
  incrOffset,
  messageReceived,
  newMessage,
  newReplyMessage,
  updateMessage,
} from "@/store/redusers/messagesReduser";
import { supabase } from "@/lib/supabaseClient";
import Messages from "./messages/Messages";
import { usePathname } from "next/navigation";
import ChatInput from "./ChatInput";
import EmojiButtonComponent from "../../shared/buttons/EmojiButtonComponent";
import ChatHeader from "./ChatHeader";
import { InputModeType } from "@/types/chat";
import { sendNotification } from "@/app/actions";

export default function Chat() {
  const path = usePathname();
  const chatId = path.split("/")[2];
  const [message, setMessage] = useState("");
  const [isToBootom, setIsToBottom] = useState(true);
  const { activeChat, chats } = useAppSelector((state) => state.chats);
  const userId = useAppSelector((state) => state.user.user?.id);
  const { editingMessage, replyMessage, isPinnedModal, pinnedMessages, messages } = useAppSelector(
    (state) => state.messages,
  );
  const dispatch = useAppDispatch();

  const handleNewMessage = async (type: InputModeType) => {
    if (!message.trim() || !userId || !activeChat) return;
    switch (type) {
      case "edit": {
        if (editingMessage && editingMessage.content !== message) {
          await dispatch(updateMessage({ id: editingMessage.id, content: message }));
        }
        dispatch(canselEdit());
        break;
      }
      case "reply": {
        if (replyMessage)
          await dispatch(
            newReplyMessage({
              chat_id: activeChat?.id,
              sender_id: userId,
              content: message,
              id: replyMessage.id,
            }),
          );
        dispatch(canselReply());
        dispatch(incrOffset());
        break;
      }
      default: {
        await dispatch(
          newMessage({ chat_id: activeChat?.id, sender_id: userId, content: message }),
        );
        await sendNotification(
          message,
          activeChat.participants[0].id,
          activeChat.participants[0].username,
          `${process.env.NEXT_PUBLIC_HOST_URL}/chats/${chatId}`,
        );
        dispatch(incrOffset());
        setMessage("");
        break;
      }
    }
  };

  useEffect(() => {
    if (!chatId || !chats) return;
    dispatch(enterChat(chatId));
  }, [chatId, chats]);

  useEffect(() => {
    if (!activeChat?.id) return;

    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${activeChat.id}`,
        },
        (payload) => {
          dispatch(messageReceived(payload.new));
          setIsToBottom(true);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      dispatch(leaveChat());
    };
  }, [activeChat, dispatch]);

  return (
    <ChatContainer
      wrapper={`${activeChat ? "flex" : "hidden"} lg:flex justify-center w-full min-w-0 `}
      className='min-w-0 w-full'>
      <ChatHeader activeChat={activeChat} />
      <Messages
        isPinned={isPinnedModal}
        messages={isPinnedModal ? pinnedMessages.messages : messages}
        userId={userId}
        chatId={activeChat?.id}
        isToBootom={isToBootom}
        setIsToBottom={setIsToBottom}
      />
      {!isPinnedModal && (
        <div className='flex w-full items-center gap-2 max-w-[768px] mx-auto '>
          <ChatInput
            handleNewMessage={handleNewMessage}
            message={message}
            setMessage={setMessage}
          />
          <EmojiButtonComponent
            className='-top-84 -left-70 md:-left-70 lg:-left-50'
            color='#1da1f2'
            setContent={setMessage}
          />
        </div>
      )}
    </ChatContainer>
  );
}
