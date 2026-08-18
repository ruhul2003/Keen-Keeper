import React from 'react';

const Counts = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto mt-16 px-4">
            <div className="flex flex-col gap-3 items-center bg-[#E7F6F2] py-6 rounded-lg shadow-sm">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#244D3F]">10</h1>
                <p className="text-gray-600 text-sm sm:text-base">Total Friends</p>
            </div>

            <div className="flex flex-col gap-3 items-center bg-[#E7F6F2] py-6 rounded-lg shadow-sm">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#244D3F]">3</h1>
                <p className="text-gray-600 text-sm sm:text-base">On Track</p>
            </div>

            <div className="flex flex-col gap-3 items-center bg-[#E7F6F2] py-6 rounded-lg shadow-sm">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#244D3F]">6</h1>
                <p className="text-gray-600 text-sm sm:text-base">Need Attention</p>
            </div>

            <div className="flex flex-col gap-3 items-center bg-[#E7F6F2] py-6 rounded-lg shadow-sm">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#244D3F]">12</h1>
                <p className="text-gray-600 text-sm sm:text-base">Interaction This Month</p>
            </div>
        </div>
    );
};

export default Counts;