import React, { useEffect, useState } from 'react'; // React hooks
import { useParams } from 'react-router-dom'; // to get URL params
import { RiAlarmSnoozeLine } from "react-icons/ri"; // snooze icon
import { FaBoxArchive } from "react-icons/fa6"; // archive icon
import { FaTrashAlt } from "react-icons/fa"; // trash icon
import { PiPhoneCallBold } from "react-icons/pi"; // call icon
import { MdOutlineSms } from "react-icons/md"; // sms icon
import { IoVideocamOutline } from "react-icons/io5"; // video icon

const FriendDetails = () => {
    const { id } = useParams(); // get friend id from route
    const [friend, setFriend] = useState(null); // store friend data

    // status color mapping
    const statusStyles = {
        "overdue": "bg-[#EF4444] text-white",
        "Almost due": "bg-[#EFAD44] text-white",
        "On Track": "bg-[#244D3F] text-white"
    };

    // fetch friend data
    useEffect(() => {
        fetch('/friends.json')
            .then(res => res.json())
            .then(data => {
                const foundFriend = data.find(f => f.id === parseInt(id));
                setFriend(foundFriend);
            });
    }, [id]);

    // loading state
    if (!friend) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className='bg-[#E9E9E9] w-9/12 mx-auto my-10 flex gap-6 rounded-md py-10 px-10'>

            {/* LEFT COLUMN */}
            <div className='flex flex-col w-[320px] flex-shrink-0'>

                {/* PROFILE CARD (FIXED SIZE) */}
                <div className="bg-white w-full min-h-[350px] px-6 py-6 rounded-lg text-center flex flex-col">

                    {/* profile image */}
                    <img src={friend.picture} className="w-24 h-24 rounded-full mx-auto" />

                    {/* name */}
                    <h1 className="text-2xl font-bold mt-4">
                        {friend.name}
                    </h1>

                    {/* status */}
                    <div className="my-3">
                        <span
                            className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[friend.status]}`}
                        >
                            {friend.status}
                        </span>
                    </div>

                    {/* tags (fixed spacing) */}
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                        {friend.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* bio */}
                    <p className="text-gray-600 text-[16px] mb-1">
                        {friend.bio}
                    </p>

                    {/* email */}
                    <p className="text-[16px] text-gray-500 break-all mt-0">
                        {friend.email}
                    </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-2 mt-4">
                    <button className='flex items-center gap-2 justify-center font-bold bg-white rounded-md px-4 py-3 hover:scale-[1.02] transition'>
                        <RiAlarmSnoozeLine /> Snooze 2 weeks
                    </button>

                    <button className='flex items-center gap-2 justify-center font-bold bg-white rounded-md px-4 py-3 hover:scale-[1.02] transition'>
                        <FaBoxArchive /> Archive
                    </button>

                    <button className='flex items-center gap-2 justify-center font-bold text-red-400 bg-white rounded-md px-4 py-3 hover:scale-[1.02] transition'>
                        <FaTrashAlt /> Delete
                    </button>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className='flex-1 items-center justify-center'>

                {/* STATS ROW */}
                <div className='flex gap-5'>

                    <div className='flex-1 text-center bg-white rounded-md p-4 min-h-[120px] flex flex-col justify-center'>
                        <h1 className='text-[30px] text-[#244D3F] font-semibold'>
                            {friend.days_since_contact}
                        </h1>
                        <p className='text-gray-500 font-semibold'>
                            Days Since Contact
                        </p>
                    </div>

                    <div className='flex-1 text-center bg-white rounded-md p-4 min-h-[120px] flex flex-col justify-center'>
                        <h1 className='text-[30px] text-[#244D3F] font-semibold'>
                            {friend.goal}
                        </h1>
                        <p className='text-gray-500 font-semibold'>
                            Goal (Days)
                        </p>
                    </div>

                    <div className='flex-1 text-center bg-white rounded-md p-4 min-h-[120px] flex flex-col justify-center'>
                        <h1 className='text-[20px] text-[#244D3F] font-semibold'>
                            {friend.next_due_date}
                        </h1>
                        <p className='text-gray-500 font-semibold'>
                            Next Due
                        </p>
                    </div>
                </div>

                {/* RELATIONSHIP GOAL */}
                <div className='w-full p-6 bg-white rounded-md mt-5'>
                    <div className='flex justify-between'>
                        <h1 className='text-[20px] font-semibold'>
                            Relationship Goal
                        </h1>
                        <button className='px-3 py-1 bg-[#FAF8FC] border border-gray-200 font-semibold rounded-sm'>
                            Edit
                        </button>
                    </div>

                    <p className='text-lg font-semibold mt-3 text-gray-600'>
                        Connect every {friend.goal} days
                    </p>
                </div>

                {/* QUICK CHECK-IN */}
                <div className='w-full flex flex-col bg-white mt-5 p-5 rounded-md'>

                    <h1 className='text-[20px] font-semibold text-[#244D3F] mb-4'>
                        Quick Check-In
                    </h1>

                    <div className='flex gap-4'>

                        <div className='flex-1 flex flex-col items-center gap-3 bg-[#FAF8FC] p-4 rounded-md'>
                            <PiPhoneCallBold className='text-[#244D3F] text-[32px]' />
                            <p className='font-semibold'>Call</p>
                        </div>

                        <div className='flex-1 flex flex-col items-center gap-3 bg-[#FAF8FC] p-4 rounded-md'>
                            <MdOutlineSms className='text-[#244D3F] text-[32px]' />
                            <p className='font-semibold'>Text</p>
                        </div>

                        <div className='flex-1 flex flex-col items-center gap-3 bg-[#FAF8FC] p-4 rounded-md'>
                            <IoVideocamOutline className='text-[#244D3F] text-[32px]' />
                            <p className='font-semibold'>Video</p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default FriendDetails;