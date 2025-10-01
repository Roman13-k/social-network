import { MessageInterface } from "@/interfaces/message";
import React from "react";
import { Pencil, Reply, X } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { canselEdit, canselReply } from "@/store/redusers/messagesReduser";
import { InputModeType } from "@/types/chat";
import MessagePreview from "../messages/MessagePreview";

interface InputHeaderProps {
  message: MessageInterface;
  type: Exclude<InputModeType, null>;
}

export default function InputHeader({ message, type }: InputHeaderProps) {
  const dispatch = useAppDispatch();

  return (
    <div className='flex items-center md:gap-5 gap-3 px-2 md:px-5 py-1 bg-white rounded-t-md max-w-[768px]'>
      {type === "edit" ? (
        <Pencil color='#1da1f2' className='shrink-0' />
      ) : (
        <Reply color='#1da1f2' className='shrink-0' />
      )}

      <MessagePreview
        content={message.content}
        title={type === "edit" ? "Edit Message" : "Reply Message"}
      />

      <button
        className='cursor-pointer shrink-0'
        onClick={() => {
          dispatch(type === "edit" ? canselEdit() : canselReply());
        }}>
        <X color='#1da1f2' />
      </button>
    </div>
  );
}
