"use client";
import { Button } from "@/components/ui/shared/buttons/button";
import { H1 } from "@/components/ui/shared/text/H";
import { useRouter } from "next/navigation";
import React from "react";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className='flex flex-col relative w-full h-full'>
      <main className='w-full h-full flex flex-col gap-2 justify-center items-center'>
        <H1>This page is not found</H1>
        <Button onClick={() => router.back()}>Go back</Button>
      </main>
    </div>
  );
}
