import React, { useEffect, useState } from "react";
import SelectedData from "./SelectedData";
import Variants from "./Variants";
import { useSearchParams } from "next/navigation";
import { isLiteralFromSet } from "@/utils/isLiteralFromSet";
import { ProfileDataVariants } from "@/interfaces/profile";

export const variants = ["posts", "likedPosts", "comments", "settings"] as const;

export default function UserInfluence() {
  const params = useSearchParams();
  const [selectedVariant, setSelectedVariant] = useState<ProfileDataVariants>({
    name: "posts",
    displayName: "Your posts",
  });

  useEffect(() => {
    const variant = params.get("data") ?? "";
    setSelectedVariant((prev) =>
      isLiteralFromSet(variant, variants) ? { ...prev, name: variant } : prev,
    );
  }, [params]);

  return (
    <section className='flex md:flex-row flex-col lg:gap-5 gap-4 lg:px-12 md:px-8 items-start'>
      <Variants selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} />
      <SelectedData selectedVariant={selectedVariant} />
    </section>
  );
}
