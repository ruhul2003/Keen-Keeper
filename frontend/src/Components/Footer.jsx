'use client';

import React, { useState } from 'react';
import { RiInstagramFill, RiDownloadCloud2Line } from "react-icons/ri";
import { FaSquareFacebook, FaXTwitter } from "react-icons/fa6";
import DataExportModal from './DataExportModal';

const Footer = () => {
    const [isExportOpen, setIsExportOpen] = useState(false);

    return (
        <>
            <div className='w-full bg-[#244D3F] py-12 px-4'>
                <div className='max-w-6xl mx-auto text-center'>
                    <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight'>
                        KeenKeeper
                    </h1>

                    <p className='text-gray-300 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed'>
                        Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.
                    </p>

                    <div className='flex flex-wrap items-center justify-center gap-4 mt-6'>
                        <button
                            onClick={() => setIsExportOpen(true)}
                            className='inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl transition border border-white/20'
                        >
                            <RiDownloadCloud2Line className='text-base' />
                            Export Data Backup
                        </button>
                    </div>

                    <div className='flex flex-col items-center mt-8 gap-4'>
                        <h2 className='text-white/80 text-xs uppercase tracking-wider font-semibold'>Connect With Us</h2>

                        <div className='flex gap-3'>
                            <RiInstagramFill className='text-xl sm:text-2xl text-[#244D3F] bg-white w-9 h-9 sm:w-10 sm:h-10 p-2 rounded-full cursor-pointer hover:scale-105 transition' />
                            <FaSquareFacebook className='text-xl sm:text-2xl text-[#244D3F] bg-white w-9 h-9 sm:w-10 sm:h-10 p-2 rounded-full cursor-pointer hover:scale-105 transition' />
                            <FaXTwitter className='text-xl sm:text-2xl text-[#244D3F] bg-white w-9 h-9 sm:w-10 sm:h-10 p-2 rounded-full cursor-pointer hover:scale-105 transition' />
                        </div>
                    </div>

                    <hr className='mt-10 border-white/15' />
                </div>

                <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mt-6 gap-4 text-center md:text-left'>
                    <p className='text-gray-300 text-xs sm:text-sm'>
                        © {new Date().getFullYear()} KeenKeeper. Nurturing intentional friendships.
                    </p>

                    <ul className='flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 text-gray-300 text-xs sm:text-sm'>
                        <li className='cursor-pointer hover:underline'>Privacy Policy</li>
                        <li className='cursor-pointer hover:underline'>Terms of Service</li>
                        <li className='cursor-pointer hover:underline'>Security</li>
                    </ul>
                </div>
            </div>

            <DataExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
        </>
    );
};

export default Footer;