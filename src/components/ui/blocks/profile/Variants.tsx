"use client";
import React, { Dispatch, SetStateAction } from "react";
import { variants } from "./UserInfluence";
import { DataVariantsType } from "@/types/profile";

interface VariantsProps {
  selectedVariant: DataVariantsType;
  setSelectedVariant: Dispatch<SetStateAction<DataVariantsType>>;
}

export default function Variants({ selectedVariant, setSelectedVariant }: VariantsProps) {
  return (
    <div className='flex w-full max-w-[650px]'>
      {variants.map((v, index) => (
        <button
          onClick={() => setSelectedVariant(v)}
          className={`flex-grow-1 border border-border lg:px-10 md:px-6 px-1 lg:py-4 md:py-2 py-1 text-text-primary lg:text-2xl text-xl hover:bg-background-secondary/60 sm:uppercase ${
            selectedVariant === v ? "bg-background-secondary" : ""
          } cursor-pointer`}
          key={index}>
          {v}
        </button>
      ))}
    </div>
  );
}
