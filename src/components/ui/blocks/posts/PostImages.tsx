import Image from "next/image";
import React from "react";

export default function PostImages({ imageUrls }: { imageUrls: string[] | undefined }) {
  return (
    <>
      {imageUrls && imageUrls.length > 0 && (
        <div
          className={`
                grid md:gap-2 gap-1 max-w-[540px] w-full h-auto
                ${imageUrls.length === 1 ? "grid-cols-1 grid-rows-1" : ""}
                ${imageUrls.length === 2 ? "grid-cols-2 grid-rows-1" : ""}
                ${imageUrls.length === 3 ? "grid-cols-2 grid-rows-2" : ""}
              `}>
          {imageUrls.map((url, i) => (
            <Image
              key={url}
              src={url}
              alt='post'
              width={540}
              height={540}
              className={`
                    object-contain rounded-2xl w-full h-full max-h-[650px] border-2 border-accent/15
                    ${imageUrls.length === 3 && i === 0 ? "col-span-2 row-span-2" : ""}
                    ${imageUrls.length === 3 && i > 0 ? "w-full h-full" : ""}
                  `}
            />
          ))}
        </div>
      )}
    </>
  );
}
