'use client';

import React, { useState } from 'react';
import { PiPhoneCallBold } from "react-icons/pi";
import { MdOutlineSms } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";

const Timeline = () => {

    // Load activities from localStorage
    const [activities] = useState(() => {
        if (typeof window === 'undefined') return [];
        try {
            const data = JSON.parse(localStorage.getItem("timeline"));
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    });

    // Filter state
    const [filter, setFilter] = useState("All");

    // Filter options
    const filters = ["All", "Call", "Text", "Video"];

    // Apply filtering
    const filtered = filter === "All" 
        ? activities 
        : activities.filter(item => item.type === filter);

    // Icons map
    const iconMap = {
        Call: <PiPhoneCallBold className="text-green-600 text-xl" />,
        Text: <MdOutlineSms className="text-blue-600 text-xl" />,
        Video: <IoVideocamOutline className="text-purple-600 text-xl" />
    };

    return (
        <div className="w-11/12 md:w-9/12 mx-auto my-10">

            <h1 className="text-4xl font-bold mb-5">Timeline</h1>
            <hr className='text-gray-300' />

            {/* DROPDOWN FILTER */}
            <div className="my-5">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-8 py-2 border rounded-md outline-none bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {filters.map(f => (
                        <option key={f} value={f}>
                            {f}
                        </option>
                    ))}
                </select>
            </div>

            {/* EMPTY STATE */}
            {filtered.length === 0 ? (
                <p className="text-gray-500 mt-4">
                    No {filter === "All" ? "" : filter} Activity Yet.
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map(item => (
                        <div
                            key={item.id}
                            className="bg-white p-4 rounded-md shadow-sm flex items-center gap-4 border border-gray-100"
                        >
                            <div>{iconMap[item.type]}</div>
                            <div>
                                <h2 className="font-semibold">
                                    {item.type} with {item.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {item.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Timeline;