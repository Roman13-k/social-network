import { Copy, Pencil, Pin, Reply, Trash2 } from "lucide-react";
import { MessageInterface } from "@/interfaces/message";
import { deleteMessage, startEdit, startReply } from "@/store/redusers/messagesReduser";
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
  dispatch: AppDispatch,
  onClose: () => void,
): Action[] => {
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

  const handleReply = () => {
    dispatch(startReply(message));
    onClose();
  };

  const handlePin = () => {
    onClose();
  };

  return [
    {
      label: "Pin",
      icon: <Pin />,
      onClick: handlePin,
      textColor: "text-white",
    },
    {
      label: "Reply",
      icon: <Reply />,
      onClick: handleReply,
      textColor: "text-white",
    },
    {
      label: "Copy",
      icon: <Copy />,
      onClick: handleCopy,
      textColor: "text-white",
    },
    ...(userId === message.sender_id
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
