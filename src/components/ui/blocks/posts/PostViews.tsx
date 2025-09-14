import { Eye } from "lucide-react";
import React from "react";
import P from "../../shared/text/P";
import { integerFormat } from "@/utils/integerFormat";

export default function PostViews({ count }: { count: number }) {
  return (
    <div className='flex items-center ml-auto lg:mr-5 md:mr-4 mr-1 group'>
      <div className='rounded-full group-hover:bg-button/30 p-1 transition-all'>
        <Eye color='#17bf63' />
      </div>
      <P variant={"secondary"} className='group-hover:text-button font-medium transition-all'>
        {integerFormat(count)}
      </P>
    </div>
  );
}
