'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteFriend } from '../lib/api';
import { toast } from 'react-toastify';
import { FaTrashAlt } from 'react-icons/fa';
import { RiAlertLine, RiCloseLine } from 'react-icons/ri';

const DeleteFriendModal = ({ isOpen, onClose, friend }) => {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  if (!isOpen || !friend) return null;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteFriend(friend.id);
      toast.success(`${friend.name} has been removed from your shelf.`);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('keen_keeper_updated'));
      }

      onClose();
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to delete friend');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <RiAlertLine className="text-2xl" />
          </div>

          <h3 className="text-lg font-bold text-center text-gray-900">
            Remove {friend.name}?
          </h3>

          <p className="text-sm text-center text-gray-500 mt-2">
            Are you sure you want to remove <span className="font-semibold text-gray-700">{friend.name}</span> from your relationship shelf? All associated logged interactions and notes will also be removed.
          </p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition shadow-xs disabled:opacity-50"
            >
              <FaTrashAlt className="text-xs" />
              {deleting ? 'Removing...' : 'Delete Friend'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteFriendModal;
