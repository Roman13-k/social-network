"use client";
import { SettingsRender } from "@/interfaces/user";
import React from "react";
import NotificationRequest from "../../notification/NotificationRequest";
import { Switch } from "@/components/ui/shared/switch/switch";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/shared/buttons/button";
import { Input } from "@/components/ui/shared/inputs/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeUserInfo } from "@/store/redusers/userReducer";
import { FieldValues, Path, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { uploadImages } from "@/utils/uploadImages";
import { supabase } from "@/lib/supabaseClient";

interface MiniFormProps<T extends FieldValues> {
  resolver?: Resolver<T>;
  action: (data: T) => void;
  name: Path<T>;
}

const avatarSchema = z.object({
  avatar: z
    .any()
    .refine((files) => files && files.length > 0, "Выберите файл")
    .transform((files) => files[0] as File),
});

const bgSchema = z.object({
  background: z
    .any()
    .refine((files) => files && files.length > 0, "Выберите файл")
    .transform((files) => files[0] as File),
});

function MiniForm<T extends FieldValues>({
  action,
  resolver,
  name,
  ...props
}: MiniFormProps<T> & React.ComponentProps<"input">) {
  const loading = useAppSelector((state) => state.user.loading);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({ mode: "onSubmit", resolver });

  const onSubmit: SubmitHandler<T> = (data) => action(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex gap-2.5 items-center'>
      <Input
        error={errors[name]?.message as string | undefined}
        {...register(name, { required: true })}
        {...props}
      />
      <Button loading={loading} type='submit' variant='secondary'>
        Save
      </Button>
    </form>
  );
}

export default function GetUserSettings() {
  const userId = useAppSelector((state) => state?.user?.user?.id);
  const { setTheme, theme } = useTheme();
  const dispatch = useAppDispatch();

  const handleChangeAvatar = async (data: { avatar: File }) => {
    if (!userId) return;
    const urls = await uploadImages("user-avatars", userId, [data.avatar]);
    if (urls) await dispatch(changeUserInfo({ avatar_url: urls[0] }));
  };

  const handleChangeChatBg = async (data: { background: File }) => {
    if (!userId) return;
    const urls = await uploadImages("chat-background", userId, [data.background]);
    if (urls) await supabase.from("profiles").update({ chat_background: urls[0] }).eq("id", userId);
  };

  const settings: SettingsRender[] = [
    {
      label: "User name: ",
      data: (
        <MiniForm
          resolver={zodResolver(z.object({ username: z.string().min(1).max(20) }))}
          name='username'
          action={(data) => dispatch(changeUserInfo({ name: data.username }))}
          type='text'
        />
      ),
    },
    {
      label: "User avatar: ",
      data: (
        <MiniForm
          resolver={zodResolver(avatarSchema)}
          name='avatar'
          action={handleChangeAvatar}
          type='file'
          accept='image/*'
        />
      ),
    },
    { label: "Notifications: ", data: <NotificationRequest /> },
    {
      label: "Chat background: ",
      data: (
        <MiniForm
          resolver={zodResolver(bgSchema)}
          name='background'
          action={handleChangeChatBg}
          type='file'
          accept='image/*'
        />
      ),
    },
    {
      label: "Dark mode: ",
      data: (
        <Switch
          checked={theme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
      ),
    },
  ];

  return settings;
}
