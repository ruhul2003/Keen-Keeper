'use client';

import React, { useEffect, useState } from 'react';
import { fetchActivities, deleteActivity } from '../lib/api';
import { PiPhoneCallBold } from 'react-icons/pi';
import { MdOutlineSms } from 'react-icons/md';
import { IoVideocamOutline } from 'react-icons/io5';
import {
  RiCupLine,
  RiGiftLine,
  RiSearchLine,
  RiDeleteBin6Line,
  RiTimeLine,
  RiMapPinLine,
  RiTimeFill,
} from 'react-icons/ri';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Timeline = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'Call', 'Text', 'Video', 'Coffee', 'Gift'];

  const iconMap = {
    Call: <PiPhoneCallBold className="text-green-600 text-xl" />,
    Text: <MdOutlineSms className="text-blue-600 text-xl" />,
    Video: <IoVideocamOutline className="text-purple-600 text-xl" />,
    Coffee: <RiCupLine className="text-amber-600 text-xl" />,
    Gift: <RiGiftLine className="text-pink-600 text-xl" />,
  };

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await fetchActivities({
        type: filter !== 'All' ? filter : undefined,
        search: search.trim() || undefined,
      });
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();

    const handleUpdate = () => loadActivities();
    window.addEventListener('keen_keeper_updated', handleUpdate);
    return () => window.removeEventListener('keen_keeper_updated', handleUpdate);
  }, [filter, search]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteActivity(id);
      setActivities((prev) => prev.filter((item) => item.id !== id));
      toast.info('Activity entry deleted');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('keen_keeper_updated'));
      }
    } catch {
      toast.error('Failed to delete activity');
    }
  };

  return (
    <div className="w-11/12 md:w-9/12 mx-auto my-12">
      <ToastContainer position="top-center" autoClose={1200} hideProgressBar />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#E7F6F2] text-[#244D3F] rounded-lg">
              <RiTimeLine className="text-2xl" />
            </span>
            <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">Interaction Timeline</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Complete chronological record of all touchpoints and relationship check-ins.
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-64">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
          <input
            type="text"
            placeholder="Search activities or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-lg shadow-xs focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
          />
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="my-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition ${
                filter === f
                  ? 'bg-[#244D3F] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-gray-500">
          Showing {activities.length} interactions
        </span>
      </div>

      {/* TIMELINE LIST */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#244D3F] rounded-full animate-spin"></div>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 mt-4">
          <RiTimeLine className="mx-auto text-4xl text-gray-300" />
          <h3 className="mt-2 text-base font-semibold text-gray-800">No {filter === 'All' ? '' : filter} Activity Found</h3>
          <p className="text-xs text-gray-500 mt-1">
            Log your first check-in with a friend to begin building your relationship history.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {activities.map((item) => (
            <div
              key={item.id}
              className="group bg-white p-4.5 rounded-xl shadow-xs border border-gray-100 flex items-start justify-between gap-4 hover:shadow-md hover:border-gray-200 transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-xl mt-0.5 border border-gray-100">
                  {iconMap[item.type] || <RiTimeLine className="text-gray-600 text-xl" />}
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    {item.type} with <span className="text-[#244D3F]">{item.name}</span>
                  </h3>

                  {item.notes && (
                    <p className="text-sm text-gray-600 mt-1 bg-gray-50/80 p-2.5 rounded-lg border border-gray-100">
                      "{item.notes}"
                    </p>
                  )}

                  {/* METADATA CHIPS (DURATION, LOCATION, SENTIMENT) */}
                  {(item.duration || item.location || item.sentiment) && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {item.duration && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          <RiTimeFill className="text-xs text-emerald-600" />
                          {item.duration} mins
                        </span>
                      )}
                      {item.location && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                          <RiMapPinLine className="text-xs text-gray-500" />
                          {item.location}
                        </span>
                      )}
                      {item.sentiment && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
                          <span>
                            {item.sentiment === 'Great' ? '😍' : item.sentiment === 'Good' ? '😊' : item.sentiment === 'Neutral' ? '😐' : '🫂'}
                          </span>
                          {item.sentiment}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-2 font-medium">
                    {item.time || (item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recently')}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => handleDelete(item.id, e)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition"
                title="Delete Activity"
              >
                <RiDeleteBin6Line className="text-base" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Timeline;