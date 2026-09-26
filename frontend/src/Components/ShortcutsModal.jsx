'use client';

import React from 'react';
import { RiCloseLine, RiKeyboardLine } from 'react-icons/ri';

const SHORTCUTS = [
  { key: '?', description: 'Open this Keyboard Shortcuts Guide' },
  { key: 'n', description: 'Open Add New Friend modal' },
  { key: '/', description: 'Focus friend search bar' },
  { key: 'h', description: 'Navigate to Friends Shelf (Home)' },
  { key: 't', description: 'Navigate to Interaction Timeline' },
  { key: 's', description: 'Navigate to Analytics & Stats' },
  { key: 'Esc', description: 'Close any open modal or dialog' },
];

const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAFBFB]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#E7F6F2] text-[#244D3F] rounded-lg">
              <RiKeyboardLine className="text-xl" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Keyboard Shortcuts</h2>
              <p className="text-xs text-gray-500">Fast navigation for power users</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <RiCloseLine className="text-2xl" />
          </button>
        </div>

        {/* LIST */}
        <div className="p-6 divide-y divide-gray-100">
          {SHORTCUTS.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between py-2.5 text-xs">
              <span className="text-gray-700 font-medium">{s.description}</span>
              <kbd className="px-2.5 py-1 bg-gray-100 border border-gray-300 rounded-md font-mono font-bold text-gray-800 text-[11px] shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;
