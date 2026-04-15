import React from 'react';
import { RiInstagramFill } from "react-icons/ri";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <div className='w-full bg-[#244D3F] h-[450px] items-center'>
            <div className='w-9/12 mx-auto py-16 items-center'>
                <h1 className='text-7xl font-bold text-center text-white'>KeenKeeper</h1>
                <p className='text-center text-gray-400 text-[16px] mt-4'>Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.</p>

                <div className='flex flex-col gap-4 items-center mt-8'>
                    <h2 className='text-white text-lg'>Social Links</h2>
                    <div className='flex flex-row gap-3'>
                        <RiInstagramFill className='text-3xl text-black bg-white w-[40px] h-[40px] p-2 rounded-full' />
                        <FaSquareFacebook className='text-3xl text-black bg-white w-[40px] h-[40px] p-2 rounded-full' />
                        <FaXTwitter className='text-3xl text-black bg-white w-[40px] h-[40px] p-2 rounded-full' />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;