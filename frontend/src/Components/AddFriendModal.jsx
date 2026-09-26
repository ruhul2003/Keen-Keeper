'use client';

import React, { useState } from 'react';
import { createFriend } from '../lib/api';
import { toast } from 'react-toastify';
import { RiCloseLine, RiUserAddLine, RiImageAddLine } from 'react-icons/ri';

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
];

const PRESET_TAGS = ['CLOSE FRIEND', 'WORK', 'FAMILY', 'COLLEGE', 'GYM', 'TRAVEL', 'TECH'];

const AddFriendModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    picture: DEFAULT_AVATARS[0],
    bio: '',
    goal: 14,
    tags: ['CLOSE FRIEND'],
  });
  const [submitting, setSubmitting] = useState(false);
  const [customTag, setCustomTag] = useState('');

  if (!isOpen) return null;

  const handleTagToggle = (tag) => {
    setFormData((prev) => {
      const exists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: exists ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
      };
    });
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    const cleanTag = customTag.trim().toUpperCase();
    if (cleanTag && !formData.tags.includes(cleanTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, cleanTag] }));
      setCustomTag('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please provide a friend name');
      return;
    }

    try {
      setSubmitting(true);
      await createFriend(formData);
      toast.success(`Added ${formData.name} to your friends shelf!`);

      // Trigger global update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('keen_keeper_updated'));
      }

      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to add friend');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAFBFB]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#E7F6F2] text-[#244D3F] rounded-lg">
              <RiUserAddLine className="text-xl" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Add New Friend</h2>
              <p className="text-xs text-gray-500">Nurture a new relationship cadence</p>
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
          {/* NAME */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Friend's Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Morgan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
            />
          </div>

          {/* EMAIL & PHONE & BIRTHDAY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 012-3456"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                Birthday
              </label>
              <input
                type="date"
                value={formData.birthday || ''}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
              />
            </div>
          </div>

          {/* AVATAR SELECTOR */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
              <span>Avatar Selection</span>
              <span className="text-[11px] text-gray-400 font-normal">Choose preset or paste URL</span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              {DEFAULT_AVATARS.map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar}
                  alt={`preset-${idx}`}
                  onClick={() => setFormData({ ...formData, picture: avatar })}
                  className={`w-10 h-10 rounded-full object-cover cursor-pointer transition ${
                    formData.picture === avatar
                      ? 'ring-3 ring-[#244D3F] scale-105'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
            <input
              type="url"
              placeholder="Or enter image URL"
              value={formData.picture}
              onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#244D3F] focus:outline-none text-gray-600"
            />
          </div>

          {/* CADENCE GOAL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Contact Frequency Goal: Connect every {formData.goal} days
            </label>
            <div className="flex gap-2">
              {[7, 14, 21, 30, 60].map((days) => (
                <button
                  type="button"
                  key={days}
                  onClick={() => setFormData({ ...formData, goal: days })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    formData.goal === days
                      ? 'bg-[#244D3F] text-white border-[#244D3F]'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          {/* BIO */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
              Relationship Note / Bio
            </label>
            <textarea
              rows={2}
              placeholder="How you met, common interests, things to remember..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#244D3F] focus:outline-none"
            />
          </div>

          {/* TAGS */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
              Circles & Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_TAGS.map((tag) => {
                const selected = formData.tags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium transition ${
                      selected
                        ? 'bg-[#244D3F] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Custom tag..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                className="grow px-3 py-1 text-xs border border-gray-200 rounded-md focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-3 py-1 text-xs bg-gray-100 font-semibold rounded-md hover:bg-gray-200"
              >
                + Add Tag
              </button>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
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
              disabled={submitting}
              className="px-5 py-2 text-sm font-bold text-white bg-[#244D3F] hover:bg-[#1b3b30] rounded-lg transition shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Saving Friend...' : 'Save Friend'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFriendModal;
