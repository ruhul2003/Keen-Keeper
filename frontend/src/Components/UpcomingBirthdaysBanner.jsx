'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchUpcomingBirthdays } from '../lib/api';
import { RiCake2Line, RiCloseLine, RiSparklesFill } from 'react-icons/ri';

const UpcomingBirthdaysBanner = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [isDismissed, setIsDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBirthdays = async () => {
    try {
      setLoading(true);
      const data = await fetchUpcomingBirthdays();
      setUpcoming(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching birthdays:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBirthdays();

    const handleUpdate = () => loadBirthdays();
    window.addEventListener('keen_keeper_updated', handleUpdate);
    return () => window.removeEventListener('keen_keeper_updated', handleUpdate);
  }, []);

  if (isDismissed || loading || upcoming.length === 0) {
    return null;
  }

  const nextPerson = upcoming[0];
  const isToday = nextPerson.daysRemaining === 0;

  return (
    <div className="w-11/12 lg:w-9/12 mx-auto mt-6">
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border border-purple-200/80 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* LEFT ICON & MESSAGE */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl shrink-0">
            <RiCake2Line className="text-2xl animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
              <span>
                {isToday
                  ? `🎉 It's ${nextPerson.name}'s Birthday Today!`
                  : `Upcoming Birthday: ${nextPerson.name} (${nextPerson.daysRemaining === 1 ? 'Tomorrow' : `in ${nextPerson.daysRemaining} days`})`}
              </span>
              <RiSparklesFill className="text-purple-500 text-sm hidden sm:inline" />
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {upcoming.length > 1
                ? `Plus ${upcoming.length - 1} more celebration coming up in your inner circles.`
                : 'Send warm wishes or plan a quick coffee hangout to celebrate.'}
            </p>
          </div>
        </div>

        {/* RIGHT AVATARS & QUICK ACTION */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex -space-x-2 overflow-hidden">
            {upcoming.slice(0, 4).map((f) => (
              <Link
                key={f.id}
                href={`/friends/${f.id}`}
                title={`${f.name} - ${f.formattedDate} (${f.daysRemaining === 0 ? 'Today' : `${f.daysRemaining}d`})`}
                className="hover:scale-110 transition z-10 hover:z-20"
              >
                <img
                  src={f.picture}
                  alt={f.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-xs"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </Link>
            ))}
          </div>

          <Link
            href={`/friends/${nextPerson.id}`}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Wish {nextPerson.name.split(' ')[0]} →
          </Link>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-purple-100/50 transition"
            title="Dismiss notification"
          >
            <RiCloseLine className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingBirthdaysBanner;
