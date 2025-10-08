import { Users } from "lucide-react";
import React, { useState } from "react";
import NewGroupModal from "./NewGroupModal";
import { AnimatePresence } from "motion/react";

export default function ChatListHeader() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className='p-2'>
      <button onClick={() => setOpenModal(true)} className='cursor-pointer'>
        <Users />
      </button>
      <AnimatePresence>
        {openModal && <NewGroupModal onClose={() => setOpenModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
