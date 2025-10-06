import { Copy, Pencil, Pin, PinOff, Reply, Trash2 } from "lucide-react";
import { MessageInterface } from "@/interfaces/message";
import {
  deleteMessage,
  pinMessage,
  startEdit,
  startReply,
  unpinMessage,
} from "@/store/redusers/messagesReduser";
import { AppDispatch } from "@/store/store";

interface Action {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
  textColor: string;
}

export const getMessageActions = (
  message: MessageInterface,
  userId: string | undefined,
  chatId: string | undefined,
  dispatch: AppDispatch,
  onClose: () => void,
): Action[] => {
  const handleCopy = async () => {
    if (message.content) await navigator.clipboard.writeText(message.content);
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

  const handleReply = () => {
    dispatch(startReply(message));
    onClose();
  };

  const handlePin = () => {
    dispatch(pinMessage({ chatId, message }));
    onClose();
  };

  const handleUnpin = () => {
    dispatch(unpinMessage({ chatId, messageId: message.id }));
    onClose();
  };

  return [
    {
      label: message.ispinned ? "Unpin" : "Pin",
      icon: message.ispinned ? <PinOff /> : <Pin />,
      onClick: message.ispinned ? handleUnpin : handlePin,
      textColor: "text-white",
    },
    {
      label: "Reply",
      icon: <Reply />,
      onClick: handleReply,
      textColor: "text-white",
    },
    ...(message.content
      ? [
          {
            label: "Copy",
            icon: <Copy />,
            onClick: handleCopy,
            textColor: "text-white",
          },
        ]
      : []),
    ...(userId === message.sender_id && message.content
      ? [
          {
            label: "Edit",
            icon: <Pencil />,
            onClick: handleEdit,
            textColor: "text-white",
          },
        ]
      : []),
    {
      label: "Delete",
      icon: <Trash2 color='#ff0000' />,
      onClick: handleDelete,
      textColor: "text-red-500",
    },
  ];
};
