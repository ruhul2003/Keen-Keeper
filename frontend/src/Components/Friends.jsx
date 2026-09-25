'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { fetchFriends } from '../lib/api';
import { RiSearchLine, RiFilter3Line, RiSortAsc, RiUserSmileLine } from 'react-icons/ri';

const Friends = () => {
  const [friendsData, setFriendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const router = useRouter();

  const statusStyles = {
    overdue: 'bg-[#EF4444] text-white',
    'Almost due': 'bg-[#EFAD44] text-white',
    'On Track': 'bg-[#244D3F] text-white',
    Snoozed: 'bg-indigo-500 text-white',
  };

  const loadFriends = async () => {
    try {
      setLoading(true);
      const data = await fetchFriends({
        search: searchTerm,
        status: selectedStatus,
        tag: selectedTag,
        sort: sortBy !== 'default' ? sortBy : undefined,
      });
      setFriendsData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();

    const handleUpdate = () => loadFriends();
    window.addEventListener('keen_keeper_updated', handleUpdate);
    return () => window.removeEventListener('keen_keeper_updated', handleUpdate);
  }, [searchTerm, selectedStatus, selectedTag, sortBy]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    friendsData.forEach((f) => {
      if (Array.isArray(f.tags)) {
        f.tags.forEach((t) => tagsSet.add(t));
      }
    });
    return Array.from(tagsSet);
  }, [friendsData]);

  const statuses = ['All', 'On Track', 'Almost due', 'overdue'];

  return (
    <div className="w-11/12 lg:w-9/12 mx-auto my-14">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">Your Friends</h1>
          <p className="text-gray-500 text-sm mt-1">
            Keep track of who you haven't spoken with lately and stay connected.
          </p>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full md:w-72">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search by name, bio, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#244D3F] focus:border-transparent transition"
          />
        </div>
      </div>

      {/* FILTER & SORT TOOLBAR */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
        {/* STATUS PILLS */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1 hidden sm:inline-block">
            Status:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                selectedStatus === st
                  ? 'bg-[#244D3F] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* TAG & SORT CONTROLS */}
        <div className="flex items-center gap-3 ml-auto">
          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <RiFilter3Line className="text-gray-400 text-base" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#244D3F]"
              >
                <option value="All">All Circles</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <RiSortAsc className="text-gray-400 text-base" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#244D3F]"
            >
              <option value="default">Sort by Order</option>
              <option value="urgency">Most Overdue</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="goal">Goal Frequency</option>
            </select>
          </div>
        </div>
      </div>

      {/* FRIENDS GRID */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#244D3F] rounded-full animate-spin"></div>
        </div>
      ) : friendsData.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200 mt-6">
          <RiUserSmileLine className="mx-auto text-4xl text-gray-300" />
          <h3 className="mt-2 text-base font-semibold text-gray-800">No friends found</h3>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm || selectedStatus !== 'All'
              ? 'Try adjusting your filters or search terms.'
              : 'Add your first friend using the button above!'}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {friendsData.map((friend) => (
            <div
              key={friend.id || friend._id}
              onClick={() => router.push(`/friends/${friend.id || friend._id}`)}
              className="group flex flex-col justify-between border border-gray-200/80 bg-white p-5 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer relative"
            >
              {/* STATUS BADGE */}
              <div className="absolute top-3.5 right-3.5">
                <span
                  className={`text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full ${
                    statusStyles[friend.status] || 'bg-gray-400 text-white'
                  }`}
                >
                  {friend.status}
                </span>
              </div>

              <div>
                <img
                  src={friend.picture}
                  alt={friend.name}
                  className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-[#244D3F]/10 group-hover:ring-[#244D3F]/30 transition"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  }}
                />

                <div className="text-center mt-3">
                  <h2 className="text-lg font-bold text-gray-800 group-hover:text-[#244D3F] transition">
                    {friend.name}
                  </h2>

                  <p className="text-xs font-medium text-gray-500 mt-1">
                    {friend.days_since_contact === 0
                      ? 'Contacted today'
                      : `${friend.days_since_contact}d since contact`}
                  </p>

                  <p className="text-xs text-gray-400 mt-1 truncate px-2">{friend.email}</p>

                  {/* TAGS */}
                  <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                    {(friend.tags || []).slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-[10px] uppercase font-semibold bg-[#E7F6F2] text-[#244D3F] px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* FOOTER CADENCE GOAL */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Goal: {friend.goal || 14}d</span>
                <span className="text-[#244D3F] font-semibold group-hover:underline">
                  View Shelf →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;