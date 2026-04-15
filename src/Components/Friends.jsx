import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Friends = () => {
    const [friendsData, setFriendsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const statusStyles = {
        "overdue": "bg-[#EF4444] text-white",
        "Almost due": "bg-[#EFAD44] text-white",
        "On Track": "bg-[#244D3F] text-white"
    };

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                setLoading(true);
                const res = await fetch('./friends.json');
                const data = await res.json();
                setFriendsData(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, []);

    return (
        <div className='w-9/12 mx-auto my-16'>
            <h1 className='text-3xl font-bold text-[#1F2937]'>
                Your Friends
            </h1>

            {loading ? (
                <div className='flex justify-center items-center mt-10'>
                    <div className='w-10 h-10 border-4 border-gray-300 border-t-[#1F2937] rounded-full animate-spin'></div>
                </div>
            ) : (
                <div className='mt-6 w-full px-5 mx-auto py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {friendsData.map((friend) => (
                        <div
                            key={friend.id}
                            onClick={() => navigate(`/friends/${friend.id}`)}
                            className='flex flex-col border border-gray-300 items-center gap-4 bg-[#E7F6F2] p-4 rounded-lg shadow-sm mt-4 cursor-pointer hover:scale-105 transition'
                        >
                            <img src={friend.picture} alt={friend.name} className='w-12 h-12 rounded-full' />

                            <div className="text-center">
                                <h2 className='text-lg font-semibold'>{friend.name}</h2>
                                
                                <p className="text-sm mt-3 text-gray-500">
                                    {friend.days_since_contact}d ago
                                </p>

                                <p className='mt-2 text-gray-600'>{friend.email}</p>

                                <div className="flex flex-wrap justify-center gap-2 mt-2">
                                    {friend.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="text-xs mt-2 bg-green-200 text-green-800 px-2 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-2">
                                    <span
                                        className={`text-xs font-medium px-3 mt-3 py-1 rounded-full ${statusStyles[friend.status]}`}
                                    >
                                        {friend.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Friends;