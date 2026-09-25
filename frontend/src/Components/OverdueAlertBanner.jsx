'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchFriends } from '../lib/api';
import { RiNotification3Line, RiCloseLine, RiHeartFill } from 'react-icons/ri';

const OverdueAlertBanner = () => {
  const [overdueFriends, setOverdueFriends] = useState([]);
  const [isDismissed, setIsDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkOverdue = async () => {
    try {
      setLoading(true);
      const friends = await fetchFriends({ status: 'overdue' });
      setOverdueFriends(Array.isArray(friends) ? friends : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkOverdue();

    const handleUpdate = () => checkOverdue();
    window.addEventListener('keen_keeper_updated', handleUpdate);
    return () => window.removeEventListener('keen_keeper_updated', handleUpdate);
  }, []);

  if (isDismissed || loading || overdueFriends.length === 0) {
    return null;
  }

  return (
    <div className="w-11/12 lg:w-9/12 mx-auto mt-10">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* LEFT ICON & MESSAGE */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl shrink-0">
            <RiNotification3Line className="text-2xl animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
              <span>{overdueFriends.length} friends waiting for a warm hello</span>
              <RiHeartFill className="text-red-400 text-sm hidden sm:inline" />
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Life gets busy! A 2-minute message or quick catch-up call makes a big difference.
            </p>
          </div>
        </div>

        {/* RIGHT AVATARS & QUICK BUTTONS */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex -space-x-2 overflow-hidden">
            {overdueFriends.slice(0, 4).map((friend) => (
              <Link
                key={friend.id}
                href={`/friends/${friend.id}`}
                title={`${friend.name} (${friend.days_since_contact}d overdue)`}
                className="hover:scale-110 transition z-10 hover:z-20"
              >
                <img
                  src={friend.picture}
                  alt={friend.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </Link>
            ))}
          </div>

          <Link
            href={`/friends/${overdueFriends[0].id}`}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Say Hi to {overdueFriends[0].name.split(' ')[0]} →
          </Link>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-amber-100/50 transition"
            title="Dismiss banner"
          >
            <RiCloseLine className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverdueAlertBanner;
