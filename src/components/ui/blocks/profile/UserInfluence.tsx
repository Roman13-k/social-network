import React, { useEffect, useState } from "react";
import SelectedData from "./SelectedData";
import Variants from "./Variants";
import { useSearchParams } from "next/navigation";
import { isLiteralFromSet } from "@/utils/isLiteralFromSet";
import { DataVariantsType } from "@/types/profile";

export const variants: DataVariantsType[] = ["posts", "likedPosts", "comments"];

export default function UserInfluence() {
  const params = useSearchParams();
  const [selectedVariant, setSelectedVariant] = useState<DataVariantsType>("posts");

  useEffect(() => {
    const variant = params.get("data") ?? "";
    setSelectedVariant(isLiteralFromSet(variant, variants) ? variant : "posts");
  }, [params]);

  return (
    <section className='flex flex-col lg:gap-5 gap-4 lg:px-16 md:px-8 items-center'>
      <Variants selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} />
      <SelectedData selectedVariant={selectedVariant} />
    </section>
  );
}
