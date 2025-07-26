// // components/Breadcrumb.tsx
// import React from 'react';

// interface BreadcrumbItem {
//   name: string;
//   href?: string;
// }

// interface BreadcrumbProps {
//   items: BreadcrumbItem[];
// }

// const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
//   return (
//     <nav className="flex items-center space-x-2 text-gray-600 text-sm font-sans" aria-label="Breadcrumb">
//       <ol className="inline-flex items-center space-x-2">
//         {items.map((item, index) => (
//           <li key={index}>
//             {item.href ? (
//               <a href={item.href} className="hover:text-blue-600">
//                 {item.name}
//               </a>
//             ) : (
//               <span className="text-gray-500" aria-current={index === items.length - 1 ? 'page' : undefined}>
//                 {item.name}
//               </span>
//             )}
//             {index < items.length - 1 && <span className="mx-2 text-gray-400">/</span>}
//           </li>
//         ))}
//       </ol>
//     </nav>
//   );
// };

// export default Breadcrumb;


import React from 'react';
import { Link } from 'react-router-dom'; // Make sure you have react-router-dom installed

interface BreadcrumbItem {
    label: string;
    path?: string; // Optional path for clickable breadcrumbs
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                {items.map((item, index) => (
                    <li key={index} className="inline-flex items-center">
                        {/* Render as a Link if there's a path and it's not the last item */}
                        {item.path && index < items.length - 1 ? (
                            <Link
                                to={item.path}
                                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            // Render as a span if it's the current page or has no path
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {item.label}
                            </span>
                        )}
                        {/* Add separator icon for all but the last item */}
                        {index < items.length - 1 && (
                            <svg
                                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 9 4-4-4-4"
                                />
                            </svg>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
