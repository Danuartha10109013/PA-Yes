// import React, { FC } from "react";

// const RevenueChart: FC = () => {
//   return (
//     <div className="bg-white rounded-xl p-6 flex-1 max-w-full md:max-w-3xl min-w-[320px]">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="font-semibold text-gray-900 text-base">Revenue</h2>
//         <div className="flex items-center space-x-4 text-xs text-gray-600 font-normal">
//           <div className="flex items-center space-x-1">
//             <span className="w-3 h-3 rounded-full bg-[#2fbf8f] block"></span>
//             <span>Google ads</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <span className="w-3 h-3 rounded-full bg-[#f68b1e] block"></span>
//             <span>Facebook ads</span>
//           </div>
//         </div>
//       </div>
//       <svg
//         viewBox="0 0 700 300"
//         className="w-full h-60"
//         aria-label="Revenue line chart showing Google ads and Facebook ads from Jan to Aug"
//       >
//         {/* Horizontal grid lines */}
//         <line x1="50" y1="50" x2="650" y2="50" stroke="#e5e7eb" strokeWidth={1} />
//         <line x1="50" y1="100" x2="650" y2="100" stroke="#e5e7eb" strokeWidth={1} />
//         <line x1="50" y1="150" x2="650" y2="150" stroke="#e5e7eb" strokeWidth={1} />
//         <line x1="50" y1="200" x2="650" y2="200" stroke="#e5e7eb" strokeWidth={1} />
//         <line x1="50" y1="250" x2="650" y2="250" stroke="#e5e7eb" strokeWidth={1} />

//         {/* Y-axis labels */}
//         <text x={10} y={55} fontSize={12} fill="#6b7280">400</text>
//         <text x={10} y={105} fontSize={12} fill="#6b7280">300</text>
//         <text x={10} y={155} fontSize={12} fill="#6b7280">200</text>
//         <text x={10} y={205} fontSize={12} fill="#6b7280">100</text>
//         <text x={10} y={255} fontSize={12} fill="#6b7280">0</text>

//         {/* X-axis labels */}
//         {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((month, i) => (
//           <text key={month} x={50 + i * 80} y={280} fontSize={12} fill="#6b7280">
//             {month}
//           </text>
//         ))}

//         {/* Google ads line */}
//         <path
//           className="line-google"
//           d="M50 230 L90 130 L130 150 L170 170 L210 190 L250 200 L290 220 L330 240"
//           fill="none"
//           stroke="#2fbf8f"
//           strokeWidth={3}
//         />
//         {/* Google ads points */}
//         {[50, 90, 130, 170, 210, 250, 290, 330].map((cx, i) => (
//           <circle
//             key={"g" + i}
//             className="circle-google"
//             cx={cx}
//             cy={[230, 130, 150, 170, 190, 200, 220, 240][i]}
//             r={6}
//           />
//         ))}

//         {/* Facebook ads line */}
//         <path
//           className="line-facebook"
//           d="M50 250 Q90 210 130 230 T210 230 Q250 180 290 120 T330 180"
//           fill="none"
//           stroke="#f68b1e"
//           strokeWidth={3}
//         />
//         {/* Facebook ads points */}
//         {[50, 90, 130, 170, 210, 250, 290, 330].map((cx, i) => (
//           <circle
//             key={"f" + i}
//             className="circle-facebook"
//             cx={cx}
//             cy={[250, 210, 230, 230, 230, 180, 120, 180][i]}
//             r={6}
//           />
//         ))}
//       </svg>
//     </div>
//   );
// };

// export default RevenueChart;


// import React, { FC } from 'react';

// // Define the interface for the data the chart expects
// interface SectorSalesData {
//     sector: string;
//     totalSales: number;
// }

// // Props for the SectorSalesChart component
// interface SectorSalesChartProps {
//     data: SectorSalesData[];
// }

// const SectorSalesChart: FC<SectorSalesChartProps> = ({ data }) => {
//     // Sort data for better visualization, e.g., by total sales descending
//     const sortedData = [...data].sort((a, b) => b.totalSales - a.totalSales);

//     // Define SVG dimensions and margins
//     const width = 600;
//     const height = 300;
//     const margin = { top: 20, right: 30, bottom: 60, left: 80 }; // Increased left margin for labels
//     const innerWidth = width - margin.left - margin.right;
//     const innerHeight = height - margin.top - margin.bottom;

//     // Handle case where there's no data
//     if (sortedData.length === 0) {
//         return (
//             <div className="bg-white rounded-xl p-6 shadow-md mt-6 text-center text-gray-500">
//                 Tidak ada data penjualan untuk ditampilkan di grafik.
//             </div>
//         );
//     }

//     // Scale for Y-axis (sales values)
//     const maxSales = Math.max(...sortedData.map(d => d.totalSales));
//     // Add some padding to the max sales for better visual, or ensure it starts from 0 if maxSales is very small
//     const yScale = (value: number) => innerHeight - (value / maxSales) * innerHeight;

//     // Scale for X-axis (sector names) - distributes bars evenly
//     const barWidth = innerWidth / sortedData.length / 1.5; // Adjust for spacing
//     const barSpacing = innerWidth / sortedData.length;

//     return (
//         <div className="bg-white rounded-xl p-6 shadow-md mt-6">
//             <h2 className="font-semibold text-gray-900 text-lg mb-4">Total Penjualan per Sektor</h2>
//             <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-96">
//                 <g transform={`translate(${margin.left},${margin.top})`}>
//                     {/* Y-axis Grid Lines and Labels */}
//                     {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
//                         const y = innerHeight * (1 - ratio);
//                         const value = maxSales * ratio;
//                         return (
//                             <g key={`y-axis-${i}`}>
//                                 <line x1={-10} y1={y} x2={innerWidth} y2={y} stroke="#e0e0e0" strokeDasharray="4 4" />
//                                 <text x={-20} y={y + 5} textAnchor="end" fontSize={12} fill="#6b7280">
//                                     Rp{value.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
//                                 </text>
//                             </g>
//                         );
//                     })}
//                     <text x={-margin.left + 10} y={innerHeight / 2} textAnchor="middle" transform={`rotate(-90, ${-margin.left + 10}, ${innerHeight / 2})`} fontSize={14} fill="#344767" fontWeight="bold">
//                         Total Penjualan
//                     </text>

//                     {/* Bars */}
//                     {sortedData.map((d, i) => {
//                         const x = i * barSpacing + (barSpacing - barWidth) / 2;
//                         const barHeight = innerHeight - yScale(d.totalSales);
//                         const y = yScale(d.totalSales);

//                         return (
//                             <g key={d.sector}>
//                                 <rect
//                                     x={x}
//                                     y={y}
//                                     width={barWidth}
//                                     height={barHeight}
//                                     fill="#4CAF50" // A nice green color for bars
//                                     className="transition-all duration-300 ease-in-out hover:opacity-80"
//                                 />
//                                 {/* Value label on top of the bar */}
//                                 <text
//                                     x={x + barWidth / 2}
//                                     y={y - 5} // Position above the bar
//                                     textAnchor="middle"
//                                     fontSize={10}
//                                     fill="#344767"
//                                 >
//                                     Rp{(d.totalSales / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}M
//                                 </text>
//                                 {/* X-axis labels (sector names) */}
//                                 <text
//                                     x={x + barWidth / 2}
//                                     y={innerHeight + 15}
//                                     textAnchor="middle"
//                                     fontSize={12}
//                                     fill="#6b7280"
//                                     transform={`rotate(45, ${x + barWidth / 2}, ${innerHeight + 15})`} // Rotate for long labels
//                                 >
//                                     {d.sector}
//                                 </text>
//                             </g>
//                         );
//                     })}

//                     <text x={innerWidth / 2} y={innerHeight + margin.bottom - 5} textAnchor="middle" fontSize={14} fill="#344767" fontWeight="bold">
//                         Nama Sektor
//                     </text>
//                 </g>
//             </svg>
//         </div>
//     );
// };

// export default SectorSalesChart;

// import React, { FC } from 'react';

// // Define the interface for the data the chart expects
// interface SectorSalesData {
//     sector: string;
//     totalSales: number;
// }

// // Props for the SectorSalesChart component
// interface SectorSalesChartProps {
//     data: SectorSalesData[];
// }

// const SectorSalesChart: FC<SectorSalesChartProps> = ({ data }) => {
//     // Sort data for better visualization, e.g., by total sales descending
//     const sortedData = [...data].sort((a, b) => b.totalSales - a.totalSales);

//     // Define SVG dimensions and margins
//     const width = 700; // Adjusted to match RevenueChart example
//     const height = 300; // Adjusted to match RevenueChart example
//     const margin = { top: 20, right: 30, bottom: 60, left: 80 }; // Increased left margin for labels
//     const innerWidth = width - margin.left - margin.right;
//     const innerHeight = height - margin.top - margin.bottom;

//     // Define a color palette for the bars (you can extend this)
//     // These colors are similar to the ones used in your RevenueChart for Google/Facebook ads
//     const colors = ['#2fbf8f', '#f68b1e', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#ff8042'];

//     // Handle case where there's no data
//     if (sortedData.length === 0) {
//         return (
//             <div className="bg-white rounded-xl p-6 shadow-md mt-6 text-center text-gray-500">
//                 Tidak ada data penjualan untuk ditampilkan di grafik.
//             </div>
//         );
//     }

//     // Scale for Y-axis (sales values)
//     const maxSales = Math.max(...sortedData.map(d => d.totalSales));
//     const yScale = (value: number) => innerHeight - (value / maxSales) * innerHeight;

//     // Scale for X-axis (sector names) - distributes bars evenly
//     const barWidth = innerWidth / sortedData.length / 1.5; // Adjust for spacing
//     const barSpacing = innerWidth / sortedData.length;

//     return (
//         <div className="bg-white rounded-xl p-6 flex-1 max-w-full md:max-w-3xl min-w-[320px] shadow-md mt-6">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="font-semibold text-gray-900 text-base">Total Penjualan per Sektor</h2>
//                 <div className="flex items-center space-x-4 text-xs text-gray-600 font-normal">
//                     {/* Dynamic Legend based on your data */}
//                     {sortedData.map((d, i) => (
//                         <div key={d.sector} className="flex items-center space-x-1">
//                             <span
//                                 className="w-3 h-3 rounded-full block"
//                                 style={{ backgroundColor: colors[i % colors.length] }} // Cycle through colors
//                             ></span>
//                             <span>{d.sector}</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <svg
//                 viewBox={`0 0 ${width} ${height}`}
//                 className="w-full h-60" // Adjusted to match RevenueChart example
//                 aria-label="Bar chart showing total sales per sector"
//             >
//                 <g transform={`translate(${margin.left},${margin.top})`}>
//                     {/* Horizontal grid lines */}
//                     {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
//                         const y = innerHeight * (1 - ratio);
//                         return (
//                             <line
//                                 key={`grid-line-${i}`}
//                                 x1={0}
//                                 y1={y}
//                                 x2={innerWidth}
//                                 y2={y}
//                                 stroke="#e5e7eb"
//                                 strokeWidth={1}
//                             />
//                         );
//                     })}

//                     {/* Y-axis labels */}
//                     {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
//                         const y = innerHeight * (1 - ratio);
//                         const value = maxSales * ratio;
//                         return (
//                             <text
//                                 key={`y-label-${i}`}
//                                 x={-10} // Position to the left of the grid lines
//                                 y={y + 5}
//                                 textAnchor="end"
//                                 fontSize={12}
//                                 fill="#6b7280"
//                             >
//                                 {i === 0 ? '0' : `Rp${(value / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 0 })}M`}
//                             </text>
//                         );
//                     })}

//                     {/* Bars */}
//                     {sortedData.map((d, i) => {
//                         const x = i * barSpacing + (barSpacing - barWidth) / 2;
//                         const barHeight = innerHeight - yScale(d.totalSales);
//                         const y = yScale(d.totalSales);
//                         const barColor = colors[i % colors.length]; // Get color from palette

//                         return (
//                             <g key={d.sector}>
//                                 <rect
//                                     x={x}
//                                     y={y}
//                                     width={barWidth}
//                                     height={barHeight}
//                                     fill={barColor}
//                                     className="transition-all duration-300 ease-in-out hover:opacity-80"
//                                 />
//                                 {/* Value label on top of the bar */}
//                                 <text
//                                     x={x + barWidth / 2}
//                                     y={y - 5} // Position above the bar
//                                     textAnchor="middle"
//                                     fontSize={10}
//                                     fill="#344767"
//                                 >
//                                     Rp{(d.totalSales / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}M
//                                 </text>
//                                 {/* X-axis labels (sector names) */}
//                                 <text
//                                     x={x + barWidth / 2}
//                                     y={innerHeight + 15}
//                                     textAnchor="middle"
//                                     fontSize={12}
//                                     fill="#6b7280"
//                                     transform={`rotate(45, ${x + barWidth / 2}, ${innerHeight + 15})`} // Rotate for long labels
//                                 >
//                                     {d.sector}
//                                 </text>
//                             </g>
//                         );
//                     })}
//                 </g>
//             </svg>
//         </div>
//     );
// };

// export default SectorSalesChart;

// import React, { FC } from 'react';

// // Define the interface for the data the chart expects
// interface SectorSalesData {
//     sector: string;
//     totalSales: number;
// }

// // Props for the SectorSalesChart component
// interface SectorSalesChartProps {
//     data: SectorSalesData[];
// }

// const SectorSalesChart: FC<SectorSalesChartProps> = ({ data }) => {
//     // Sort data for better visualization, e.g., by total sales descending
//     const sortedData = [...data].sort((a, b) => b.totalSales - a.totalSales);

//     // Define SVG dimensions and margins
//     const width = 700; // Adjusted to match RevenueChart example
//     const height = 300; // Adjusted to match RevenueChart example
//     const margin = { top: 20, right: 30, bottom: 60, left: 80 }; // Increased left margin for labels
//     const innerWidth = width - margin.left - margin.right;
//     const innerHeight = height - margin.top - margin.bottom;

//     // Define a color palette for the bars (you can extend this)
//     const colors = ['#2fbf8f', '#f68b1e', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#ff8042'];

//     // Handle case where there's no data
//     if (sortedData.length === 0) {
//         return (
//             <div className="bg-white rounded-xl p-6 shadow-md mt-6 text-center text-gray-500">
//                 Tidak ada data penjualan untuk ditampilkan di grafik.
//             </div>
//         );
//     }

//     // Scale for Y-axis (sales values)
//     const maxSales = Math.max(...sortedData.map(d => d.totalSales));
//     const yScale = (value: number) => innerHeight - (value / maxSales) * innerHeight;

//     // Scale for X-axis (sector names) - distributes bars evenly
//     const barWidth = innerWidth / sortedData.length / 1.5; // Adjust for spacing
//     const barSpacing = innerWidth / sortedData.length;

//     return (
//         <div className="bg-white rounded-xl p-6 flex-1 max-w-full md:max-w-3xl min-w-[320px] shadow-md mt-6">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="font-semibold text-gray-900 text-base">Total Penjualan per Sektor</h2>
//                 <div className="flex items-center space-x-4 text-xs text-gray-600 font-normal">
//                     {/* Dynamic Legend based on your data */}
//                     {sortedData.map((d, i) => (
//                         <div key={d.sector} className="flex items-center space-x-1">
//                             <span
//                                 className="w-3 h-3 rounded-full block"
//                                 style={{ backgroundColor: colors[i % colors.length] }} // Cycle through colors
//                             ></span>
//                             <span>{d.sector}</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <svg
//                 viewBox={`0 0 ${width} ${height}`}
//                 className="w-full h-60" // Adjusted to match RevenueChart example
//                 aria-label="Bar chart showing total sales per sector"
//             >
//                 <g transform={`translate(${margin.left},${margin.top})`}>
//                     {/* Horizontal grid lines */}
//                     {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
//                         const y = innerHeight * (1 - ratio);
//                         return (
//                             <line
//                                 key={`grid-line-${i}`}
//                                 x1={0}
//                                 y1={y}
//                                 x2={innerWidth}
//                                 y2={y}
//                                 stroke="#e5e7eb"
//                                 strokeWidth={1}
//                             />
//                         );
//                     })}

//                     {/* Y-axis labels */}
//                     {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
//                         const y = innerHeight * (1 - ratio);
//                         const value = maxSales * ratio;
//                         return (
//                             <text
//                                 key={`y-label-${i}`}
//                                 x={-10} // Position to the left of the grid lines
//                                 y={y + 5}
//                                 textAnchor="end"
//                                 fontSize={12}
//                                 fill="#6b7280"
//                             >
//                                 {i === 0 ? '0' : `Rp${(value / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 0 })}Juta`}
//                             </text>
//                         );
//                     })}

//                     {/* Bars */}
//                     {sortedData.map((d, i) => {
//                         const x = i * barSpacing + (barSpacing - barWidth) / 2;
//                         const barHeight = innerHeight - yScale(d.totalSales);
//                         const y = yScale(d.totalSales);
//                         const barColor = colors[i % colors.length]; // Get color from palette

//                         return (
//                             <g key={d.sector}>
//                                 <rect
//                                     x={x}
//                                     y={y}
//                                     width={barWidth}
//                                     height={barHeight}
//                                     fill={barColor}
//                                     className="transition-all duration-300 ease-in-out hover:opacity-80"
//                                 />
//                                 {/* Value label on top of the bar */}
//                                 <text
//                                     x={x + barWidth / 2}
//                                     y={y - 5} // Position above the bar
//                                     textAnchor="middle"
//                                     fontSize={10}
//                                     fill="#344767"
//                                 >
//                                     Rp{(d.totalSales / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}Juta
//                                 </text>
//                                 {/* X-axis labels (sector names) */}
//                                 <text
//                                     x={x + barWidth / 2}
//                                     y={innerHeight + 15}
//                                     textAnchor="middle"
//                                     fontSize={12}
//                                     fill="#6b7280"
//                                     transform={`rotate(45, ${x + barWidth / 2}, ${innerHeight + 15})`} // Rotate for long labels
//                                 >
//                                     {d.sector}
//                                 </text>
//                             </g>
//                         );
//                     })}
//                 </g>
//             </svg>
//         </div>
//     );
// };

// export default SectorSalesChart;

// import React, { FC } from 'react';

// // Define the interface for the data the chart expects
// interface SectorSalesData {
//     sector: string;
//     totalSales: number;
// }

// // Props for the SectorSalesChart component
// interface SectorSalesChartProps {
//     data: SectorSalesData[];
// }

// const SectorSalesChart: FC<SectorSalesChartProps> = ({ data }) => {
//     const sortedData = [...data];

//     const width = 700;
//     const height = 300;
//     const margin = { top: 20, right: 30, bottom: 60, left: 80 };
//     const innerWidth = width - margin.left - margin.right;
//     const innerHeight = height - margin.top - margin.bottom;

//     const colors = ['#2fbf8f', '#f68b1e', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#ff8042'];

//     if (sortedData.length === 0) {
//         return (
//             <div className="bg-white rounded-xl p-6 shadow-md mt-6 text-center text-gray-500">
//                 Tidak ada data penjualan untuk ditampilkan di grafik.
//             </div>
//         );
//     }

//     const maxSales = Math.max(...sortedData.map(d => d.totalSales));
//     // Determine a nice, rounded maximum for the Y-axis (e.g., nearest million, or a step up)
//     // This creates cleaner intervals.
//     const displayMaxY = Math.ceil(maxSales / 1000000) * 1000000; // Round up to nearest million for display
//     const actualMaxY = displayMaxY > 0 ? displayMaxY * 1.1 : 1000000; // Add padding, ensure at least 1M if data is 0

//     const yScale = (value: number) => innerHeight - (value / actualMaxY) * innerHeight;

//     const xStep = innerWidth / (sortedData.length > 1 ? sortedData.length - 1 : 1);

//     const linePath = sortedData.map((d, i) => {
//         const x = i * xStep;
//         const y = yScale(d.totalSales);
//         return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
//     }).join(' ');

//     // --- NEW LOGIC FOR Y-AXIS LABELS AND GRID LINES ---
//     const numYAxisTicks = 5; // For 0, 0.25, 0.5, 0.75, 1
//     const yAxisLabels: number[] = [];
//     for (let i = 0; i <= numYAxisTicks; i++) {
//         yAxisLabels.push(displayMaxY / numYAxisTicks * i);
//     }
//     // --- END NEW LOGIC ---

//     return (
//         // <div className="bg-white rounded-xl p-6 flex-1 max-w-full md:max-w-3xl min-w-[320px] shadow-md mt-6">
//         <div className="bg-white rounded-xl p-6 flex-1 max-w-full md:max-w-3xl min-w-[320px]">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="font-semibold text-gray-900 text-base">Total Penjualan per Sektor</h2>
//                 <div className="flex items-center space-x-4 text-xs text-gray-600 font-normal">
//                     {/* Dynamic Legend based on your data */}
//                     {sortedData.map((d, i) => (
//                         <div key={d.sector} className="flex items-center space-x-1">
//                             <span
//                                 className="w-3 h-3 rounded-full block"
//                                 style={{ backgroundColor: colors[i % colors.length] }}
//                             ></span>
//                             <span>{d.sector}</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <svg
//                 viewBox={`0 0 ${width} ${height}`}
//                 className="w-full h-60"
//                 aria-label="Line chart showing total sales per sector"
//             >
//                 <g transform={`translate(${margin.left},${margin.top})`}>
//                     {/* Horizontal grid lines and Y-axis labels */}
//                     {yAxisLabels.map((labelValue, i) => {
//                         const y = yScale(labelValue);

//                         // Skip if this label's Y-position is the same as previous
//                         if (i > 0 && y === yScale(yAxisLabels[i - 1])) return null;

//                         return (
//                             <React.Fragment key={`grid-y-label-${i}`}>
//                                 <line
//                                     x1={0}
//                                     y1={y}
//                                     x2={innerWidth}
//                                     y2={y}
//                                     stroke="#e5e7eb"
//                                     strokeWidth={1}
//                                 />
//                                 <text
//                                     x={-10}
//                                     y={y + 5}
//                                     textAnchor="end"
//                                     fontSize={12}
//                                     fill="#6b7280"
//                                 >
//                                     {(() => {
//                                         const juta = labelValue / 1_000_000;
//                                         if (labelValue === 0) return '0';
//                                         if (juta < 1) return `Rp. ${(labelValue).toLocaleString('id-ID')}`;
//                                         return `Rp. ${Math.round(juta).toLocaleString('id-ID')}Juta`;
//                                     })()}

//                                 </text>
//                             </React.Fragment>
//                         );
//                     })}


//                     {/* X-axis labels (sector names) */}
//                     {sortedData.map((d, i) => {
//                         const x = i * xStep;
//                         return (
//                             <text
//                                 key={`x-label-${i}`}
//                                 x={x}
//                                 y={innerHeight + 15}
//                                 textAnchor="middle"
//                                 fontSize={12}
//                                 fill="#6b7280"
//                                 transform={`rotate(45, ${x}, ${innerHeight + 15})`}
//                             >
//                                 {d.sector}
//                             </text>
//                         );
//                     })}

//                     {/* Line path */}
//                     <path
//                         className="line-chart-path"
//                         d={linePath}
//                         fill="none"
//                         stroke={colors[0]}
//                         strokeWidth={3}
//                     />

//                     {/* Data points */}
//                     {sortedData.map((d, i) => {
//                         const x = i * xStep;
//                         const y = yScale(d.totalSales);
//                         return (
//                             <circle
//                                 key={`circle-${i}`}
//                                 cx={x}
//                                 cy={y}
//                                 r={6}
//                                 fill={colors[0]}
//                                 stroke="#fff"
//                                 strokeWidth={2}
//                                 className="transition-all duration-300 ease-in-out hover:scale-110"
//                             />
//                         );
//                     })}
//                 </g>
//             </svg>
//         </div>
//     );
// };

// export default SectorSalesChart;

import React, { FC } from 'react';

interface SectorSalesData {
    sector: string;
    totalSales: number;
}

interface SectorSalesChartProps {
    data: SectorSalesData[];
    className?: string;
}

const SectorSalesChart: FC<SectorSalesChartProps> = ({ data, className }) => {
    const sortedData = [...data];

    const width = 700;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const colors = ['#2fbf8f', '#f68b1e', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#ff8042'];

    if (sortedData.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-md mt-6 text-center text-gray-500 w-full">
                Tidak ada data penjualan untuk ditampilkan di grafik.
            </div>
        );
    }

    const maxSales = Math.max(...sortedData.map(d => d.totalSales));
    const displayMaxY = Math.ceil(maxSales / 1_000_000) * 1_000_000;
    const actualMaxY = displayMaxY > 0 ? displayMaxY * 1.1 : 1_000_000;
    const yScale = (value: number) => innerHeight - (value / actualMaxY) * innerHeight;
    const xStep = innerWidth / (sortedData.length > 1 ? sortedData.length - 1 : 1);
    const linePath = sortedData.map((d, i) => {
        const x = i * xStep;
        const y = yScale(d.totalSales);
        return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
    }).join(' ');

    const numYAxisTicks = 5;
    const yAxisLabels = Array.from({ length: numYAxisTicks + 1 }, (_, i) => displayMaxY / numYAxisTicks * i);

    return (
        <div className={`bg-white rounded-xl p-6 shadow-md w-full ${className ?? ''}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-900 text-base">Total Penjualan per Sektor</h2>
                <div className="flex flex-wrap gap-4 text-xs text-gray-600 font-normal">
                    {sortedData.map((d, i) => (
                        <div key={d.sector} className="flex items-center space-x-1">
                            <span
                                className="w-3 h-3 rounded-full block"
                                style={{ backgroundColor: colors[i % colors.length] }}
                            ></span>
                            <span>{d.sector}</span>
                        </div>
                    ))}
                </div>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-60">
                <g transform={`translate(${margin.left},${margin.top})`}>
                    {yAxisLabels.map((labelValue, i) => {
                        const y = yScale(labelValue);
                        if (i > 0 && y === yScale(yAxisLabels[i - 1])) return null;
                        return (
                            <React.Fragment key={`grid-y-label-${i}`}>
                                <line x1={0} y1={y} x2={innerWidth} y2={y} stroke="#e5e7eb" strokeWidth={1} />
                                <text x={-10} y={y + 5} textAnchor="end" fontSize={12} fill="#6b7280">
                                    {labelValue === 0
                                        ? '0'
                                        : `Rp. ${Math.round(labelValue / 1_000_000).toLocaleString('id-ID')}Juta`}
                                </text>
                            </React.Fragment>
                        );
                    })}

                    {sortedData.map((d, i) => {
                        const x = i * xStep;
                        return (
                            <text
                                key={`x-label-${i}`}
                                x={x}
                                y={innerHeight + 15}
                                textAnchor="middle"
                                fontSize={12}
                                fill="#6b7280"
                                transform={`rotate(45, ${x}, ${innerHeight + 15})`}
                            >
                                {d.sector}
                            </text>
                        );
                    })}

                    <path d={linePath} fill="none" stroke={colors[0]} strokeWidth={3} />
                    {sortedData.map((d, i) => {
                        const x = i * xStep;
                        const y = yScale(d.totalSales);
                        return (
                            <circle
                                key={`circle-${i}`}
                                cx={x}
                                cy={y}
                                r={6}
                                fill={colors[0]}
                                stroke="#fff"
                                strokeWidth={2}
                            />
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};

export default SectorSalesChart;
