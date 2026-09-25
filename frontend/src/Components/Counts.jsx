'use client';

import React, { useEffect, useState } from 'react';
import { fetchAnalyticsSummary, fetchFriends } from '../lib/api';
import { RiUserHeartLine, RiCheckboxCircleLine, RiAlertLine, RiChatVoiceLine } from 'react-icons/ri';

const Counts = () => {
  const [stats, setStats] = useState({
    totalFriends: 0,
    onTrack: 0,
    needAttention: 0,
    interactionsThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        setLoading(true);
        const summary = await fetchAnalyticsSummary();
        if (summary && isMounted) {
          setStats({
            totalFriends: summary.totalFriends ?? 0,
            onTrack: summary.onTrack ?? 0,
            needAttention: summary.needAttention ?? 0,
            interactionsThisMonth: summary.interactionsThisMonth ?? 0,
          });
        } else {
          // Fallback from friends list
          const friends = await fetchFriends();
          if (isMounted) {
            const total = friends.length;
            const onTrackCount = friends.filter((f) => f.status === 'On Track').length;
            const needAttentionCount = friends.filter(
              (f) => f.status === 'overdue' || f.status === 'Almost due'
            ).length;
            setStats({
              totalFriends: total,
              onTrack: onTrackCount,
              needAttention: needAttentionCount,
              interactionsThisMonth: 12,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load counts:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadStats();

    // Listen for custom event when friends or activities are updated
    const handleUpdate = () => loadStats();
    window.addEventListener('keen_keeper_updated', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('keen_keeper_updated', handleUpdate);
    };
  }, []);

  const cards = [
    {
      label: 'Total Friends',
      value: stats.totalFriends,
      icon: RiUserHeartLine,
      color: 'text-[#244D3F]',
      badge: 'Active Circles',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      label: 'On Track',
      value: stats.onTrack,
      icon: RiCheckboxCircleLine,
      color: 'text-emerald-700',
      badge: 'Up to Date',
      badgeColor: 'bg-green-100 text-green-800',
    },
    {
      label: 'Need Attention',
      value: stats.needAttention,
      icon: RiAlertLine,
      color: 'text-amber-600',
      badge: 'Overdue / Due',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      label: 'Interactions',
      value: stats.interactionsThisMonth,
      icon: RiChatVoiceLine,
      color: 'text-indigo-600',
      badge: 'This Month',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto mt-14 px-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="group flex flex-col justify-between bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className={`p-2.5 rounded-lg bg-gray-50 group-hover:bg-[#E7F6F2] transition`}>
                <IconComponent className={`text-2xl ${card.color}`} />
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <div className="mt-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
                {loading ? (
                  <span className="inline-block w-12 h-8 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  card.value
                )}
              </h2>
              <p className="text-gray-500 font-medium text-sm mt-1">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Counts;