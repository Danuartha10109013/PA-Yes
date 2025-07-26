// import React, { FC } from "react";

// const WebsiteVisitors: FC = () => {
//     const radius = 50;
//     const strokeWidth = 12;
//     const circumference = 2 * Math.PI * radius;

//     // Persentase
//     const segments = [
//         { color: "#f68b1e", percent: 38, label: "Direct" },
//         { color: "#2fbf8f", percent: 22, label: "Organic" },
//         { color: "#6fc6db", percent: 12, label: "Paid" },
//         { color: "#ef4f5f", percent: 28, label: "Social" },
//     ];

//     // Hitung strokeDasharray dan strokeDashoffset
//     let offset = 0;

//     const circles = segments.map((segment, index) => {
//         const length = (segment.percent / 100) * circumference;
//         const dashArray = `${length} ${circumference - length}`;
//         const dashOffset = -offset;
//         offset += length;

//         return (
//             <circle
//                 key={index}
//                 cx={60}
//                 cy={60}
//                 r={radius}
//                 stroke={segment.color}
//                 strokeWidth={strokeWidth}
//                 fill="none"
//                 strokeDasharray={dashArray}
//                 strokeDashoffset={dashOffset}
//                 strokeLinecap="round"
//             />
//         );
//     });

//     return (
//         <div className="bg-white rounded-xl p-6 max-w-xs w-full flex flex-col justify-between min-w-[280px]">
//             <h2 className="font-semibold text-gray-900 text-base mb-6">Status CRM</h2>
//             <div className="flex justify-center mb-6">
//                 <svg
//                     width={120}
//                     height={120}
//                     viewBox="0 0 120 120"
//                     aria-label="Donut chart showing website visitors by source"
//                 >
//                     {circles}
//                 </svg>
//             </div>
//             <div className="space-y-4 text-sm text-gray-700 font-normal">
//                 {segments.map((segment, index) => (
//                     <div key={index} className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                             <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: segment.color }}></span>
//                             <span>{segment.label}</span>
//                         </div>
//                         <span className="font-semibold text-gray-900">{segment.percent}%</span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default WebsiteVisitors;


import React, { FC, useState, useEffect } from "react";

interface Segment {
    color: string;
    percent: number;
    label: string;
}

const WebsiteVisitors: FC = () => {
    const radius = 50;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;

    const [segments, setSegments] = useState<Segment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCrmStatus = async () => {
            try {
                // Adjust this URL to your Laravel API endpoint
                const response = await fetch("/crm-status");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setSegments(result.data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCrmStatus();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 max-w-xs w-full flex flex-col justify-between min-w-[280px]">
                <h2 className="font-semibold text-gray-900 text-base mb-6">Status CRM</h2>
                <div className="flex justify-center items-center h-40">
                    Loading data...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl p-6 max-w-xs w-full flex flex-col justify-between min-w-[280px]">
                <h2 className="font-semibold text-gray-900 text-base mb-6">Status CRM</h2>
                <div className="flex justify-center items-center h-40 text-red-500">
                    Error: {error}
                </div>
            </div>
        );
    }

    // Hitung strokeDasharray dan strokeDashoffset
    let offset = 0;

    const circles = segments.map((segment, index) => {
        const length = (segment.percent / 100) * circumference;
        const dashArray = `${length} ${circumference - length}`;
        const dashOffset = -offset;
        offset += length;

        return (
            <circle
                key={index}
                cx={60}
                cy={60}
                r={radius}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)" // Rotate to start the first segment from the top
            />
        );
    });

    return (
        <div className="bg-white rounded-xl p-6 max-w-xs w-full flex flex-col justify-between min-w-[280px]">
            <h2 className="font-semibold text-gray-900 text-base mb-6">Status CRM</h2>
            <div className="flex justify-center mb-6">
                {segments.length > 0 ? (
                    <svg
                        width={120}
                        height={120}
                        viewBox="0 0 120 120"
                        aria-label="Donut chart showing CRM status by column"
                    >
                        {circles}
                    </svg>
                ) : (
                    <div className="flex justify-center items-center h-28 text-gray-500">
                        No data available to display.
                    </div>
                )}
            </div>
            <div className="space-y-4 text-sm text-gray-700 font-normal">
                {segments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: segment.color }}></span>
                            <span>{segment.label}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{segment.percent}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WebsiteVisitors;
