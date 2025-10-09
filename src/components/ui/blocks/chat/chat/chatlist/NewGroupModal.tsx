"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shared/form";
import ModalContainer from "@/components/ui/shared/containers/ModalContainer";
import { H3 } from "@/components/ui/shared/text/H";
import { Plus } from "lucide-react";
import P from "@/components/ui/shared/text/P";
import { Button } from "@/components/ui/shared/buttons/button";
import { Input } from "@/components/ui/shared/inputs/input";
import { NewGroupSchema, newGroupSchema } from "@/utils/validate/newGroupSheme";
import { getUserById } from "@/utils/api/getProfileById";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getOrCreateNewChat } from "@/store/redusers/chatsReduser";

export default function NewGroupModal({ onClose }: { onClose: () => void }) {
  const [count, setCount] = useState(0);
  const [names, setNames] = useState<string[]>([]);
  const userId = useAppSelector((state) => state.user.user?.id);
  const { loading, error } = useAppSelector((state) => state.chats);

  const dispatch = useAppDispatch();

  const form = useForm<NewGroupSchema>({
    resolver: zodResolver(newGroupSchema),
    defaultValues: { name: "", uuids: [""] },
    mode: "onSubmit",
  });

  const onSubmit = async (data: NewGroupSchema) => {
    if (!userId) return;
    await dispatch(getOrCreateNewChat({ userA: userId, userB: data.uuids, name: data.name }));
    if (!loading && !error) onClose();
  };

  const handleBlur = async (uuid: string, index: number) => {
    if (!uuid) return;
    try {
      const user = await getUserById(uuid);
      setNames((prev) => {
        const copy = [...prev];
        copy[index] = user?.id === userId ? "Dont add youself" : user?.username || "Anonim";
        return copy;
      });
    } catch (e) {
      setNames((prev) => {
        const copy = [...prev];
        copy[index] = "User not found";
        return copy;
      });
    }
  };

  return (
    <ModalContainer onClose={onClose}>
      <H3>New Group</H3>

      <div className='flex flex-col items-start'>
        <div className='flex items-center gap-1'>
          <P>Add participant:</P>
          <Button
            type='button'
            onClick={() => {
              if (count < 5) setCount((prev) => prev + 1);
            }}
            disabled={count >= 5}
            className='cursor-pointer'>
            <Plus className='h-4 w-4' />
          </Button>
        </div>
        <span className='text-xs text-text-secondary'>You can copy UUID in the profile</span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-1.5'>
          <FormField
            name='name'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {Array.from({ length: count }, (_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`uuids.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`${
                      names[index] == "User not found" || names[index] == "Dont add youself"
                        ? "text-red-500"
                        : names[index] && "text-button"
                    }`}>
                    {names[index]}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={`${
                        names[index] == "User not found" || names[index] == "Dont add youself"
                          ? "border-red-500"
                          : names[index] && "border-button"
                      }`}
                      onBlur={() => {
                        handleBlur(field.value, index);
                      }}
                      placeholder={`uuid #${index + 1}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button
            loading={loading}
            disabled={count === 0 || names.includes("Dont add youself") || !!error}
            type='submit'
            variant='secondary'>
            Create group
          </Button>
        </form>
      </Form>
    </ModalContainer>
  );
}
