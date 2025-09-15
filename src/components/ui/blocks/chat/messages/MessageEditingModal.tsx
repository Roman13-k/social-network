"use client";
import ModalWithAutoClose from "@/components/ui/shared/containers/ModalWithAutoClose";
import { MessageInterface } from "@/interfaces/message";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteMessage, startEdit } from "@/store/redusers/messagesReduser";
import { Copy, Pencil, Trash2 } from "lucide-react";
import React from "react";

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    onClose();
  };

  const handleEdit = () => {
    dispatch(startEdit(message));
    onClose();
  };

  const handleDelete = async () => {
    await dispatch(deleteMessage(message.id));
    onClose();
  };

  return (
    <ModalWithAutoClose
      style={style}
      onCLose={onClose}
      className='absolute py-1 rounded-md bg-gray-600 flex flex-col z-60'>
      <button
        onClick={handleCopy}
        className='bg-gray-600 hover:bg-gray-400 px-6  transition-colors duration-300 cursor-pointer py-2 flex items-center gap-2'>
        <Copy />
        <span className='text-white text-sm'>Copy</span>
      </button>
      {userId === message.sender_id && (
        <button
          onClick={handleEdit}
          className='bg-gray-600 hover:bg-gray-400 px-6  transition-colors duration-300 cursor-pointer py-2 flex items-center gap-2'>
          <Pencil />
          <span className='text-white text-sm'>Edit</span>
        </button>
      )}
      <button
        onClick={handleDelete}
        className='bg-gray-600 hover:bg-gray-400 px-6  transition-colors duration-300 cursor-pointer py-2 flex items-center gap-2'>
        <Trash2 color='#ff0000' />
        <span className='text-red-500 text-sm'>Delete</span>
      </button>
    </ModalWithAutoClose>
  );
}
