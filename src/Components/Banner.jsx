import React from 'react';
import { FiPlus } from "react-icons/fi";

const Banner = () => {
    return (
        <div className='w-9/12 items-center flex flex-col mx-auto mt-20'>
            <h1 className='text-5xl font-bold text-[#1F2937]'>Friends to keep close in your life</h1>
            <p className='text-center text-gray-600 text-[16px] mt-4'>Your personal shelf of meaningful connections. Browse, tend, and nurture the <br />
                relationships that matter most.</p>
            
            <button className='bg-[#244D3F] flex items-center gap-2 text-white px-4 py-2 rounded-sm mt-8'><FiPlus /> Add Friend</button>
        </div>
    );
};

export default Banner;