'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RiHome2Line,
  RiTimeLine,
  RiBarChart2Line,
  RiMenuLine,
  RiCloseLine,
  RiUserAddLine,
} from 'react-icons/ri';
import AddFriendModal from './AddFriendModal';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Shelf', path: '/', icon: RiHome2Line },
    { name: 'Timeline', path: '/timeline', icon: RiTimeLine },
    { name: 'Analytics', path: '/stats', icon: RiBarChart2Line },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <nav className="flex w-full max-w-7xl mx-auto px-4 sm:px-8 py-3.5 items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-[#244D3F] text-white flex items-center justify-center font-black text-lg shadow-xs group-hover:scale-105 transition">
              K
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-gray-900 leading-none">
                Keen<span className="text-[#244D3F]">Keeper</span>
              </span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">
                Relationship CRM
              </span>
            </div>
          </Link>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="md:hidden text-2xl p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <RiCloseLine /> : <RiMenuLine />}
          </button>

          {/* NAVIGATION LINKS */}
          <div
            className={`w-full md:w-auto flex flex-col md:flex-row md:items-center gap-2 md:gap-3 transition-all duration-200 ${
              isOpen ? 'block pt-4 md:pt-0' : 'hidden'
            } md:flex`}
          >
            <ul className="flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.path;

                return (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className={`flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'text-white bg-[#244D3F] shadow-xs'
                          : 'text-gray-600 hover:text-[#244D3F] hover:bg-gray-100'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="text-base" />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* QUICK ACTION BUTTON */}
            <div className="pt-2 md:pt-0 md:pl-2 border-t md:border-t-0 md:border-l border-gray-200 flex items-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsAddModalOpen(true);
                }}
                className="w-full md:w-auto flex items-center justify-center gap-1.5 text-xs font-bold bg-[#E7F6F2] hover:bg-[#d8efe8] text-[#244D3F] px-3.5 py-2 rounded-xl transition border border-[#244D3F]/20 cursor-pointer"
              >
                <RiUserAddLine className="text-sm" />
                Add Friend
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AddFriendModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  );
};

export default NavBar;