import React from 'react';
import { RiInstagramFill } from "react-icons/ri";
import { FaSquareFacebook, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <div className='w-full bg-[#244D3F] py-10 px-4'>

            <div className='max-w-6xl mx-auto text-center'>
                <h1 className='text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white'>
                    KeenKeeper
                </h1>

                <p className='text-gray-400 text-sm sm:text-base mt-4 px-2 sm:px-0'>
                    Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.
                </p>

                <div className='flex flex-col items-center mt-8 gap-4'>
                    <h2 className='text-white text-base sm:text-lg'>Social Links</h2>

                    <div className='flex gap-3'>
                        <RiInstagramFill className='text-xl sm:text-2xl md:text-3xl text-black bg-white w-9 h-9 sm:w-10 sm:h-10 p-2 rounded-full' />
                        <FaSquareFacebook className='text-xl sm:text-2xl md:text-3xl text-black bg-white w-9 h-9 sm:w-10 sm:h-10 p-2 rounded-full' />
                        <FaXTwitter className='text-xl sm:text-2xl md:text-3xl text-black bg-white w-9 h-9 sm:w-10 sm:h-10 p-2 rounded-full' />
                    </div>
                </div>

                <hr className='mt-10 border-gray-600' />
            </div>

            <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mt-6 gap-4 text-center md:text-left'>
                
                <p className='text-gray-400 text-sm sm:text-base'>
                    © 2023 KeenKeeper. All rights reserved.
                </p>

                <ul className='flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 text-gray-400 text-sm sm:text-base'>
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                    <li>Cookies</li>
                </ul>
            </div>

        </div>
    );
};

export default Footer;