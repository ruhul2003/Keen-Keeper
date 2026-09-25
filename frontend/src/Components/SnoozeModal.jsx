'use client';

import React, { useState } from 'react';
import { snoozeFriend, unsnoozeFriend } from '../lib/api';
import { toast } from 'react-toastify';
import { RiAlarmSnoozeLine, RiCloseLine, RiZzzLine } from 'react-icons/ri';

const SNOOZE_OPTIONS = [
  { label: '3 Days', days: 3, desc: 'Catch up after the weekend' },
  { label: '1 Week', days: 7, desc: 'Busy with work this week' },
  { label: '2 Weeks', days: 14, desc: 'Traveling or away on holiday' },
  { label: '1 Month', days: 30, desc: 'Long-distance seasonal cadence' },
];

const SnoozeModal = ({ isOpen, onClose, friend, onUpdated }) => {
  const [selectedDays, setSelectedDays] = useState(7);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !friend) return null;

  const isCurrentlySnoozed =
    friend.snoozedUntil && new Date(friend.snoozedUntil) > new Date();

  const handleSnooze = async () => {
    try {
      setLoading(true);
      const updated = await snoozeFriend(friend.id, selectedDays);
      toast.info(`Snoozed reminders for ${friend.name} for ${selectedDays} days`);
      if (onUpdated) onUpdated(updated);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('keen_keeper_updated'));
      }
      onClose();
    } catch (err) {
      toast.error('Failed to snooze friend');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsnooze = async () => {
    try {
      setLoading(true);
      const updated = await unsnoozeFriend(friend.id);
      toast.success(`Resumed reminders for ${friend.name}`);
      if (onUpdated) onUpdated(updated);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('keen_keeper_updated'));
      }
      onClose();
    } catch (err) {
      toast.error('Failed to wake friend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAFBFB]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <RiAlarmSnoozeLine className="text-xl" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Snooze Reminder</h2>
              <p className="text-xs text-gray-500">Temporarily pause overdue alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <RiCloseLine className="text-2xl" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {isCurrentlySnoozed && (
            <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl flex items-center justify-between text-xs text-indigo-900">
              <div className="flex items-center gap-2">
                <RiZzzLine className="text-indigo-600 text-lg" />
                <span>
                  Currently snoozed until{' '}
                  <strong>{new Date(friend.snoozedUntil).toLocaleDateString()}</strong>
                </span>
              </div>
              <button
                onClick={handleUnsnooze}
                disabled={loading}
                className="px-2.5 py-1 bg-white font-semibold text-indigo-700 rounded-md border border-indigo-200 hover:bg-indigo-100"
              >
                Wake Now
              </button>
            </div>
          )}

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Select Snooze Duration
          </p>

          <div className="space-y-2">
            {SNOOZE_OPTIONS.map((opt) => (
              <div
                key={opt.days}
                onClick={() => setSelectedDays(opt.days)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  selectedDays === opt.days
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{opt.label}</h4>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </div>
                <input
                  type="radio"
                  name="snoozeDays"
                  checked={selectedDays === opt.days}
                  onChange={() => setSelectedDays(opt.days)}
                  className="accent-indigo-600"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSnooze}
              className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs disabled:opacity-50"
            >
              {loading ? 'Snoozing...' : `Snooze for ${selectedDays} Days`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnoozeModal;
