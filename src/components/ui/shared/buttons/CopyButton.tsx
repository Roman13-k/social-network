import { Copy } from "lucide-react";
import React, { useState } from "react";

export default function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copyed, setCopyed] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    setCopyed(true);
    setTimeout(() => setCopyed(false), 3000);
  };

  return (
    <button onClick={handleCopy} className='cursor-pointer'>
      <Copy color={copyed ? "#17bf63" : undefined} />
    </button>
  );
}
