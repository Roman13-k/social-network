"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { validateNumberOfChars } from "@/utils/validate/validateNumberOfChars";
import { useAppSelector } from "@/store/hooks";
import InputHeader from "./InputHeader";
import { InputModeType } from "@/types/chat";
import EmojiButtonComponent from "@/components/ui/shared/buttons/EmojiButtonComponent";
import VoiceButton from "@/components/ui/shared/buttons/VoiceButton";
import useStopwatch from "@/hooks/useStopwatch";

interface ChatInputProps {
  handleNewMessage: (type: InputModeType) => void;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
}

export default function ChatInput({ handleNewMessage, message, setMessage }: ChatInputProps) {
  const { isActive, setIsActive, time } = useStopwatch();
  const [error, setError] = useState(false);
  const { editingMessage, replyMessage } = useAppSelector((state) => state.messages);
  const [activeMode, setActiveMode] = useState<InputModeType>(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(!validateNumberOfChars(e.target.value));
    setMessage(e.target.value);
  };

  useEffect(() => {
    if (editingMessage && editingMessage.content && !replyMessage) {
      setActiveMode("edit");
      setMessage(editingMessage.content);
    } else if (replyMessage && !editingMessage) {
      setActiveMode("reply");
    } else if (!editingMessage && !replyMessage) {
      setMessage("");
      setActiveMode(null);
    }
  }, [editingMessage, replyMessage]);

  const currentMessage = activeMode === "edit" ? editingMessage : replyMessage;

  return (
    <div className='flex w-full items-center gap-2 max-w-[768px] mx-auto '>
      <div className='flex flex-col w-full pt-1.5'>
        {currentMessage && (
          <InputHeader message={currentMessage} type={activeMode === "edit" ? "edit" : "reply"} />
        )}
        <div className='relative w-full'>
          <input
            readOnly={isActive}
            value={message}
            onChange={(e) => handleOnChange(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !error) {
                e.preventDefault();
                handleNewMessage(activeMode);
              }
            }}
            className='w-full md:py-3 py-1.5 px-2 pr-12 border-3 placeholder:text-text-primary text-text-primary border-accent rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder={!isActive ? "Send a message..." : ""}
          />
          {message.length === 0 ? (
            <VoiceButton
              isActive={isActive}
              setIsActive={setIsActive}
              time={time}
              className='absolute right-3 top-1/2 -translate-y-1/2'
            />
          ) : (
            <button
              disabled={error}
              onClick={() => handleNewMessage(activeMode)}
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-accent/90 cursor-pointer disabled:pointer-events-none'>
              <Send className={error ? "opacity-70" : ""} size={35} />
            </button>
          )}
        </div>
        <span className={`${error ? "text-red-500" : "text-text-secondary"} text-sm ml-auto`}>
          {message.length + "/500"}
        </span>
      </div>
      <EmojiButtonComponent
        className='-top-84 -left-70 md:-left-70 lg:-left-50'
        color='#1da1f2'
        setContent={setMessage}
      />
    </div>
  );
}
