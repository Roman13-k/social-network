"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getProfileById } from "@/store/redusers/userReducer";
import React, { PropsWithChildren, useEffect } from "react";

export default function ChatContainer({
  children,
  className,
  wrapper,
}: PropsWithChildren<{ className?: string; wrapper?: string }>) {
  const { user, profile } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.id) {
      dispatch(getProfileById(user.id));
    }
  }, [user?.id, dispatch]);

  const hasCustomBg = !!profile?.chat_background;

  return (
    <div
      className={`${
        wrapper ?? ""
      } w-full rounded-tl-lg md:rounded-tl-none rounded-tr-lg bg-no-repeat bg-center bg-cover relative`}
      style={hasCustomBg ? { backgroundImage: `url(${profile.chat_background})` } : undefined}>
      <div className={`relative flex flex-col h-full ${className ?? ""} z-10`}>{children}</div>
      {!hasCustomBg && (
        <div className="z-0 absolute inset-0 bg-[url('/chatbg.jpg')] dark:bg-[url('/chatbg_dark.png')] rounded-tr-lg bg-no-repeat bg-center bg-cover" />
      )}
    </div>
  );
}
