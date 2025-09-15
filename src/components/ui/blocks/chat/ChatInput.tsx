import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { validateNumberOfChars } from "@/utils/validate/validateNumberOfChars";
import { useAppSelector } from "@/store/hooks";
import InputEditWindow from "./InputEditWindow";

interface ChatInputProps {
  handleNewMessage: (isEdit: boolean) => void;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
}

export default function ChatInput({ handleNewMessage, message, setMessage }: ChatInputProps) {
  const [error, setError] = useState(false);
  const { editingMessage } = useAppSelector((state) => state.messages);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(!validateNumberOfChars(e.target.value));
    setMessage(e.target.value);
  };

  useEffect(() => {
    if (editingMessage) setMessage(editingMessage.content);
  }, [editingMessage]);

  return (
    <div className='flex flex-col w-full'>
      {editingMessage && (
        <InputEditWindow setMessage={setMessage} editingMessage={editingMessage} />
      )}
      <div className='relative w-full'>
        <input
          value={message}
          onChange={(e) => handleOnChange(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !error) {
              e.preventDefault();
              handleNewMessage(!!editingMessage);
            }
          }}
          className='w-full md:py-3 py-1.5 px-2 pr-12 border-3 border-accent rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Send a message...'
        />
        <button
          disabled={error}
          onClick={() => handleNewMessage(!!editingMessage)}
          type='button'
          className='absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-accent/90 cursor-pointer disabled:pointer-events-none'>
          <Send className={error ? "opacity-70" : ""} size={35} />
        </button>
      </div>
      <span className={`${error ? "text-red-500" : "text-text-secondary"} text-sm ml-auto`}>
        {message.length + "/500"}
      </span>
    </div>
  );
}
