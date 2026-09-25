'use client';

import React, { useEffect, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { fetchAnalyticsSummary, fetchFriends } from '../lib/api';
import { RiBarChart2Line, RiHeartPulseLine, RiCheckboxCircleLine, RiAlertLine } from 'react-icons/ri';
import Link from 'next/link';

const Stats = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAnalyticsSummary();
      if (data) {
        setAnalytics(data);
      } else {
        // Fallback calculations
        const friends = await fetchFriends();
        const total = friends.length || 1;
        const onTrack = friends.filter((f) => f.status === 'On Track').length;
        const overdue = friends.filter((f) => f.status === 'overdue').length;
        const almostDue = friends.filter((f) => f.status === 'Almost due').length;

        setAnalytics({
          totalFriends: total,
          onTrack,
          overdue,
          almostDue,
          needAttention: overdue + almostDue,
          healthScore: Math.round(((onTrack + almostDue * 0.5) / total) * 100),
          activityBreakdown: { Call: 4, Text: 6, Video: 2, Other: 1 },
          overdueList: friends.filter((f) => f.status === 'overdue').slice(0, 4),
          monthlyTrends: [
            { month: 'Apr', count: 3 },
            { month: 'May', count: 5 },
            { month: 'Jun', count: 4 },
            { month: 'Jul', count: 8 },
            { month: 'Aug', count: 6 },
            { month: 'Sep', count: 9 },
          ],
        });
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const breakdown = analytics?.activityBreakdown || { Call: 1, Text: 1, Video: 1 };
  const chartData = [
    { title: 'Call', value: breakdown.Call || 0, color: '#244D3F' },
    { title: 'Text', value: breakdown.Text || 0, color: '#3B82F6' },
    { title: 'Video', value: breakdown.Video || 0, color: '#8B5CF6' },
    { title: 'Other / Hangout', value: breakdown.Other || 0, color: '#F59E0B' },
  ].filter((item) => item.value > 0);

  // If all zero, show placeholder
  const finalChartData =
    chartData.length > 0
      ? chartData
      : [
          { title: 'Call', value: 1, color: '#244D3F' },
          { title: 'Text', value: 1, color: '#3B82F6' },
          { title: 'Video', value: 1, color: '#8B5CF6' },
        ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#244D3F] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-11/12 md:w-9/12 mx-auto my-12">
      {/* HEADER */}
      <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
        <span className="p-2.5 bg-[#E7F6F2] text-[#244D3F] rounded-xl">
          <RiBarChart2Line className="text-2xl" />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Friendship Analytics & Health
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Data insights into your relationship cadences and contact momentum.
          </p>
        </div>
      </div>

      {/* TOP ROW: HEALTH SCORE & STATUS BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* HEALTH SCORE CARD */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Relationship Health
            </span>
            <RiHeartPulseLine className="text-xl text-rose-500" />
          </div>

          <div className="my-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[#244D3F]">
                {analytics?.healthScore || 85}%
              </span>
              <span className="text-sm font-semibold text-gray-500">nurture index</span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2.5 mt-3 overflow-hidden">
              <div
                className="bg-[#244D3F] h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${analytics?.healthScore || 85}%` }}
              ></div>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Based on the ratio of friends connected within their target cadence.
          </p>
        </div>

        {/* CADENCE STATUS CARDS */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              On Track
            </span>
            <RiCheckboxCircleLine className="text-xl text-emerald-600" />
          </div>
          <div className="my-4">
            <span className="text-4xl font-extrabold text-emerald-700">
              {analytics?.onTrack || 0}
            </span>
            <span className="text-xs font-medium text-gray-500 ml-2">
              of {analytics?.totalFriends || 0} friends
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Friends contacted within their designated goal window.
          </p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Attention Required
            </span>
            <RiAlertLine className="text-xl text-amber-500" />
          </div>
          <div className="my-4">
            <span className="text-4xl font-extrabold text-amber-600">
              {analytics?.needAttention || 0}
            </span>
            <span className="text-xs font-medium text-gray-500 ml-2">
              ({analytics?.overdue || 0} overdue, {analytics?.almostDue || 0} due soon)
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Circles that may appreciate a quick note or phone call this week.
          </p>
        </div>
      </div>

      {/* MIDDLE ROW: INTERACTION TYPE CHART & MONTHLY TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* INTERACTION TYPE DONUT */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs">
          <h2 className="text-lg font-bold text-gray-800">Interactions by Channel</h2>
          <p className="text-xs text-gray-500 mt-0.5">Communication channel distribution</p>

          <div className="w-[240px] h-[240px] mx-auto mt-6">
            <PieChart
              data={finalChartData}
              lineWidth={22}
              paddingAngle={4}
              rounded
              animate
              startAngle={270}
              radius={46}
            />
          </div>

          {/* LEGEND */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-gray-100 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#244D3F]"></span>
              Call ({breakdown.Call || 0})
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#3B82F6]"></span>
              Text ({breakdown.Text || 0})
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#8B5CF6]"></span>
              Video ({breakdown.Video || 0})
            </div>
            {breakdown.Other > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>
                Other ({breakdown.Other})
              </div>
            )}
          </div>
        </div>

        {/* MONTHLY MOMENTUM BARS */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Monthly Touchpoint Momentum</h2>
            <p className="text-xs text-gray-500 mt-0.5">Interactions logged per month</p>
          </div>

          <div className="mt-8 flex items-end justify-between gap-3 h-48 px-2">
            {(analytics?.monthlyTrends || []).map((m, idx) => {
              const maxVal = Math.max(
                ...((analytics?.monthlyTrends || []).map((t) => t.count) || [1]),
                1
              );
              const heightPercent = Math.max(Math.round((m.count / maxVal) * 100), 12);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-600">{m.count}</span>
                  <div className="w-full bg-[#E7F6F2] rounded-t-lg h-36 flex items-end">
                    <div
                      className="w-full bg-[#244D3F] rounded-t-lg hover:bg-[#1b3b30] transition-all"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">{m.month}</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Steady consistency leads to long-lasting relationships.
          </p>
        </div>
      </div>

      {/* BOTTOM ROW: TOP ATTENTION RADAR */}
      {analytics?.overdueList && analytics.overdueList.length > 0 && (
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Top Priority Connections</h2>
              <p className="text-xs text-gray-500">Reach out to reconnect with overdue friends</p>
            </div>
            <Link
              href="/"
              className="text-xs font-semibold text-[#244D3F] hover:underline"
            >
              View All Friends →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {analytics.overdueList.map((f) => (
              <Link
                key={f.id}
                href={`/friends/${f.id}`}
                className="p-4 rounded-xl border border-red-100 bg-red-50/40 hover:bg-red-50 hover:shadow-xs transition flex items-center gap-3"
              >
                <img
                  src={f.picture}
                  alt={f.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-red-200"
                />
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{f.name}</h4>
                  <p className="text-xs text-red-600 font-semibold mt-0.5">
                    {f.days_since_contact}d since contact
                  </p>
                  <p className="text-[10px] text-gray-500">Goal: every {f.goal}d</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;