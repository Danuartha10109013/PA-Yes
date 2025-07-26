import React, { FC } from "react";

const RevenueChart: FC = () => {
    return (
        <div className="bg-white rounded-xl p-6 flex-1 max-w-full md:max-w-3xl min-w-[320px]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-900 text-base">Revenue</h2>
                <div className="flex items-center space-x-4 text-xs text-gray-600 font-normal">
                    <div className="flex items-center space-x-1">
                        <span className="w-3 h-3 rounded-full bg-[#2fbf8f] block"></span>
                        <span>Google ads</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <span className="w-3 h-3 rounded-full bg-[#f68b1e] block"></span>
                        <span>Facebook ads</span>
                    </div>
                </div>
            </div>
            <svg
                viewBox="0 0 700 300"
                className="w-full h-60"
                aria-label="Revenue line chart showing Google ads and Facebook ads from Jan to Aug"
            >
                {/* Horizontal grid lines */}
                <line x1="50" y1="50" x2="650" y2="50" stroke="#e5e7eb" strokeWidth={1} />
                <line x1="50" y1="100" x2="650" y2="100" stroke="#e5e7eb" strokeWidth={1} />
                <line x1="50" y1="150" x2="650" y2="150" stroke="#e5e7eb" strokeWidth={1} />
                <line x1="50" y1="200" x2="650" y2="200" stroke="#e5e7eb" strokeWidth={1} />
                <line x1="50" y1="250" x2="650" y2="250" stroke="#e5e7eb" strokeWidth={1} />

                {/* Y-axis labels */}
                <text x={10} y={55} fontSize={12} fill="#6b7280">400</text>
                <text x={10} y={105} fontSize={12} fill="#6b7280">300</text>
                <text x={10} y={155} fontSize={12} fill="#6b7280">200</text>
                <text x={10} y={205} fontSize={12} fill="#6b7280">100</text>
                <text x={10} y={255} fontSize={12} fill="#6b7280">0</text>

                {/* X-axis labels */}
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((month, i) => (
                    <text key={month} x={50 + i * 80} y={280} fontSize={12} fill="#6b7280">
                        {month}
                    </text>
                ))}

                {/* Google ads line */}
                <path
                    className="line-google"
                    d="M50 230 L90 130 L130 150 L170 170 L210 190 L250 200 L290 220 L330 240"
                    fill="none"
                    stroke="#2fbf8f"
                    strokeWidth={3}
                />
                {/* Google ads points */}
                {[50, 90, 130, 170, 210, 250, 290, 330].map((cx, i) => (
                    <circle
                        key={"g" + i}
                        className="circle-google"
                        cx={cx}
                        cy={[230, 130, 150, 170, 190, 200, 220, 240][i]}
                        r={6}
                    />
                ))}

                {/* Facebook ads line */}
                <path
                    className="line-facebook"
                    d="M50 250 Q90 210 130 230 T210 230 Q250 180 290 120 T330 180"
                    fill="none"
                    stroke="#f68b1e"
                    strokeWidth={3}
                />
                {/* Facebook ads points */}
                {[50, 90, 130, 170, 210, 250, 290, 330].map((cx, i) => (
                    <circle
                        key={"f" + i}
                        className="circle-facebook"
                        cx={cx}
                        cy={[250, 210, 230, 230, 230, 180, 120, 180][i]}
                        r={6}
                    />
                ))}
            </svg>
        </div>
    );
};

export default RevenueChart;
