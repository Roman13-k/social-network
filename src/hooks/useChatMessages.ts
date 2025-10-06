"use client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  canselEdit,
  canselReply,
  incrOffset,
  newMessage,
  newReplyMessage,
  updateMessage,
} from "@/store/redusers/messagesReduser";
import { sendNotification } from "@/app/actions";
import { InputModeType } from "@/types/chat";

export function useChatMessages(chatId?: string) {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const { activeChat } = useAppSelector((s) => s.chats);
  const { editingMessage, replyMessage } = useAppSelector((s) => s.messages);
  const userId = useAppSelector((s) => s.user.user?.id);

  const handleNewMessage = async (type: InputModeType) => {
    if (!message.trim() || !userId || !activeChat) return;

    switch (type) {
      case "edit":
        if (editingMessage && editingMessage.content !== message)
          await dispatch(updateMessage({ id: editingMessage.id, content: message }));
        dispatch(canselEdit());
        break;

      case "reply":
        if (replyMessage)
          await dispatch(
            newReplyMessage({
              chat_id: activeChat.id,
              sender_id: userId,
              content: message,
              id: replyMessage.id,
            }),
          );
        dispatch(canselReply());
        dispatch(incrOffset());
        break;

      default:
        setMessage("");
        await dispatch(newMessage({ chat_id: activeChat.id, sender_id: userId, content: message }));
        await sendNotification(
          message,
          activeChat.participants[0].id,
          activeChat.participants[0].username,
          `${process.env.NEXT_PUBLIC_HOST_URL}/chats/${chatId}`,
        );
        dispatch(incrOffset());
        break;
    }
  };

  return { message, setMessage, handleNewMessage };
}
