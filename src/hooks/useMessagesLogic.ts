"use client";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearMessages, loadMessages, loadPinMessages } from "@/store/redusers/messagesReduser";

export function useMessagesLogic(
  chatId: string | undefined,
  isPinned: boolean,
  setIsToBottom: (v: boolean) => void,
) {
  const dispatch = useAppDispatch();
  const { offset, pinOffset, loading, error } = useAppSelector((s) => s.messages);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (!chatId) return;

    if (!initRef.current) {
      if (isPinned) {
        if (pinOffset !== null && !loading && !error) {
          dispatch(loadPinMessages({ chatId, offset: pinOffset }));
          setIsToBottom(true);
        }
      } else {
        if (offset !== null && !loading && !error) {
          dispatch(loadMessages({ offset, chatId }));
          setIsToBottom(true);
        }
      }
      initRef.current = true;
    }
  }, [chatId, isPinned]);

  useEffect(() => {
    initRef.current = false;
    return () => {
      dispatch(clearMessages());
    };
  }, [chatId]);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el || !chatId) return;

    const handleScroll = () => {
      setIsToBottom(false);

      if (el.scrollTop < 100) {
        if (isPinned) {
          if (pinOffset !== null && !loading && !error) {
            const prevHeight = el.scrollHeight;
            const prevScrollTop = el.scrollTop;

            dispatch(loadPinMessages({ chatId, offset: pinOffset }))
              .unwrap()
              .then((newMessages) => {
                if (newMessages?.messages?.length > 0) {
                  const newHeight = el.scrollHeight;
                  el.scrollTop = newHeight - prevHeight + prevScrollTop;
                }
              });
          }
        } else {
          if (offset !== null && !loading && !error) {
            const prevHeight = el.scrollHeight;
            const prevScrollTop = el.scrollTop;

            dispatch(loadMessages({ offset, chatId }))
              .unwrap()
              .then((newMessages) => {
                if (newMessages.length > 0) {
                  const newHeight = el.scrollHeight;
                  el.scrollTop = newHeight - prevHeight + prevScrollTop;
                }
              });
          }
        }
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [chatId, isPinned, offset, loading, error, pinOffset]);

  return { messagesRef, bottomRef };
}
