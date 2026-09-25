'use client';

import React, { useState } from 'react';
import { fetchFriends, fetchActivities } from '../lib/api';
import { toast } from 'react-toastify';
import { RiDownloadCloud2Line, RiCloseLine, RiFileTextLine, RiShieldCheckLine } from 'react-icons/ri';

const DataExportModal = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setDownloading(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      let exportPayload = null;

      try {
        const res = await fetch(`${API_BASE}/api/backup/export`);
        if (res.ok) {
          exportPayload = await res.json();
        }
      } catch (e) {
        console.warn('Backend export unavailable, aggregating locally:', e);
      }

      if (!exportPayload) {
        const friends = await fetchFriends();
        const activities = await fetchActivities();
        exportPayload = {
          app: 'Keen-Keeper',
          version: '1.0.0',
          database: 'Keen-Keeper',
          exportDate: new Date().toISOString(),
          counts: { friends: friends.length, activities: activities.length },
          friends,
          activities,
        };
      }

      // Trigger client-side JSON download
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `keen-keeper-backup-${new Date().toISOString().split('T')[0]}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success('Backup file exported successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to export data backup');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAFBFB]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#E7F6F2] text-[#244D3F] rounded-lg">
              <RiDownloadCloud2Line className="text-xl" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Export & Backup Data</h2>
              <p className="text-xs text-gray-500">Download your personal relationship shelf</p>
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
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <RiFileTextLine className="text-base text-[#244D3F]" />
              <span>What is included in the backup:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-gray-500">
              <li>All friend profiles, tags, and contact goals</li>
              <li>Complete interaction timeline history and touchpoints</li>
              <li>Personal memory notes and journal entries</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <RiShieldCheckLine className="text-emerald-600 text-base shrink-0" />
            <span>
              Your data remains completely private. The exported JSON file is stored locally on your device.
            </span>
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
              disabled={downloading}
              onClick={handleExport}
              className="px-5 py-2.5 text-sm font-bold text-white bg-[#244D3F] hover:bg-[#1a382e] rounded-xl transition shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              <RiDownloadCloud2Line className="text-base" />
              {downloading ? 'Preparing...' : 'Download JSON Backup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExportModal;
