"use client";
import ModalWithAutoClose from "@/components/ui/shared/containers/ModalWithAutoClose";
import { MessageInterface } from "@/interfaces/message";
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
  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    onClose();
  };

  const handleEdit = () => {};

  const handleDelete = () => {};

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
      <button
        onClick={handleEdit}
        className='bg-gray-600 hover:bg-gray-400 px-6  transition-colors duration-300 cursor-pointer py-2 flex items-center gap-2'>
        <Pencil />
        <span className='text-white text-sm'>Edit</span>
      </button>
      <button
        onClick={handleDelete}
        className='bg-gray-600 hover:bg-gray-400 px-6  transition-colors duration-300 cursor-pointer py-2 flex items-center gap-2'>
        <Trash2 color='#ff0000' />
        <span className='text-red-500 text-sm'>Delete</span>
      </button>
    </ModalWithAutoClose>
  );
}
