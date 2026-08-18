'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { RiAlarmSnoozeLine } from "react-icons/ri";
import { FaBoxArchive } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { PiPhoneCallBold } from "react-icons/pi";
import { MdOutlineSms } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";
import { toast, ToastContainer } from 'react-toastify';
import { ImCheckboxChecked } from "react-icons/im";

const FriendDetails = () => {
    const params = useParams();
    const id = params?.id;
    const [friend, setFriend] = useState(null);

    const saveToTimeline = (type) => {
        if (!friend) return;
        const newActivity = {
            id: Date.now(), 
            name: friend.name,
            type: type, 
            time: new Date().toLocaleString()
        };

        try {
            const existing = JSON.parse(localStorage.getItem("timeline")) || [];
            existing.unshift(newActivity); 
            localStorage.setItem("timeline", JSON.stringify(existing));
        } catch (e) {
            console.error("Error saving timeline activity", e);
        }
    };

    const call = () => {
        if (!friend) return;
        saveToTimeline("Call");

        toast.success(
            <div className="flex items-center gap-2">
                <ImCheckboxChecked className="text-white text-lg" />
                <span className='font-semibold text-black'>Call with {friend.name}</span>
            </div>
        );
    };

    const text = () => {
        if (!friend) return;
        saveToTimeline("Text");

        toast.success(
            <div className="flex items-center gap-2">
                <ImCheckboxChecked className="text-white text-lg" />
                <span className='font-semibold text-black'>Message with {friend.name}</span>
            </div>
        );
    };

    const video = () => {
        if (!friend) return;
        saveToTimeline("Video");

        toast.success(
            <div className="flex items-center gap-2">
                <ImCheckboxChecked className="text-white text-lg" />
                <span className='font-semibold text-black'>Video Call with {friend.name}</span>
            </div>
        );
    };

    const statusStyles = {
        "overdue": "bg-[#EF4444] text-white",
        "Almost due": "bg-[#EFAD44] text-white",
        "On Track": "bg-[#244D3F] text-white"
    };

    useEffect(() => {
        if (!id) return;
        fetch('/friends.json')
            .then(res => res.json())
            .then(data => {
                const foundFriend = data.find(f => f.id === parseInt(id, 10));
                setFriend(foundFriend);
            })
            .catch(err => console.error("Error fetching friend details", err));
    }, [id]);

    if (!friend) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className='bg-[#eee1e1] w-full lg:w-9/12 mx-auto my-6 lg:my-10 flex flex-col lg:flex-row gap-6 rounded-md py-6 px-4 lg:px-10'>

            <ToastContainer position="top-center" autoClose={1200} hideProgressBar />

            {/* LEFT COLUMN */}
            <div className='flex flex-col w-full lg:w-[320px]'>

                <div className="bg-white w-full min-h-[350px] px-6 py-6 rounded-lg text-center flex flex-col">
                    <img src={friend.picture} alt={friend.name} className="w-24 h-24 rounded-full mx-auto object-cover" />

                    <h1 className="text-2xl font-bold mt-4">
                        {friend.name}
                    </h1>

                    <div className="my-3">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[friend.status] || 'bg-gray-400 text-white'}`}>
                            {friend.status}
                        </span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                        {friend.tags?.map((tag, index) => (
                            <span key={index} className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <p className="text-gray-600 text-sm mb-1">
                        {friend.bio}
                    </p>

                    <p className="text-sm text-gray-500 break-all">
                        {friend.email}
                    </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 mt-4">
                    <button className='flex-1 flex items-center gap-2 justify-center font-bold bg-white rounded-md px-4 py-3 hover:scale-[1.02] transition'>
                        <RiAlarmSnoozeLine /> Snooze
                    </button>

                    <button className='flex-1 flex items-center gap-2 justify-center font-bold bg-white rounded-md px-4 py-3 hover:scale-[1.02] transition'>
                        <FaBoxArchive /> Archive
                    </button>

                    <button className='flex-1 flex items-center gap-2 justify-center font-bold text-red-400 bg-white rounded-md px-4 py-3 hover:scale-[1.02] transition'>
                        <FaTrashAlt /> Delete
                    </button>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className='flex-1 flex flex-col'>

                {/* STATS */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <div className='text-center bg-white rounded-md p-4 flex flex-col justify-center'>
                        <h1 className='text-2xl lg:text-[30px] text-[#244D3F] font-semibold'>
                            {friend.days_since_contact}
                        </h1>
                        <p className='text-gray-500 font-semibold text-sm'>
                            Days Since Contact
                        </p>
                    </div>

                    <div className='text-center bg-white rounded-md p-4 flex flex-col justify-center'>
                        <h1 className='text-2xl lg:text-[30px] text-[#244D3F] font-semibold'>
                            {friend.goal}
                        </h1>
                        <p className='text-gray-500 font-semibold text-sm'>
                            Goal (Days)
                        </p>
                    </div>

                    <div className='text-center bg-white rounded-md p-4 flex flex-col justify-center'>
                        <h1 className='text-2xl lg:text-[30px] text-[#244D3F] font-semibold'>
                            {friend.next_due_date}
                        </h1>
                        <p className='text-gray-500 font-semibold text-sm'>
                            Next Due
                        </p>
                    </div>
                </div>

                {/* GOAL */}
                <div className='w-full p-6 bg-white rounded-md mt-5'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-[18px] lg:text-[20px] font-semibold'>
                            Relationship Goal
                        </h1>
                        <button className='px-3 py-1 bg-[#FAF8FC] border border-gray-300 font-semibold rounded-sm text-sm'>
                            Edit
                        </button>
                    </div>

                    <p className='text-base lg:text-lg font-semibold mt-3 text-gray-600'>
                        Connect every {friend.goal} days
                    </p>
                </div>

                {/* QUICK CHECK-IN */}
                <div className='w-full flex flex-col bg-white mt-5 p-5 rounded-md'>

                    <h1 className='text-[18px] lg:text-[20px] font-semibold text-[#244D3F] mb-4'>
                        Quick Check-In
                    </h1>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>

                        <div onClick={call} className='flex flex-col items-center gap-3 bg-[#eee1e1] p-4 rounded-md hover:bg-[#e6d9d9] cursor-pointer'>
                            <PiPhoneCallBold className='text-[#244D3F] text-[28px] lg:text-[32px]' />
                            <p className='font-semibold'>Call</p>
                        </div>

                        <div onClick={text} className='flex flex-col items-center gap-3 bg-[#eee1e1] p-4 rounded-md hover:bg-[#e6d9d9] cursor-pointer'>
                            <MdOutlineSms className='text-[#244D3F] text-[28px] lg:text-[32px]' />
                            <p className='font-semibold'>Text</p>
                        </div>

                        <div onClick={video} className='flex flex-col items-center gap-3 bg-[#eee1e1] p-4 rounded-md hover:bg-[#e6d9d9] cursor-pointer'>
                            <IoVideocamOutline className='text-[#244D3F] text-[28px] lg:text-[32px]' />
                            <p className='font-semibold'>Video Call</p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default FriendDetails;