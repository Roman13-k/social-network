"use client";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "../../shared/buttons/button";
import { useAppSelector } from "@/store/hooks";
import { TooltipDemo } from "../../shared/tooltip";
import { H2 } from "../../shared/text/H";

export default function NewPost({
  setPostModal,
}: {
  setPostModal: Dispatch<SetStateAction<boolean>>;
}) {
  const user = useAppSelector((state) => state.user.user);

  return (
    <section className='flex items-center gap-10'>
      <H2>Create a new post:</H2>
      {user ? (
        <Button variant={"default"} onClick={() => setPostModal(true)} size={"lg"}>
          + New Post
        </Button>
      ) : (
        <TooltipDemo content='You must be logged in'>
          <Button disabled variant={"destructive"} size={"lg"}>
            + New Post
          </Button>
        </TooltipDemo>
      )}
    </section>
  );
}
