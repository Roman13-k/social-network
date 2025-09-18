"use client";
import ModalWithAutoClose from "@/components/ui/shared/containers/ModalWithAutoClose";
import { MessageInterface } from "@/interfaces/message";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React from "react";
import { getMessageActions } from "./getMessagesActions";

interface MessageEditingModalProps {
  onClose: () => void;
  style?: React.CSSProperties | undefined;
  message: MessageInterface;
}

export default function MessageEditingModal({
  onClose,
  style = {},
  message,
}: MessageEditingModalProps) {
  const userId = useAppSelector((state) => state.user.user?.id);
  const dispatch = useAppDispatch();

  const actions = getMessageActions(message, userId, dispatch, onClose);

  return (
    <ModalWithAutoClose
      style={style}
      onCLose={onClose}
      className='absolute py-1 rounded-md bg-gray-500 flex flex-col z-100'>
      {actions.map(({ label, icon, onClick, textColor }) => (
        <button
          key={label}
          onClick={onClick}
          className='bg-gray-500 hover:bg-gray-400 px-5 transition-colors duration-300 cursor-pointer py-1.5 flex items-center gap-2'>
          {icon}
          <span className={`${textColor} text-sm`}>{label}</span>
        </button>
      ))}
    </ModalWithAutoClose>
  );
}
