'use client';

import React, { useState } from 'react';
import { logActivity } from '../lib/api';
import { toast } from 'react-toastify';
import { PiPhoneCallBold } from 'react-icons/pi';
import { MdOutlineSms } from 'react-icons/md';
import { IoVideocamOutline } from 'react-icons/io5';
import { RiCupLine, RiGiftLine, RiCloseLine, RiCheckboxCircleLine } from 'react-icons/ri';

const ACTIVITY_TYPES = [
  { type: 'Call', icon: PiPhoneCallBold, color: 'text-green-700 bg-green-50 border-green-200' },
  { type: 'Text', icon: MdOutlineSms, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { type: 'Video', icon: IoVideocamOutline, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { type: 'Coffee', icon: RiCupLine, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { type: 'Gift', icon: RiGiftLine, color: 'text-pink-700 bg-pink-50 border-pink-200' },
];

const LogInteractionModal = ({ isOpen, onClose, friend, initialType = 'Call', onInteractionLogged }) => {
  const [type, setType] = useState(initialType);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [sentiment, setSentiment] = useState('Great');
  const [saving, setSaving] = useState(false);

  if (!isOpen || !friend) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await logActivity({
        friendId: friend.id,
        name: friend.name,
        type: type,
        notes: notes.trim(),
        date: date,
        duration: duration ? parseInt(duration, 10) : null,
        location: location.trim(),
        sentiment: sentiment,
        time: `${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      });

      toast.success(
        <div className="flex items-center gap-2">
          <RiCheckboxCircleLine className="text-emerald-500 text-xl" />
          <span className="font-semibold text-gray-800">
            {type} with {friend.name} recorded!
          </span>
        </div>
      );

      if (onInteractionLogged) {
        onInteractionLogged({
          ...friend,
          days_since_contact: 0,
          status: 'On Track',
        });
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('keen_keeper_updated'));
      }

      setNotes('');
      setDuration('');
      setLocation('');
      setSentiment('Great');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to log interaction');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAFBFB]">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Log Touchpoint with {friend.name}</h2>
            <p className="text-xs text-gray-500">Record a call, message, or hangout to reset the contact clock</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <RiCloseLine className="text-2xl" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* TYPE SELECTOR */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Interaction Channel
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ACTIVITY_TYPES.map((item) => {
                const IconComponent = item.icon;
                const isSelected = type === item.type;
                return (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => setType(item.type)}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition ${
                      isSelected
                        ? `${item.color} ring-2 ring-offset-1 ring-[#244D3F] font-bold`
                        : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <IconComponent className="text-xl mb-1" />
                    <span className="text-[11px]">{item.type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DATE & DURATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="600"
                placeholder="e.g. 30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
              />
            </div>
          </div>

          {/* LOCATION / HANGOUT SPOT */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Location / Spot (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Central Perk Cafe, Phone, Zoom, Downtown Park"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
            />
          </div>

          {/* SENTIMENT / MOOD */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
              Interaction Mood & Sentiment
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Great', emoji: '😍', border: 'border-emerald-200', active: 'bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500' },
                { label: 'Good', emoji: '😊', border: 'border-blue-200', active: 'bg-blue-50 text-blue-800 ring-2 ring-blue-500' },
                { label: 'Neutral', emoji: '😐', border: 'border-gray-200', active: 'bg-gray-100 text-gray-800 ring-2 ring-gray-400' },
                { label: 'Challenging', emoji: '🫂', border: 'border-amber-200', active: 'bg-amber-50 text-amber-800 ring-2 ring-amber-500' },
              ].map((s) => (
                <button
                  type="button"
                  key={s.label}
                  onClick={() => setSentiment(s.label)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs font-medium border transition ${
                    sentiment === s.label
                      ? s.active
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-base mb-0.5">{s.emoji}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CONVERSATION NOTES */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Conversation Highlights / Memory Notes
            </label>
            <textarea
              rows={3}
              placeholder="What did you talk about? Life updates, recommendations, promises made..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
            />
          </div>

          {/* FOOTER */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-bold text-white bg-[#244D3F] hover:bg-[#1a382e] rounded-lg transition shadow-sm disabled:opacity-50"
            >
              {saving ? 'Recording...' : 'Save Touchpoint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogInteractionModal;
