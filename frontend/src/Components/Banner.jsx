'use client';

import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import AddFriendModal from './AddFriendModal';

const Banner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-11/12 md:w-9/12 items-center flex flex-col mx-auto mt-16 text-center">
        <span className="text-xs uppercase tracking-widest font-bold text-[#244D3F] bg-[#E7F6F2] px-3.5 py-1 rounded-full mb-3">
          Relationship Shelf & CRM
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F2937] tracking-tight">
          Friends to keep close in your life
        </h1>

        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mt-4 leading-relaxed">
          Your personal shelf of meaningful connections. Browse, tend, and nurture the
          relationships that matter most with intentional touchpoints.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#244D3F] hover:bg-[#1a382e] flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl mt-8 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
        >
          <FiPlus className="text-lg" /> Add Friend
        </button>
      </div>

      <AddFriendModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Banner;