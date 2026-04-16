import React, { useEffect, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';

const Stats = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const timeline = JSON.parse(localStorage.getItem("timeline")) || [];

        let call = 0;
        let text = 0;
        let video = 0;

        timeline.forEach(item => {
            if (item.type === "Call") call++;
            if (item.type === "Text") text++;
            if (item.type === "Video") video++;
        });

        if (call === 0 && text === 0 && video === 0) {
            setData([
                { title: "Text", value: 1, color: "#7C3AED" },
                { title: "Call", value: 1, color: "#244D3F" },
                { title: "Video", value: 1, color: "#34D399" }
            ]);
        } else {
            setData([
                { title: "Text", value: text, color: "#7C3AED" },
                { title: "Call", value: call, color: "#244D3F" },
                { title: "Video", value: video, color: "#34D399" }
            ]);
        }
    }, []);

    return (
        <div className='w-full md:w-9/12 mx-auto mt-10 '>
            <h1 className='text-3xl md:text-4xl font-bold'>
                Friendship Analytics
            </h1>

            <p className='text-md font-semibold mt-6 text-[#244D3F]'>
                By Interaction Type
            </p>

            {/* CHART CONTAINER */}
            <div className='w-[300px] h-[300px] mx-auto mt-10'>
                <PieChart
                    data={data}
                    lineWidth={18}
                    paddingAngle={8}
                    segmentsShift={3}
                    rounded
                    animate
                    startAngle={270}
                    radius={45}
                />
            </div>

            {/* LEGEND */}
            <div className='flex justify-center gap-6 my-8 text-sm font-medium'>
                <div className='flex items-center gap-2'>
                    <span className='w-3 h-3 rounded-full bg-[#7C3AED]'></span>
                    Text
                </div>
                <div className='flex items-center gap-2'>
                    <span className='w-3 h-3 rounded-full bg-[#244D3F]'></span>
                    Call
                </div>
                <div className='flex items-center gap-2'>
                    <span className='w-3 h-3 rounded-full bg-[#34D399]'></span>
                    Video
                </div>
            </div>
        </div>
    );
};

export default Stats;