'use client';

import React, { useState } from 'react';
import { fetchFriends, fetchActivities } from '../lib/api';
import { toast } from 'react-toastify';
import {
  RiDownloadCloud2Line,
  RiUploadCloud2Line,
  RiCloseLine,
  RiFileTextLine,
  RiShieldCheckLine,
  RiAlertLine,
  RiCheckLine,
} from 'react-icons/ri';

const DataExportModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('export'); // 'export' | 'import'
  const [downloading, setDownloading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [importMode, setImportMode] = useState('merge'); // 'merge' | 'replace'

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (!json.friends && !json.activities) {
          toast.error('Invalid file: Missing friends or activities records');
          setParsedData(null);
          return;
        }
        setParsedData({
          friendsCount: Array.isArray(json.friends) ? json.friends.length : 0,
          activitiesCount: Array.isArray(json.activities) ? json.activities.length : 0,
          raw: json,
        });
      } catch {
        toast.error('Could not parse JSON file');
        setParsedData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!parsedData || !parsedData.raw) {
      toast.error('Please select a valid backup JSON file');
      return;
    }

    try {
      setImporting(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const res = await fetch(`${API_BASE}/api/backup/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          friends: parsedData.raw.friends || [],
          activities: parsedData.raw.activities || [],
          mode: importMode,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to restore backup in backend');
      }

      toast.success('Backup restored successfully!');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('keen_keeper_updated'));
      }
      onClose();
    } catch (err) {
      console.error('Import error:', err);
      toast.error(err.message || 'Failed to import backup');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAFBFB]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#E7F6F2] text-[#244D3F] rounded-lg">
              {activeTab === 'export' ? (
                <RiDownloadCloud2Line className="text-xl" />
              ) : (
                <RiUploadCloud2Line className="text-xl" />
              )}
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {activeTab === 'export' ? 'Export & Backup Data' : 'Restore Data from Backup'}
              </h2>
              <p className="text-xs text-gray-500">
                {activeTab === 'export'
                  ? 'Download your personal relationship shelf'
                  : 'Restore shelf connections from a JSON file'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <RiCloseLine className="text-2xl" />
          </button>
        </div>

        {/* TAB TOGGLE */}
        <div className="flex border-b border-gray-100 px-6 pt-3 bg-gray-50/50">
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-2.5 text-xs font-bold transition border-b-2 mr-6 ${
              activeTab === 'export'
                ? 'border-[#244D3F] text-[#244D3F]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Export Backup
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`pb-2.5 text-xs font-bold transition border-b-2 ${
              activeTab === 'import'
                ? 'border-[#244D3F] text-[#244D3F]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Restore / Import
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {activeTab === 'export' ? (
            <>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                  <RiFileTextLine className="text-base text-[#244D3F]" />
                  <span>What is included in the backup:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-gray-500">
                  <li>All friend profiles, tags, cadences, and birthdays</li>
                  <li>Complete interaction timeline history and durations</li>
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
            </>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-900 space-y-2">
                <p className="font-semibold">Upload a previously exported KeenKeeper JSON backup file:</p>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#244D3F] file:text-white hover:file:bg-[#1a382e] cursor-pointer"
                />
              </div>

              {parsedData && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
                  <RiCheckLine className="text-lg text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Backup file recognized:</span>
                    <p className="mt-0.5">
                      Contains <strong>{parsedData.friendsCount} friends</strong> and{' '}
                      <strong>{parsedData.activitiesCount} interactions</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* RESTORE MODE */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Restore Strategy
                </label>
                <div className="flex gap-4 text-xs text-gray-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="restoreMode"
                      value="merge"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="text-[#244D3F]"
                    />
                    <span>Merge & Update</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-amber-800">
                    <input
                      type="radio"
                      name="restoreMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-amber-600"
                    />
                    <span>Replace Entire Shelf</span>
                  </label>
                </div>
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
                  disabled={importing || !parsedData}
                  onClick={handleImport}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-[#244D3F] hover:bg-[#1a382e] rounded-xl transition shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  <RiUploadCloud2Line className="text-base" />
                  {importing ? 'Restoring...' : 'Restore Data'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataExportModal;
