'use client';

import React, { useState, useEffect } from 'react';
import { updateFriend } from '../lib/api';
import { toast } from 'react-toastify';
import { RiCloseLine, RiEdit2Line } from 'react-icons/ri';

const EditFriendModal = ({ isOpen, onClose, friend, onFriendUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    goal: 14,
    picture: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (friend) {
      setFormData({
        name: friend.name || '',
        email: friend.email || '',
        phone: friend.phone || '',
        bio: friend.bio || '',
        goal: friend.goal || 14,
        picture: friend.picture || '',
        tags: Array.isArray(friend.tags) ? friend.tags : [],
      });
    }
  }, [friend]);

  if (!isOpen || !friend) return null;

  const handleAddTag = (e) => {
    e.preventDefault();
    const clean = tagInput.trim().toUpperCase();
    if (clean && !formData.tags.includes(clean)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, clean] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Friend name is required');
      return;
    }

    try {
      setSaving(true);
      const updated = await updateFriend(friend.id, formData);
      toast.success('Friend details updated successfully!');
      if (onFriendUpdated) onFriendUpdated(updated);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('keen_keeper_updated'));
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update friend');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAFBFB]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#E7F6F2] text-[#244D3F] rounded-lg">
              <RiEdit2Line className="text-xl" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Edit Friend Profile</h2>
              <p className="text-xs text-gray-500">Update contact info and connection goals</p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Picture URL
            </label>
            <input
              type="url"
              value={formData.picture}
              onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Relationship Cadence: Connect every {formData.goal} days
            </label>
            <div className="flex gap-2">
              {[7, 10, 14, 21, 30, 45, 60].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setFormData({ ...formData, goal: d })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    Number(formData.goal) === d
                      ? 'bg-[#244D3F] text-white border-[#244D3F]'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Bio / Notes
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
              Circles & Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs bg-[#E7F6F2] text-[#244D3F] font-semibold px-2.5 py-1 rounded-md"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add new circle tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="grow px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3.5 py-1.5 text-xs bg-[#244D3F] text-white font-semibold rounded-lg hover:bg-[#1a382e]"
              >
                + Add
              </button>
            </div>
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
              {saving ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFriendModal;
