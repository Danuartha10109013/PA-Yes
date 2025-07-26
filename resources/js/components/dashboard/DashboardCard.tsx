// import React from 'react';

// interface DashboardCardProps {
//   icon: string;
//   title: string;
//   value: string;
//   change?: string;
//   iconBg?: string;
//   iconColor?: string;
//   extra?: React.ReactNode;
// }

// const DashboardCard: React.FC<DashboardCardProps> = ({
//   icon,
//   title,
//   value,
//   change,
//   iconBg = '#d9d8ff',
//   iconColor = '#5c5bff',
//   extra
// }) => {
//   return (
//     <div className="bg-white rounded-xl p-6 flex items-center space-x-4 shadow-sm" style={{ backgroundColor: '#f7f8ff' }}>
//       <div className="flex items-center justify-center rounded-full w-12 h-12" style={{ backgroundColor: iconBg }}>
//         <i className={`${icon} text-xl`} style={{ color: iconColor }} />
//       </div>
//       <div className="flex-1">
//         <p className="text-xs text-[#a3a8c0] font-normal">{title}</p>
//         <p className="text-lg font-extrabold text-[#2e2e4d]">{value}</p>
//         {change && (
//           <p className="text-xs font-semibold text-[#00b74a] mt-1">
//             {change}
//             <span className="text-[#a3a8c0] font-normal"> since last month</span>
//           </p>
//         )}
//       </div>
//       {extra && <div>{extra}</div>}
//     </div>
//   );
// };

// export default DashboardCard;


import React from 'react';

interface DashboardCardProps {
  icon: React.ReactNode; // Ubah dari string ke React.ReactNode
  title: string;
  value: string;
  change?: string;
  iconBg?: string;
  iconColor?: string;
  extra?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  value,
  change,
  iconBg = '#d9d8ff',
  iconColor = '#5c5bff',
  extra
}) => {
  return (
    <div className="bg-white rounded-xl p-6 flex items-center space-x-4 shadow-sm" style={{ backgroundColor: '#f7f8ff' }}>
      <div
        className="flex items-center justify-center rounded-full w-12 h-12"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        <div className="text-xl">{icon}</div>
      </div>
      <div className="flex-1">
        <p className="text-xs text-[#a3a8c0] font-normal">{title}</p>
        <p className="text-lg font-extrabold text-[#2e2e4d]">{value}</p>
        {change && (
          <p className="text-xs font-semibold text-[#00b74a] mt-1">
            {change}
            <span className="text-[#a3a8c0] font-normal"> since last month</span>
          </p>
        )}
      </div>
      {extra && <div>{extra}</div>}
    </div>
  );
};

export default DashboardCard;
