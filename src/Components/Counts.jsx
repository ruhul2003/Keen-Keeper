import React from 'react';

const Counts = () => {
    return (
        <div className='flex flex-row justify-center w-9/12 justify-evenly mx-auto mt-16'>
            <div className='flex flex-col gap-4 items-center bg-[#E7F6F2] py-4 rounded-lg '>
                <h1 className='text-[32px] font-bold text-[#244D3F]'>10</h1>
                <p className='text-gray-600'>Total Friends</p>
            </div>
            <div className='flex flex-col gap-4 items-center justify-center  bg-[#E7F6F2] py-4 rounded-lg '>
                <h1 className='text-[32px] font-bold text-[#244D3F]'>3</h1>
                <p className='text-gray-600'>On Track</p>
            </div>
            <div className='flex flex-col gap-4 items-center justify-center  bg-[#E7F6F2] py-4 rounded-lg '>
                <h1 className='text-[32px] font-bold text-[#244D3F]'>6</h1>
                <p className='text-gray-600'>Need Attention</p>
            </div>
            <div className='flex flex-col gap-4 items-center justify-center  bg-[#E7F6F2] py-4 rounded-lg '>
                <h1 className='text-[32px] font-bold text-[#244D3F]'>12</h1>
                <p className='text-gray-600'>Interaction This Month</p>
            </div>
        </div>
    );
};

export default Counts;