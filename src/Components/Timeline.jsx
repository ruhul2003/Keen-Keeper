import React, { useState } from 'react';
import { PiPhoneCallBold } from "react-icons/pi";
import { MdOutlineSms } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";

const Timeline = () => {

    const [activities] = useState(() => {
        try {
            const data = JSON.parse(localStorage.getItem("timeline"));
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    });

    const [filter, setFilter] = useState("All");

    const filters = ["All", "Call", "Text", "Video"];

    const filtered = filter === "All" 
        ? activities 
        : activities.filter(item => item.type === filter);

    const iconMap = {
        Call: <PiPhoneCallBold className="text-green-600 text-xl" />,
        Text: <MdOutlineSms className="text-blue-600 text-xl" />,
        Video: <IoVideocamOutline className="text-purple-600 text-xl" />
    };

    const filterStyles = {
        All:   { active: "bg-gray-800 text-white",   inactive: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
        Call:  { active: "bg-green-600 text-white",  inactive: "bg-green-50 text-green-700 hover:bg-green-100" },
        Text:  { active: "bg-blue-600 text-white",   inactive: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
        Video: { active: "bg-purple-600 text-white", inactive: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
    };

    return (
        <div className="w-11/12 md:w-9/12 mx-auto my-10">

            <h1 className="text-4xl font-bold mb-5">Timeline</h1>
            <hr className='text-gray-300' />

            {/* FILTER BUTTONS */}
            <div className="flex gap-2 my-5 flex-wrap">
                {filters.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
                            ${filter === f ? filterStyles[f].active : filterStyles[f].inactive}`}
                    >
                        {f === "All" && "All"}
                        {f === "Call" && "📞 Call"}
                        {f === "Text" && "💬 Text"}
                        {f === "Video" && "🎥 Video"}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <p className="text-gray-500 mt-4">No {filter === "All" ? "" : filter} activity yet.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map(item => (
                        <div
                            key={item.id}
                            className="bg-white p-4 rounded-md shadow-sm flex items-center gap-4"
                        >
                            <div>{iconMap[item.type]}</div>
                            <div>
                                <h2 className="font-semibold">
                                    {item.type} with {item.name}
                                </h2>
                                <p className="text-sm text-gray-500">{item.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Timeline;