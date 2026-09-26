'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  fetchFriendById,
  archiveFriend,
  addFriendNote,
  deleteFriendNote,
  toggleFavoriteFriend,
} from '../lib/api';
import {
  RiAlarmSnoozeLine,
  RiArrowLeftLine,
  RiEdit2Line,
  RiStickyNoteLine,
  RiZzzLine,
  RiStarFill,
  RiStarLine,
  RiCake2Line,
} from 'react-icons/ri';
import { FaBoxArchive } from 'react-icons/fa6';
import { FaTrashAlt } from 'react-icons/fa';
import { PiPhoneCallBold } from 'react-icons/pi';
import { MdOutlineSms } from 'react-icons/md';
import { IoVideocamOutline } from 'react-icons/io5';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import EditFriendModal from './EditFriendModal';
import DeleteFriendModal from './DeleteFriendModal';
import SnoozeModal from './SnoozeModal';
import LogInteractionModal from './LogInteractionModal';

const FriendDetails = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNoteText, setNewNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSnoozeOpen, setIsSnoozeOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [logType, setLogType] = useState('Call');

  const statusStyles = {
    overdue: 'bg-[#EF4444] text-white',
    'Almost due': 'bg-[#EFAD44] text-white',
    'On Track': 'bg-[#244D3F] text-white',
    Snoozed: 'bg-indigo-500 text-white',
  };

  const loadFriend = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await fetchFriendById(id);
      setFriend(data);
    } catch (err) {
      console.error('Error fetching friend:', err);
      toast.error('Could not load friend details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriend();
  }, [id]);

  const handleOpenLogModal = (type) => {
    setLogType(type);
    setIsLogOpen(true);
  };

  const handleToggleArchive = async () => {
    if (!friend) return;
    try {
      const updated = await archiveFriend(friend.id, !friend.isArchived);
      setFriend(updated);
      toast.info(updated.isArchived ? 'Friend moved to Archive' : 'Friend restored from Archive');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('keen_keeper_updated'));
      }
    } catch {
      toast.error('Failed to update archive status');
    }
  };

  const handleToggleFavorite = async () => {
    if (!friend) return;
    try {
      const newFav = !friend.isFavorite;
      const updated = await toggleFavoriteFriend(friend.id, newFav);
      setFriend((prev) => ({ ...prev, isFavorite: updated.isFavorite }));
      toast.success(newFav ? 'Pinned to Favorites ⭐' : 'Removed from Favorites');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('keen_keeper_updated'));
      }
    } catch {
      toast.error('Failed to update favorite status');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !friend) return;

    try {
      setAddingNote(true);
      const note = await addFriendNote(friend.id, newNoteText.trim());
      setFriend((prev) => ({
        ...prev,
        notes: [note, ...(prev.notes || [])],
      }));
      setNewNoteText('');
      toast.success('Memory note added!');
    } catch {
      toast.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!friend) return;
    try {
      await deleteFriendNote(friend.id, noteId);
      setFriend((prev) => ({
        ...prev,
        notes: (prev.notes || []).filter((n) => n.id !== noteId),
      }));
      toast.info('Note removed');
    } catch {
      toast.error('Failed to remove note');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#244D3F] rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm font-medium">Loading shelf connection...</p>
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-gray-700">Friend not found</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-4 py-2 bg-[#244D3F] text-white rounded-lg text-sm"
        >
          Return to Shelf
        </button>
      </div>
    );
  }

  const isSnoozed = friend.snoozedUntil && new Date(friend.snoozedUntil) > new Date();

  return (
    <div className="w-11/12 lg:w-9/12 mx-auto my-8">
      <ToastContainer position="top-center" autoClose={1500} hideProgressBar />

      {/* BACK NAVIGATION */}
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#244D3F] mb-6 transition"
      >
        <RiArrowLeftLine className="text-lg" /> Back to Friends Shelf
      </button>

      {/* SNOOZED / ARCHIVED BANNER */}
      {isSnoozed && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-indigo-900">
          <div className="flex items-center gap-2.5">
            <RiZzzLine className="text-xl text-indigo-600" />
            <span className="text-sm font-medium">
              Reminders snoozed until{' '}
              <strong>{new Date(friend.snoozedUntil).toLocaleDateString()}</strong>.
            </span>
          </div>
          <button
            onClick={() => setIsSnoozeOpen(true)}
            className="text-xs bg-white text-indigo-700 font-bold px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-100"
          >
            Adjust Snooze
          </button>
        </div>
      )}

      {friend.isArchived && (
        <div className="mb-6 p-4 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-between text-gray-800">
          <span className="text-sm font-medium">
            This contact is currently <strong>Archived</strong> and hidden from normal shelf views.
          </span>
          <button
            onClick={handleToggleArchive}
            className="text-xs bg-white text-gray-800 font-bold px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Restore
          </button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="bg-[#E7F6F2]/40 border border-gray-200/80 rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row gap-8 shadow-xs">
        {/* LEFT COLUMN: PROFILE CARD */}
        <div className="flex flex-col w-full lg:w-[320px] shrink-0">
          <div className="bg-white border border-gray-100 w-full p-6 rounded-2xl text-center shadow-xs flex flex-col relative">
            {/* FAVORITE TOGGLE */}
            <button
              onClick={handleToggleFavorite}
              className={`absolute top-4 left-4 p-2 rounded-lg transition ${
                friend.isFavorite
                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100 ring-1 ring-amber-200'
                  : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100'
              }`}
              title={friend.isFavorite ? 'Pinned to Favorites' : 'Add to Favorites'}
            >
              {friend.isFavorite ? <RiStarFill className="text-lg" /> : <RiStarLine className="text-lg" />}
            </button>

            <button
              onClick={() => setIsEditOpen(true)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#244D3F] hover:bg-gray-100 rounded-lg transition"
              title="Edit Profile"
            >
              <RiEdit2Line className="text-lg" />
            </button>

            <img
              src={friend.picture}
              alt={friend.name}
              className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-[#244D3F]/10 shadow-sm"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />

            <h1 className="text-2xl font-bold text-gray-900 mt-4">{friend.name}</h1>

            <div className="my-2.5 flex items-center justify-center gap-2">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  statusStyles[friend.status] || 'bg-gray-400 text-white'
                }`}
              >
                {friend.status}
              </span>

              {friend.isFavorite && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <RiStarFill className="text-amber-500 text-xs" /> Favorite
                </span>
              )}
            </div>

            {/* BIRTHDAY BADGE */}
            {friend.birthday && (
              <div className="mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/70">
                  <RiCake2Line className="text-purple-600 text-sm" />
                  Birthday: {friend.birthday}
                </span>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-1.5 mb-3">
              {(friend.tags || []).map((tag, index) => (
                <span
                  key={index}
                  className="text-[11px] font-semibold bg-[#E7F6F2] text-[#244D3F] px-2.5 py-0.5 rounded-md uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-600 text-sm mb-2 italic">
              {friend.bio ? `"${friend.bio}"` : 'No bio specified.'}
            </p>

            <div className="text-xs text-gray-500 space-y-1 mt-2 pt-3 border-t border-gray-100">
              {friend.email && <p className="truncate">✉️ {friend.email}</p>}
              {friend.phone && <p>📞 {friend.phone}</p>}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 mt-4">
            <button
              onClick={() => setIsSnoozeOpen(true)}
              className="flex-1 flex items-center gap-2 justify-center font-bold text-sm bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-3 hover:bg-gray-50 hover:shadow-xs transition"
            >
              <RiAlarmSnoozeLine className="text-lg text-indigo-600" />
              {isSnoozed ? 'Adjust Snooze' : 'Snooze'}
            </button>

            <button
              onClick={handleToggleArchive}
              className="flex-1 flex items-center gap-2 justify-center font-bold text-sm bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-3 hover:bg-gray-50 hover:shadow-xs transition"
            >
              <FaBoxArchive className="text-sm text-gray-500" />
              {friend.isArchived ? 'Restore to Shelf' : 'Archive'}
            </button>

            <button
              onClick={() => setIsDeleteOpen(true)}
              className="flex-1 flex items-center gap-2 justify-center font-bold text-sm text-red-600 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:bg-red-50 hover:border-red-200 transition"
            >
              <FaTrashAlt className="text-sm" />
              Delete Contact
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS & CADENCE & NOTES */}
        <div className="grow flex flex-col gap-6">
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
              <h2 className="text-3xl font-extrabold text-[#244D3F]">
                {friend.days_since_contact}
              </h2>
              <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide mt-1">
                Days Since Contact
              </p>
            </div>

            <div className="text-center bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
              <h2 className="text-3xl font-extrabold text-[#244D3F]">
                {friend.goal || 14}
              </h2>
              <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide mt-1">
                Cadence Goal (Days)
              </p>
            </div>

            <div className="text-center bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
              <h2 className="text-2xl font-extrabold text-[#244D3F]">
                {friend.next_due_date || 'N/A'}
              </h2>
              <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide mt-1">
                Next Touchpoint Due
              </p>
            </div>
          </div>

          {/* RELATIONSHIP GOAL CARD */}
          <div className="w-full p-6 bg-white border border-gray-100 rounded-2xl shadow-xs">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-gray-900">Relationship Cadence</h3>
                <p className="text-xs text-gray-500">How regularly you intend to reach out</p>
              </div>
              <button
                onClick={() => setIsEditOpen(true)}
                className="px-3.5 py-1.5 bg-[#FAFBFB] hover:bg-gray-100 border border-gray-200 font-semibold rounded-lg text-xs text-gray-700 transition"
              >
                Change Frequency
              </button>
            </div>

            <p className="text-base font-semibold mt-3 text-gray-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#244D3F]"></span>
              Connect every {friend.goal || 14} days
            </p>
          </div>

          {/* QUICK CHECK-IN CHANNELS */}
          <div className="w-full bg-white border border-gray-100 p-6 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#244D3F]">Quick Check-In</h3>
                <p className="text-xs text-gray-500">Log a connection to reset days since contact</p>
              </div>
              <button
                onClick={() => handleOpenLogModal('Call')}
                className="text-xs font-semibold text-[#244D3F] hover:underline"
              >
                + Custom Log with Notes
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => handleOpenLogModal('Call')}
                className="flex flex-col items-center gap-2.5 bg-[#E7F6F2]/60 hover:bg-[#E7F6F2] p-4 rounded-xl cursor-pointer transition border border-emerald-100 hover:-translate-y-0.5"
              >
                <PiPhoneCallBold className="text-[#244D3F] text-2xl" />
                <p className="font-bold text-sm text-gray-800">Phone Call</p>
              </div>

              <div
                onClick={() => handleOpenLogModal('Text')}
                className="flex flex-col items-center gap-2.5 bg-[#E7F6F2]/60 hover:bg-[#E7F6F2] p-4 rounded-xl cursor-pointer transition border border-emerald-100 hover:-translate-y-0.5"
              >
                <MdOutlineSms className="text-[#244D3F] text-2xl" />
                <p className="font-bold text-sm text-gray-800">Message / Text</p>
              </div>

              <div
                onClick={() => handleOpenLogModal('Video')}
                className="flex flex-col items-center gap-2.5 bg-[#E7F6F2]/60 hover:bg-[#E7F6F2] p-4 rounded-xl cursor-pointer transition border border-emerald-100 hover:-translate-y-0.5"
              >
                <IoVideocamOutline className="text-[#244D3F] text-2xl" />
                <p className="font-bold text-sm text-gray-800">Video Call</p>
              </div>
            </div>
          </div>

          {/* MEMORY NOTES & JOURNAL SECTION */}
          <div className="w-full bg-white border border-gray-100 p-6 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <RiStickyNoteLine className="text-xl text-[#244D3F]" />
              <div>
                <h3 className="text-base font-bold text-gray-900">Relationship Memory Notes</h3>
                <p className="text-xs text-gray-500">
                  Keep notes on family news, favorites, recommendations, and talking points
                </p>
              </div>
            </div>

            {/* ADD NOTE FORM */}
            <form onSubmit={handleAddNote} className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Add a new memory note (e.g. Loves Ethiopian food, sister just got married)..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="grow px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
              />
              <button
                type="submit"
                disabled={addingNote || !newNoteText.trim()}
                className="px-4 py-2 bg-[#244D3F] hover:bg-[#1a382e] text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
              >
                {addingNote ? 'Saving...' : 'Add Note'}
              </button>
            </form>

            {/* NOTES LIST */}
            <div className="mt-4 space-y-2">
              {!friend.notes || friend.notes.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">
                  No notes recorded yet. Add your first note above!
                </p>
              ) : (
                friend.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-[#FAFBFB] border border-gray-100 rounded-xl flex items-start justify-between gap-3 text-sm"
                  >
                    <div>
                      <p className="text-gray-800">{note.text}</p>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {note.date || 'Recently'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-400 hover:text-red-500 text-xs p-1"
                      title="Delete note"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <EditFriendModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        friend={friend}
        onFriendUpdated={(updated) => setFriend(updated)}
      />

      <DeleteFriendModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        friend={friend}
      />

      <SnoozeModal
        isOpen={isSnoozeOpen}
        onClose={() => setIsSnoozeOpen(false)}
        friend={friend}
        onUpdated={(updated) => setFriend(updated)}
      />

      <LogInteractionModal
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        friend={friend}
        initialType={logType}
        onInteractionLogged={(updated) => setFriend(updated)}
      />
    </div>
  );
};

export default FriendDetails;