import React, { useState } from 'react';
import { PiPhoneCallBold } from "react-icons/pi";
import { MdOutlineSms } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";

const Timeline = () => {

    // ✅ Load data safely (no useEffect warning)
    const [activities, setActivities] = useState(() => {
        try {
            const data = JSON.parse(localStorage.getItem("timeline"));
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    });

    // ✅ Icon mapping
    const iconMap = {
        Call: <PiPhoneCallBold className="text-green-600 text-xl" />,
        Text: <MdOutlineSms className="text-blue-600 text-xl" />,
        Video: <IoVideocamOutline className="text-purple-600 text-xl" />
    };

    return (
        <div className="w-11/12 md:w-9/12 mx-auto my-10">

            <h1 className="text-2xl font-bold mb-5">Timeline</h1>

            {
                activities.length === 0 ? (
                    <p>No activity yet</p>
                ) : (
                    <div className="flex flex-col gap-3">

                        {
                            activities.map(item => (
                                <div 
                                    key={item.id} 
                                    className="bg-white p-4 rounded-md shadow-sm flex items-center gap-4"
                                >

                                    {/* ICON */}
                                    <div>
                                        {iconMap[item.type]}
                                    </div>

                                    {/* TEXT */}
                                    <div>
                                        <h2 className="font-semibold">
                                            {item.type} with {item.name}
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            {item.time}
                                        </p>
                                    </div>

                                </div>
                            ))
                        }

                    </div>
                )
            }

        </div>
    );
};

export default Timeline;