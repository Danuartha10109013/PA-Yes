// import { useState, useContext, createContext, ReactNode } from "react"
// import { MoreVertical, ChevronLast, ChevronFirst, Home, Settings } from "lucide-react"

// interface SidebarContextType {
//     expanded: boolean
// }

// const SidebarContext = createContext<SidebarContextType>({ expanded: true })

// interface SidebarProps {
//     children: ReactNode
// }

// const Sidebar = ({ children }: SidebarProps) => {
//     const [expanded, setExpanded] = useState<boolean>(true)

//     return (

//         <aside className="h-screen">
//             <nav className="h-full flex flex-col bg-white border-r shadow-sm">
//                 {/* Logo + Toggle */}
//                 <div className="p-4 pb-2 flex justify-between items-center">
//                     <img
//                         src="https://img.logoipsum.com/243.svg"
//                         className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
//                         alt="Logo"
//                     />
//                     <button
//                         onClick={() => setExpanded((curr) => !curr)}
//                         className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
//                     >
//                         {expanded ? <ChevronFirst /> : <ChevronLast />}
//                     </button>
//                 </div>

//                 {/* Menu Items */}
//                 <SidebarContext.Provider value={{ expanded }}>
//                     <ul className="flex-1 px-3">{children}</ul>
//                 </SidebarContext.Provider>

//                 {/* Footer / Profile */}
//                 <div className="border-t flex p-3">
//                     <img
//                         src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
//                         alt="Avatar"
//                         className="w-10 h-10 rounded-md"
//                     />
//                     <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
//                         <div className="leading-4">
//                             <h4 className="font-semibold">John Doe</h4>
//                             <span className="text-xs text-gray-600">johndoe@gmail.com</span>
//                         </div>
//                         <MoreVertical size={20} />
//                     </div>
//                 </div>
//             </nav>
//         </aside>
//     )
// }

// interface SidebarItemProps {
//     icon: ReactNode
//     text: string
//     active?: boolean
//     alert?: boolean
// }

// const SidebarItem = ({ icon, text, active = false, alert = false }: SidebarItemProps) => {
//     const { expanded } = useContext(SidebarContext)

//     return (
//         <li
//             className={`
//         relative flex items-center py-2 px-3 my-1
//         font-medium rounded-md cursor-pointer
//         transition-colors group
//         ${active
//                     ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
//                     : "hover:bg-indigo-50 text-gray-600"
//                 }
//       `}
//         >
//             {icon}
//             <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
//                 {text}
//             </span>
//             {alert && (
//                 <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />
//             )}
//             {!expanded && (
//                 <div
//                     className={`
//             absolute left-full rounded-md px-2 py-1 ml-6
//             bg-indigo-100 text-indigo-800 text-sm
//             invisible opacity-20 -translate-x-3 transition-all
//             group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
//           `}
//                 >
//                     {text}
//                 </div>
//             )}
//         </li>
//     )
// }

// // ✅ Contoh Penggunaan Sidebar + SidebarItem
// const App = () => {
//     return (
//         <Sidebar>
//             <SidebarItem icon={<Home size={20} />} text="Home" active />
//             <SidebarItem icon={<Settings size={20} />} text="Manage Leads" />
//             <SidebarItem icon={<Settings size={20} />} text="Product" />
//             <SidebarItem icon={<Settings size={20} />} text="Sector" />
//             <SidebarItem icon={<Settings size={20} />} text="Report" />
//             <SidebarItem icon={<Settings size={20} />} text="Segmentasi Pasar" />
//             <SidebarItem icon={<Settings size={20} />} text="Settings" />
//         </Sidebar>
//     )
// }

// export default App


// import { useState, useContext, createContext, ReactNode } from "react"
// import { MoreVertical, ChevronLast, ChevronFirst, Home, Settings } from "lucide-react"
// import { Link } from '@inertiajs/react'; // Import Link

// interface SidebarContextType {
//     expanded: boolean
// }

// const SidebarContext = createContext<SidebarContextType>({ expanded: true })

// interface SidebarProps {
//     children: ReactNode
// }

// const Sidebar = ({ children }: SidebarProps) => {
//     const [expanded, setExpanded] = useState<boolean>(true)

//     return (
//         <aside className="h-screen">
//             <nav className="h-full flex flex-col bg-white border-r shadow-sm">
//                 {/* Logo + Toggle */}
//                 <div className="p-4 pb-2 flex justify-between items-center">
//                     <img
//                         src="https://img.logoipsum.com/243.svg"
//                         className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
//                         alt="Logo"
//                     />
//                     <button
//                         onClick={() => setExpanded((curr) => !curr)}
//                         className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
//                     >
//                         {expanded ? <ChevronFirst /> : <ChevronLast />}
//                     </button>
//                 </div>

//                 {/* Menu Items */}
//                 <SidebarContext.Provider value={{ expanded }}>
//                     <ul className="flex-1 px-3">{children}</ul>
//                 </SidebarContext.Provider>

//                 {/* Footer / Profile */}
//                 <div className="border-t flex p-3">
//                     <img
//                         src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
//                         alt="Avatar"
//                         className="w-10 h-10 rounded-md"
//                     />
//                     <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
//                         <div className="leading-4">
//                             <h4 className="font-semibold">John Doe</h4>
//                             <span className="text-xs text-gray-600">johndoe@gmail.com</span>
//                         </div>
//                         <MoreVertical size={20} />
//                     </div>
//                 </div>
//             </nav>
//         </aside>
//     )
// }

// interface SidebarItemProps {
//     icon: ReactNode
//     text: string
//     active?: boolean
//     alert?: boolean
//     to?: string // Add a 'to' prop for the route
// }

// const SidebarItem = ({ icon, text, active = false, alert = false, to }: SidebarItemProps) => {
//     const { expanded } = useContext(SidebarContext)

//     return (
//         <li className={`
//             relative flex items-center py-2 px-3 my-1
//             font-medium rounded-md cursor-pointer
//             transition-colors group
//             ${active
//                 ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
//                 : "hover:bg-indigo-50 text-gray-600"
//             }
//         `}>
//             {/* Use Link component for navigation */}
//             <Link href={to || '#'} className="flex items-center w-full">
//                 {icon}
//                 <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
//                     {text}
//                 </span>
//             </Link>
//             {alert && (
//                 <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />
//             )}
//             {!expanded && (
//                 <div
//                     className={`
//                         absolute left-full rounded-md px-2 py-1 ml-6
//                         bg-indigo-100 text-indigo-800 text-sm
//                         invisible opacity-20 -translate-x-3 transition-all
//                         group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
//                     `}
//                 >
//                     {text}
//                 </div>
//             )}
//         </li>
//     )
// }

// // ✅ Contoh Penggunaan Sidebar + SidebarItem
// const App = () => {
//     return (
//         <Sidebar>
//             <SidebarItem icon={<Home size={20} />} text="Home" active to="/dashboard" />
//             <SidebarItem icon={<Settings size={20} />} text="Contact" to="/contacts-page" />
//             <SidebarItem icon={<Settings size={20} />} text="Manage Leads" to="/kanban" />
//             {/* <SidebarItem icon={<Settings size={20} />} text="Product" to="/produk" />
//             <SidebarItem icon={<Settings size={20} />} text="Sector" to="/sectors-page" /> {/* Corrected route name */}
//             {/* <SidebarItem icon={<Settings size={20} />} text="Report" to="/report" /> */}
//             {/* <SidebarItem icon={<Settings size={20} />} text="Segmentasi Pasar" to="/segmentasipasar" /> */}
//             {/* <SidebarItem icon={<Settings size={20} />} text="Settings" to="/profile" /> */}
//         </Sidebar>
//     )
// }

// export default App

// import { useState, useContext, createContext, ReactNode } from "react"
// import { MoreVertical, ChevronLast, ChevronFirst, Home, Settings } from "lucide-react"
// import { Link } from '@inertiajs/react'; // Import Link

// interface SidebarContextType {
//     expanded: boolean
// }

// const SidebarContext = createContext<SidebarContextType>({ expanded: true })

// interface SidebarProps {
//     children: ReactNode
// }

// const Sidebar = ({ children }: SidebarProps) => {
//     const [expanded, setExpanded] = useState<boolean>(true)

//     return (
//         <aside className="h-screen fixed top-0 left-0 z-50"> {/* Added 'z-50' to ensure it's above content */}
//             <nav className="h-full flex flex-col bg-white border-r shadow-sm">
//                 {/* Logo + Toggle */}
//                 <div className="p-4 pb-2 flex justify-between items-center">
//                     <img
//                         src="https://img.logoipsum.com/243.svg"
//                         className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
//                         alt="Logo"
//                     />
//                     <button
//                         onClick={() => setExpanded((curr) => !curr)}
//                         className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
//                     >
//                         {expanded ? <ChevronFirst /> : <ChevronLast />}
//                     </button>
//                 </div>

//                 {/* Menu Items */}
//                 <SidebarContext.Provider value={{ expanded }}>
//                     <ul className="flex-1 px-3">{children}</ul>
//                 </SidebarContext.Provider>

//                 {/* Footer / Profile */}
//                 <div className="border-t flex p-3">
//                     <img
//                         src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
//                         alt="Avatar"
//                         className="w-10 h-10 rounded-md"
//                     />
//                     <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
//                         <div className="leading-4">
//                             <h4 className="font-semibold">John Doe</h4>
//                             <span className="text-xs text-gray-600">johndoe@gmail.com</span>
//                         </div>
//                         <MoreVertical size={20} />
//                     </div>
//                 </div>
//             </nav>
//         </aside>
//     )
// }

// interface SidebarItemProps {
//     icon: ReactNode
//     text: string
//     active?: boolean
//     alert?: boolean
//     to?: string // Add a 'to' prop for the route
// }

// const SidebarItem = ({ icon, text, active = false, alert = false, to }: SidebarItemProps) => {
//     const { expanded } = useContext(SidebarContext)

//     return (
//         <li className={`
//             relative flex items-center py-2 px-3 my-1
//             font-medium rounded-md cursor-pointer
//             transition-colors group
//             ${active
//                 ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
//                 : "hover:bg-indigo-50 text-gray-600"
//             }
//         `}>
//             {/* Use Link component for navigation */}
//             <Link href={to || '#'} className="flex items-center w-full">
//                 {icon}
//                 <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
//                     {text}
//                 </span>
//             </Link>
//             {alert && (
//                 <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />
//             )}
//             {!expanded && (
//                 <div
//                     className={`
//                         absolute left-full rounded-md px-2 py-1 ml-6
//                         bg-indigo-100 text-indigo-800 text-sm
//                         invisible opacity-20 -translate-x-3 transition-all
//                         group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
//                     `}
//                 >
//                     {text}
//                 </div>
//             )}
//         </li>
//     )
// }

// const App = () => {
//     const [sidebarExpanded, setSidebarExpanded] = useState(true); // State to control sidebar width for main content offset

//     return (
//         <div className="flex"> {/* Use a flex container for the layout */}
//             {/* Sidebar */}
//             <aside className="h-screen fixed top-0 left-0 z-50">
//                 <nav className="h-full flex flex-col bg-white border-r shadow-sm">
//                     <div className="p-4 pb-2 flex justify-between items-center">
//                         <img
//                             src="[https://img.logoipsum.com/243.svg](https://img.logoipsum.com/243.svg)"
//                             className={`overflow-hidden transition-all ${sidebarExpanded ? "w-32" : "w-0"}`}
//                             alt="Logo"
//                         />
//                         <button
//                             onClick={() => setSidebarExpanded((curr) => !curr)} // Update the state here
//                             className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
//                         >
//                             {sidebarExpanded ? <ChevronFirst /> : <ChevronLast />}
//                         </button>
//                     </div>

//                     <SidebarContext.Provider value={{ expanded: sidebarExpanded }}> {/* Pass the state to context */}
//                         <ul className="flex-1 px-3">
//                             <SidebarItem icon={<Home size={20} />} text="Home" active to="/dashboard" />
//                             <SidebarItem icon={<Settings size={20} />} text="Contact" to="/contacts-page" />
//                             <SidebarItem icon={<Settings size={20} />} text="Manage Leads" to="/kanban-leads" />
//                             <SidebarItem icon={<Settings size={20} />} text="Sector" to="/sectors-page" />
//                             <SidebarItem icon={<Settings size={20} />} text="Product" to="/products-page" />
//                             <SidebarItem icon={<Settings size={20} />} text="Report" to="/reports-page" />
//                             <SidebarItem icon={<Settings size={20} />} text="Segmentasi Pasar" to="/SegmentasiPasar" />
//                         </ul>
//                     </SidebarContext.Provider>

//                     <div className="border-t flex p-3">
//                         <img
//                             src="[https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true](https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true)"
//                             alt="Avatar"
//                             className="w-10 h-10 rounded-md"
//                         />
//                         <div className={`flex justify-between items-center overflow-hidden transition-all ${sidebarExpanded ? "w-52 ml-3" : "w-0"}`}>
//                             <div className="leading-4">
//                                 <h4 className="font-semibold">John Doe</h4>
//                                 <span className="text-xs text-gray-600">johndoe@gmail.com</span>
//                             </div>
//                             <MoreVertical size={20} />
//                         </div>
//                     </div>
//                 </nav>
//             </aside>

//             {/* Main Content Area */}
//             <main
//                 className={`flex-1 p-6 transition-all duration-300 ${sidebarExpanded ? "ml-[256px]" : "ml-[20px]"
//                     }`}
//             >
//             </main>
//         </div>
//     );
// };

// export default App;


// import { useState, useContext, createContext, ReactNode } from "react";
// import { MoreVertical, ChevronLast, ChevronFirst, Home, Settings } from "lucide-react";
// import { Link, usePage } from '@inertiajs/react'; // Import Link and usePage

// interface SidebarContextType {
//     expanded: boolean;
// }

// const SidebarContext = createContext<SidebarContextType>({ expanded: true });

// interface SidebarProps {
//     children: ReactNode;
// }

// const Sidebar = ({ children }: SidebarProps) => {
//     const [expanded, setExpanded] = useState<boolean>(true);

//     return (
//         <aside className="h-screen fixed top-0 left-0 z-50">
//             <nav className="h-full flex flex-col bg-white border-r shadow-sm">
//                 <div className="p-4 pb-2 flex justify-between items-center">
//                     <img
//                         src="https://img.logoipsum.com/243.svg"
//                         className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
//                         alt="Logo"
//                     />
//                     <button
//                         onClick={() => setExpanded((curr) => !curr)}
//                         className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
//                     >
//                         {expanded ? <ChevronFirst /> : <ChevronLast />}
//                     </button>
//                 </div>

//                 <SidebarContext.Provider value={{ expanded }}>
//                     <ul className="flex-1 px-3">{children}</ul>
//                 </SidebarContext.Provider>

//                 <div className="border-t flex p-3">
//                     <img
//                         src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
//                         alt="Avatar"
//                         className="w-10 h-10 rounded-md"
//                     />
//                     <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
//                         <div className="leading-4">
//                             <h4 className="font-semibold">John Doe</h4>
//                             <span className="text-xs text-gray-600">johndoe@gmail.com</span>
//                         </div>
//                         <MoreVertical size={20} />
//                     </div>
//                 </div>
//             </nav>
//         </aside>
//     );
// };

// interface SidebarItemProps {
//     icon: ReactNode;
//     text: string;
//     active?: boolean;
//     alert?: boolean;
//     to?: string;
// }

// const SidebarItem = ({ icon, text, active = false, alert = false, to }: SidebarItemProps) => {
//     const { expanded } = useContext(SidebarContext);

//     return (
//         <li className={`
//             relative flex items-center py-2 px-3 my-1
//             font-medium rounded-md cursor-pointer
//             transition-colors group
//             ${active
//                 ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
//                 : "hover:bg-indigo-50 text-gray-600"
//             }
//         `}>
//             <Link href={to || '#'} className="flex items-center w-full">
//                 {icon}
//                 <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
//                     {text}
//                 </span>
//             </Link>
//             {alert && (
//                 <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />
//             )}
//             {!expanded && (
//                 <div
//                     className={`
//                         absolute left-full rounded-md px-2 py-1 ml-6
//                         bg-indigo-100 text-indigo-800 text-sm
//                         invisible opacity-20 -translate-x-3 transition-all
//                         group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
//                     `}
//                 >
//                     {text}
//                 </div>
//             )}
//         </li>
//     );
// };

// const App = () => {
//     const [sidebarExpanded, setSidebarExpanded] = useState(true);
//     const { url } = usePage(); // Get the current URL from Inertia.js

//     return (
//         <div className="flex">
//             <aside className="h-screen fixed top-0 left-0 z-50">
//                 <nav className="h-full flex flex-col bg-white border-r shadow-sm">
//                     <div className="p-4 pb-2 flex justify-between items-center">
//                         <img
//                             src="https://img.logoipsum.com/243.svg"
//                             className={`overflow-hidden transition-all ${sidebarExpanded ? "w-32" : "w-0"}`}
//                             alt="Logo"
//                         />
//                         <button
//                             onClick={() => setSidebarExpanded((curr) => !curr)}
//                             className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
//                         >
//                             {sidebarExpanded ? <ChevronFirst /> : <ChevronLast />}
//                         </button>
//                     </div>

//                     <SidebarContext.Provider value={{ expanded: sidebarExpanded }}>
//                         <ul className="flex-1 px-3">
//                             <SidebarItem icon={<Home size={20} />} text="Home" to="/dashboard" active={url === '/dashboard'} />
//                             <SidebarItem icon={<Settings size={20} />} text="Contact" to="/contacts-page" active={url === '/contacts-page'} />
//                             <SidebarItem icon={<Settings size={20} />} text="Manage Leads" to="/kanban-leads" active={url === '/kanban-leads'} />
//                             <SidebarItem icon={<Settings size={20} />} text="Sector" to="/sectors-page" active={url === '/sectors-page'} />
//                             <SidebarItem icon={<Settings size={20} />} text="Product" to="/products-page" active={url === '/products-page'} />
//                             <SidebarItem icon={<Settings size={20} />} text="Report" to="/reports-page" active={url === '/reports-page'} />
//                             <SidebarItem icon={<Settings size={20} />} text="Segmentasi Pasar" to="/SegmentasiPasar" active={url === '/SegmentasiPasar'} />
//                         </ul>
//                     </SidebarContext.Provider>

//                     <div className="border-t flex p-3">
//                         <img
//                             src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
//                             alt="Avatar"
//                             className="w-10 h-10 rounded-md"
//                         />
//                         <div className={`flex justify-between items-center overflow-hidden transition-all ${sidebarExpanded ? "w-52 ml-3" : "w-0"}`}>
//                             <div className="leading-4">
//                                 <h4 className="font-semibold">John Doe</h4>
//                                 <span className="text-xs text-gray-600">johndoe@gmail.com</span>
//                             </div>
//                             <MoreVertical size={20} />
//                         </div>
//                     </div>
//                 </nav>
//             </aside>

//             <main
//                 className={`flex-1 p-6 transition-all duration-300 ${sidebarExpanded ? "ml-[256px]" : "ml-[20px]"
//                     }`}
//             >
//                 {/* Your page content will be rendered here by Inertia.js */}
//             </main>
//         </div>
//     );
// };

// export default App;


// import { useState, useContext, createContext, ReactNode } from "react";
// import {
//   MoreVertical,
//   ChevronLast,
//   ChevronFirst,
//   Home,
//   Settings,
//   Users, // Example: Import a new icon for "Contact"
//   Briefcase, // Example: Import a new icon for "Manage Leads"
//   Building, // Example: Import a new icon for "Sector"
//   Package, // Example: Import a new icon for "Product"
//   BarChart2, // Example: Import a new icon for "Report"
//   Target, // Example: Import a new icon for "Segmentasi Pasar"
// } from "lucide-react";
// import { Link, usePage } from "@inertiajs/react";

// interface SidebarContextType {
//   expanded: boolean;
// }

// const SidebarContext = createContext<SidebarContextType>({ expanded: true });

// interface SidebarProps {
//   children: ReactNode;
// }

// const Sidebar = ({ children }: SidebarProps) => {
//   const [expanded, setExpanded] = useState<boolean>(true);

//   return (
//     <aside className="h-screen fixed top-0 left-0 z-50">
//       <nav className="h-full flex flex-col bg-white border-r shadow-sm">
//         <div className="p-4 pb-2 flex justify-between items-center">
//           <img
//             src="https://img.logoipsum.com/243.svg"
//             className={`overflow-hidden transition-all ${
//               expanded ? "w-32" : "w-0"
//             }`}
//             alt="Logo"
//           />
//           <button
//             onClick={() => setExpanded((curr) => !curr)}
//             className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
//           >
//             {expanded ? <ChevronFirst /> : <ChevronLast />}
//           </button>
//         </div>

//         <SidebarContext.Provider value={{ expanded }}>
//           <ul className="flex-1 px-3">{children}</ul>
//         </SidebarContext.Provider>

//         <div className="border-t flex p-3">
//           <img
//             src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
//             alt="Avatar"
//             className="w-10 h-10 rounded-md"
//           />
//           <div
//             className={`flex justify-between items-center overflow-hidden transition-all ${
//               expanded ? "w-52 ml-3" : "w-0"
//             }`}
//           >
//             <div className="leading-4">
//               <h4 className="font-semibold">John Doe</h4>
//               <span className="text-xs text-gray-600">johndoe@gmail.com</span>
//             </div>
//             <MoreVertical size={20} />
//           </div>
//         </div>
//       </nav>
//     </aside>
//   );
// };

// interface SidebarItemProps {
//   icon: ReactNode;
//   text: string;
//   active?: boolean;
//   alert?: boolean;
//   to?: string;
// }

// const SidebarItem = ({
//   icon,
//   text,
//   active = false,
//   alert = false,
//   to,
// }: SidebarItemProps) => {
//   const { expanded } = useContext(SidebarContext);

//   return (
//     <li
//       className={`
//             relative flex items-center py-2 px-3 my-1
//             font-medium rounded-md cursor-pointer
//             transition-colors group
//             ${
//               active
//                 ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
//                 : "hover:bg-indigo-50 text-gray-600"
//             }
//         `}
//     >
//       <Link href={to || "#"} className="flex items-center w-full">
//         {icon}
//         <span
//           className={`overflow-hidden transition-all ${
//             expanded ? "w-52 ml-3" : "w-0"
//           }`}
//         >
//           {text}
//         </span>
//       </Link>
//       {alert && (
//         <div
//           className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
//             expanded ? "" : "top-2"
//           }`}
//         />
//       )}
//       {!expanded && (
//         <div
//           className={`
//                         absolute left-full rounded-md px-2 py-1 ml-6
//                         bg-indigo-100 text-indigo-800 text-sm
//                         invisible opacity-20 -translate-x-3 transition-all
//                         group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
//                     `}
//         >
//           {text}
//         </div>
//       )}
//     </li>
//   );
// };

// const App = () => {
//   const [sidebarExpanded, setSidebarExpanded] = useState(true);
//   const { url } = usePage();

//   return (
//     <div className="flex">
//       <aside className="h-screen fixed top-0 left-0 z-50">
//         <nav className="h-full flex flex-col bg-white border-r shadow-sm">
//           <div className="p-4 pb-2 flex justify-between items-center">
//             <img
//               src="https://img.logoipsum.com/243.svg"
//               className={`overflow-hidden transition-all ${
//                 sidebarExpanded ? "w-32" : "w-0"
//               }`}
//               alt="Logo"
//             />
//             <button
//               onClick={() => setSidebarExpanded((curr) => !curr)}
//               className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
//             >
//               {sidebarExpanded ? <ChevronFirst /> : <ChevronLast />}
//             </button>
//           </div>

//           <SidebarContext.Provider value={{ expanded: sidebarExpanded }}>
//             <ul className="flex-1 px-3">
//               <SidebarItem
//                 icon={<Home size={20} />}
//                 text="Home"
//                 to="/dashboard"
//                 active={url === "/dashboard"}
//               />
//               <SidebarItem
//                 icon={<Users size={20} />} // Changed icon
//                 text="Contact"
//                 to="/contacts-page"
//                 active={url === "/contacts-page"}
//               />
//               <SidebarItem
//                 icon={<Briefcase size={20} />} // Changed icon
//                 text="Manage Leads"
//                 to="/kanban-leads"
//                 active={url === "/kanban-leads"}
//               />
//               <SidebarItem
//                 icon={<Building size={20} />} // Changed icon
//                 text="Sector"
//                 to="/sectors-page"
//                 active={url === "/sectors-page"}
//               />
//               <SidebarItem
//                 icon={<Package size={20} />} // Changed icon
//                 text="Product"
//                 to="/products-page"
//                 active={url === "/products-page"}
//               />
//               <SidebarItem
//                 icon={<BarChart2 size={20} />} // Changed icon
//                 text="Report"
//                 to="/reports-page"
//                 active={url === "/reports-page"}
//               />
//               <SidebarItem
//                 icon={<Target size={20} />} // Changed icon
//                 text="Segmentasi Pasar"
//                 to="/SegmentasiPasar"
//                 active={url === "/SegmentasiPasar"}
//               />
//             </ul>
//           </SidebarContext.Provider>

//           <div className="border-t flex p-3">
//             <img
//               src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
//               alt="Avatar"
//               className="w-10 h-10 rounded-md"
//             />
//             <div
//               className={`flex justify-between items-center overflow-hidden transition-all ${
//                 sidebarExpanded ? "w-52 ml-3" : "w-0"
//               }`}
//             >
//               <div className="leading-4">
//                 <h4 className="font-semibold">John Doe</h4>
//                 <span className="text-xs text-gray-600">johndoe@gmail.com</span>
//               </div>
//               <MoreVertical size={20} />
//             </div>
//           </div>
//         </nav>
//       </aside>

//       <main
//         className={`flex-1 p-6 transition-all duration-300 ${
//           sidebarExpanded ? "ml-[256px]" : "ml-[20px]"
//         }`}
//       >
//         {/* Your page content will be rendered here by Inertia.js */}
//       </main>
//     </div>
//   );
// };

// export default App;



// import { useState, useContext, createContext, ReactNode } from "react";
// import {
//   MoreVertical,
//   ChevronLast,
//   ChevronFirst,
//   Home,
//   Users,
//   Briefcase,
//   Building,
//   Package,
//   BarChart2,
//   Target,
// } from "lucide-react";
// import { Link, usePage } from "@inertiajs/react";

// interface SidebarContextType {
//   expanded: boolean;
// }

// const SidebarContext = createContext<SidebarContextType>({ expanded: true });

// interface SidebarProps {
//   children: ReactNode;
// }

// const Sidebar = ({ children }: SidebarProps) => {
//   const [expanded, setExpanded] = useState<boolean>(true);

//   return (
//     <aside className="h-screen fixed top-0 left-0 z-50">
//       <nav className="h-full flex flex-col bg-white border-r shadow-sm">
//         <div className="p-4 pb-2 flex justify-between items-center">
//           <img
//             src="https://img.logoipsum.com/243.svg"
//             className={`overflow-hidden transition-all ${
//               expanded ? "w-32" : "w-0"
//             }`}
//             alt="Logo"
//           />
//           <button
//             onClick={() => setExpanded((curr) => !curr)}
//             className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
//           >
//             {expanded ? <ChevronFirst /> : <ChevronLast />}
//           </button>
//         </div>

//         <SidebarContext.Provider value={{ expanded }}>
//           <ul className="flex-1 px-3">{children}</ul>
//         </SidebarContext.Provider>

//         {/* This is where the user profile section is in the original Sidebar component */}
//         {/* We will move this into the App component to access user data directly from usePage() */}
//       </nav>
//     </aside>
//   );
// };

// interface SidebarItemProps {
//   icon: ReactNode;
//   text: string;
//   active?: boolean;
//   alert?: boolean;
//   to?: string;
// }

// const SidebarItem = ({
//   icon,
//   text,
//   active = false,
//   alert = false,
//   to,
// }: SidebarItemProps) => {
//   const { expanded } = useContext(SidebarContext);

//   return (
//     <li
//       className={`
//             relative flex items-center py-2 px-3 my-1
//             font-medium rounded-md cursor-pointer
//             transition-colors group
//             ${
//               active
//                 ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
//                 : "hover:bg-indigo-50 text-gray-600"
//             }
//         `}
//     >
//       <Link href={to || "#"} className="flex items-center w-full">
//         {icon}
//         <span
//           className={`overflow-hidden transition-all ${
//             expanded ? "w-52 ml-3" : "w-0"
//           }`}
//         >
//           {text}
//         </span>
//       </Link>
//       {alert && (
//         <div
//           className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
//             expanded ? "" : "top-2"
//           }`}
//         />
//       )}
//       {!expanded && (
//         <div
//           className={`
//                         absolute left-full rounded-md px-2 py-1 ml-6
//                         bg-indigo-100 text-indigo-800 text-sm
//                         invisible opacity-20 -translate-x-3 transition-all
//                         group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
//                     `}
//         >
//           {text}
//         </div>
//       )}
//     </li>
//   );
// };

// const App = () => {
//   const [sidebarExpanded, setSidebarExpanded] = useState(true);
//   const { url, props } = usePage(); // Get the current URL and props from Inertia.js

//   // Access authenticated user data from props
//   const user = props.auth?.user; // Assuming your user data is under `props.auth.user`

//   // You can also generate the avatar URL dynamically
//   const avatarUrl = user?.name
//     ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=c7d2fe&color=3730a3&bold=true`
//     : `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true`; // Fallback

//   return (
//     <div className="flex">
//       <aside className="h-screen fixed top-0 left-0 z-50">
//         <nav className="h-full flex flex-col bg-white border-r shadow-sm">
//           <div className="p-4 pb-2 flex justify-between items-center">
//             <img
//               src="https://img.logoipsum.com/243.svg"
//               className={`overflow-hidden transition-all ${
//                 sidebarExpanded ? "w-32" : "w-0"
//               }`}
//               alt="Logo"
//             />
//             <button
//               onClick={() => setSidebarExpanded((curr) => !curr)}
//               className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
//             >
//               {sidebarExpanded ? <ChevronFirst /> : <ChevronLast />}
//             </button>
//           </div>

//           <SidebarContext.Provider value={{ expanded: sidebarExpanded }}>
//             <ul className="flex-1 px-3">
//               <SidebarItem
//                 icon={<Home size={20} />}
//                 text="Home"
//                 to="/dashboard"
//                 active={url === "/dashboard"}
//               />
//               <SidebarItem
//                 icon={<Users size={20} />}
//                 text="Contact"
//                 to="/contacts-page"
//                 active={url === "/contacts-page"}
//               />
//               <SidebarItem
//                 icon={<Briefcase size={20} />}
//                 text="Manage Leads"
//                 to="/kanban-leads"
//                 active={url === "/kanban-leads"}
//               />
//               <SidebarItem
//                 icon={<Building size={20} />}
//                 text="Sector"
//                 to="/sectors-page"
//                 active={url === "/sectors-page"}
//               />
//               <SidebarItem
//                 icon={<Package size={20} />}
//                 text="Product"
//                 to="/products-page"
//                 active={url === "/products-page"}
//               />
//               <SidebarItem
//                 icon={<BarChart2 size={20} />}
//                 text="Report"
//                 to="/reports-page"
//                 active={url === "/reports-page"}
//               />
//               <SidebarItem
//                 icon={<Target size={20} />}
//                 text="Segmentasi Pasar"
//                 to="/SegmentasiPasar"
//                 active={url === "/SegmentasiPasar"}
//               />
//             </ul>
//           </SidebarContext.Provider>

//           {/* User profile section, now dynamically populated */}
//           <div className="border-t flex p-3">
//             <img
//               src={avatarUrl} // Use dynamic avatar URL
//               alt="Avatar"
//               className="w-10 h-10 rounded-md"
//             />
//             <div
//               className={`flex justify-between items-center overflow-hidden transition-all ${
//                 sidebarExpanded ? "w-52 ml-3" : "w-0"
//               }`}
//             >
//               <div className="leading-4">
//                 <h4 className="font-semibold">{user?.name || "Guest"}</h4>{" "}
//                 {/* Display user's name */}
//                 <span className="text-xs text-gray-600">
//                   {user?.email || "guest@example.com"}
//                 </span>{" "}
//                 {/* Display user's email */}
//               </div>
//               <MoreVertical size={20} />
//             </div>
//           </div>
//         </nav>
//       </aside>

//       <main
//         className={`flex-1 p-6 transition-all duration-300 ${
//           sidebarExpanded ? "ml-[256px]" : "ml-[20px]"
//         }`}
//       >
//         {/* Your page content will be rendered here by Inertia.js */}
//       </main>
//     </div>
//   );
// };

// export default App;

// import { useState, useContext, createContext, ReactNode } from "react";
// import {
//     MoreVertical,
//     ChevronLast,
//     ChevronFirst,
//     Home,
//     Users,
//     Briefcase,
//     Building,
//     Package,
//     BarChart2,
//     Target,
//     LogOut, // Import the LogOut icon for the logout button
// } from "lucide-react";
// import { router, Link, usePage } from "@inertiajs/react";
// // import { usePage } from '@inertiajs/react' // Import router for Inertia.js actions


// interface SidebarContextType {
//     expanded: boolean;
// }

// const SidebarContext = createContext<SidebarContextType>({ expanded: true });

// interface SidebarProps {
//     children: ReactNode;
// }

// const Sidebar = ({ children }: SidebarProps) => {
//     const [expanded, setExpanded] = useState<boolean>(true);

//     return (
//         <aside className="h-screen fixed top-0 left-0 z-50">
//             <nav className="h-full flex flex-col bg-white border-r shadow-sm">
//                 <div className="p-4 pb-2 flex justify-between items-center">
//                     <img
//                         src="https://img.logoipsum.com/243.svg"
//                         className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"
//                             }`}
//                         alt="Logo"
//                     />
//                     <button
//                         onClick={() => setExpanded((curr) => !curr)}
//                         className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
//                     >
//                         {expanded ? <ChevronFirst /> : <ChevronLast />}
//                     </button>
//                 </div>

//                 <SidebarContext.Provider value={{ expanded }}>
//                     <ul className="flex-1 px-3">{children}</ul>
//                 </SidebarContext.Provider>

//                 {/* The user profile section is handled in App.tsx */}
//             </nav>
//         </aside>
//     );
// };

// interface SidebarItemProps {
//     icon: ReactNode;
//     text: string;
//     active?: boolean;
//     alert?: boolean;
//     to?: string;
// }

// const SidebarItem = ({
//     icon,
//     text,
//     active = false,
//     alert = false,
//     to,
// }: SidebarItemProps) => {
//     const { expanded } = useContext(SidebarContext);

//     return (
//         <li
//             className={`
//             relative flex items-center py-2 px-3 my-1
//             font-medium rounded-md cursor-pointer
//             transition-colors group
//             ${active
//                     ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
//                     : "hover:bg-indigo-50 text-gray-600"
//                 }
//         `}
//         >
//             <Link href={to || "#"} className="flex items-center w-full">
//                 {icon}
//                 <span
//                     className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"
//                         }`}
//                 >
//                     {text}
//                 </span>
//             </Link>
//             {alert && (
//                 <div
//                     className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"
//                         }`}
//                 />
//             )}
//             {!expanded && (
//                 <div
//                     className={`
//                         absolute left-full rounded-md px-2 py-1 ml-6
//                         bg-indigo-100 text-indigo-800 text-sm
//                         invisible opacity-20 -translate-x-3 transition-all
//                         group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
//                     `}
//                 >
//                     {text}
//                 </div>
//             )}
//         </li>
//     );
// };

// const App = () => {
//     const [sidebarExpanded, setSidebarExpanded] = useState(true);
//     const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
//     const { url, props } = usePage();

//     const user = props.auth?.user;

//     const avatarUrl = user?.name
//         ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=c7d2fe&color=3730a3&bold=true`
//         : `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true`;

//     const handleLogout = () => {
//         router.post('/logout'); // Use Inertia.js router to post to the logout route
//     };

//     return (
//         <div className="flex">
//             <aside className="h-screen fixed top-0 left-0 z-50">
//                 <nav className="h-full flex flex-col bg-white border-r shadow-sm">
//                     <div className="p-4 pb-2 flex justify-between items-center">
//                         <img
//                             src="/assets/image/logo.png"
//                             className={`overflow-hidden transition-all ${sidebarExpanded ? "w-32" : "w-0"
//                                 }`}
//                             alt="Logo"
//                         />
//                         <button
//                             onClick={() => setSidebarExpanded((curr) => !curr)}
//                             className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
//                         >
//                             {sidebarExpanded ? <ChevronFirst /> : <ChevronLast />}
//                         </button>
//                     </div>

//                     <SidebarContext.Provider value={{ expanded: sidebarExpanded }}>
//                         <ul className="flex-1 px-3">
//                             <SidebarItem
//                                 icon={<Home size={20} />}
//                                 text="Dashboard"
//                                 to="/dashboard"
//                                 active={url === "/dashboard"}
//                             />
//                             <SidebarItem
//                                 icon={<Users size={20} />}
//                                 text="Contact"
//                                 to="/contacts-page"
//                                 active={url === "/contacts-page"}
//                             />
//                             <SidebarItem
//                                 icon={<Briefcase size={20} />}
//                                 text="Manage Leads"
//                                 to="/kanban-leads"
//                                 active={url === "/kanban-leads"}
//                             />
//                             <SidebarItem
//                                 icon={<Building size={20} />}
//                                 text="Sector"
//                                 to="/sectors-page"
//                                 active={url === "/sectors-page"}
//                             />
//                             <SidebarItem
//                                 icon={<Package size={20} />}
//                                 text="Product"
//                                 to="/products-page"
//                                 active={url === "/products-page"}
//                             />
//                             <SidebarItem
//                                 icon={<BarChart2 size={20} />}
//                                 text="Report"
//                                 to="/reports-page"
//                                 active={url === "/reports-page"}
//                             />
//                             <SidebarItem
//                                 icon={<Target size={20} />}
//                                 text="Segmentasi Pasar"
//                                 to="/SegmentasiPasar"
//                                 active={url === "/SegmentasiPasar"}
//                             />
//                         </ul>
//                     </SidebarContext.Provider>

//                     {/* User profile section with dropdown */}
//                     <div className="border-t flex p-3 relative"> {/* Added relative positioning */}
//                         <img
//                             src={avatarUrl}
//                             alt="Avatar"
//                             className="w-10 h-10 rounded-md"
//                         />
//                         <div
//                             className={`flex justify-between items-center overflow-hidden transition-all ${sidebarExpanded ? "w-52 ml-3" : "w-0"
//                                 }`}
//                         >
//                             <div className="leading-4">
//                                 <h4 className="font-semibold">{user?.name || "Guest"}</h4>
//                                 <span className="text-xs text-gray-600">
//                                     {user?.email || "guest@example.com"}
//                                 </span>
//                             </div>
//                             <button
//                                 onClick={() => setShowDropdown(!showDropdown)} // Toggle dropdown visibility
//                                 className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
//                                 aria-haspopup="true" // ARIA attribute for accessibility
//                                 aria-expanded={showDropdown} // ARIA attribute for accessibility
//                             >
//                                 <MoreVertical size={20} />
//                             </button>

//                             {/* Dropdown Menu */}
//                             {showDropdown && (
//                                 <div
//                                     className={`
//                     absolute bottom-full mb-2 right-0
//                     bg-white border border-gray-200 rounded-md shadow-lg
//                     py-1 w-40 z-10
//                     ${!sidebarExpanded ? "transform translate-x-12" : ""}
//                   `}
//                                 >
//                                     <button
//                                         onClick={handleLogout}
//                                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                     >
//                                         <LogOut size={16} className="mr-2" />
//                                         Logout
//                                     </button>
//                                     {/* Add more dropdown items here if needed */}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </nav>
//             </aside>

//             <main
//                 className={`flex-1 p-6 transition-all duration-300 ${sidebarExpanded ? "ml-[256px]" : "ml-[20px]"
//                     }`}
//             >
//                 {/* Your page content will be rendered here by Inertia.js */}
//             </main>
//         </div>
//     );
// };

// export default App;


import { useState, useContext, createContext, ReactNode } from "react";
import {
    MoreVertical,
    ChevronLast,
    ChevronFirst,
    Home,
    Users,
    Briefcase,
    Building,
    Package,
    BarChart2,
    Target,
    LogOut,
} from "lucide-react";
import { router, Link, usePage } from "@inertiajs/react";

interface SidebarContextType {
    expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType>({ expanded: true });

interface SidebarItemProps {
    icon: ReactNode;
    text: string;
    active?: boolean;
    alert?: boolean;
    to?: string;
}

const SidebarItem = ({
    icon,
    text,
    active = false,
    alert = false,
    to,
}: SidebarItemProps) => {
    const { expanded } = useContext(SidebarContext);

    return (
        <li
            className={`
                relative flex items-center py-2 px-3 my-1
                font-medium rounded-md cursor-pointer
                transition-colors group
                ${active
                    ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                    : "hover:bg-indigo-50 text-gray-600"
                }
            `}
        >
            <Link href={to || "#"} className="flex items-center w-full">
                {icon}
                <span
                    className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"
                        }`}
                >
                    {text}
                </span>
            </Link>
            {alert && (
                <div
                    className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}
                />
            )}
            {!expanded && (
                <div
                    className={`
                        absolute left-full rounded-md px-2 py-1 ml-6
                        bg-indigo-100 text-indigo-800 text-sm
                        invisible opacity-20 -translate-x-3 transition-all
                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                    `}
                >
                    {text}
                </div>
            )}
        </li>
    );
};

const App = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const { url, props } = usePage();
    const user = props.auth?.user;

    const avatarUrl = user?.name
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=c7d2fe&color=3730a3&bold=true`
        : `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true`;

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="flex min-h-screen">
            {/* Background global di seluruh sistem */}
            {/* Sidebar */}
            <aside className="h-screen fixed top-0 left-0 z-50">
                <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <img
                            src="/assets/image/logo.png"
                            className={`overflow-hidden transition-all ${sidebarExpanded ? "w-32" : "w-0"}`}
                            alt="Logo"
                        />
                        <button
                            onClick={() => setSidebarExpanded((curr) => !curr)}
                            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                        >
                            {sidebarExpanded ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    </div>

                    <SidebarContext.Provider value={{ expanded: sidebarExpanded }}>
                        <ul className="flex-1 px-3">
                            <SidebarItem icon={<Home size={20} />} text="Dashboard" to="/dashboard" active={url === "/dashboard"} />
                            <SidebarItem icon={<Users size={20} />} text="Contact" to="/contacts" active={url === "/contacts"} />
                            <SidebarItem icon={<Briefcase size={20} />} text="Manage Leads" to="/kanban/leads" active={url === "/kanban/leads"} />
                            <SidebarItem icon={<Building size={20} />} text="Sector" to="/sectors" active={url === "/sectors"} />
                            <SidebarItem icon={<Package size={20} />} text="Product" to="/products" active={url === "/products"} />
                            <SidebarItem icon={<BarChart2 size={20} />} text="Report" to="/reports-page" active={url === "/reports-page"} />
                            <SidebarItem icon={<Target size={20} />} text="Segmentasi Pasar" to="/segmentasi" active={url === "/segmentasi"} />
                        </ul>
                    </SidebarContext.Provider>

                    {/* User Info + Dropdown */}
                    <div className="border-t flex p-3 relative">
                        <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-md" />
                        <div
                            className={`flex justify-between items-center overflow-hidden transition-all ${sidebarExpanded ? "w-52 ml-3" : "w-0"}`}
                        >
                            <div className="leading-4">
                                <h4 className="font-semibold">{user?.name || "Guest"}</h4>
                                <span className="text-xs text-gray-600">{user?.email || "guest@example.com"}</span>
                            </div>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-haspopup="true"
                                aria-expanded={showDropdown}
                            >
                                <MoreVertical size={20} />
                            </button>

                            {showDropdown && (
                                <div
                                    className={`absolute bottom-full mb-2 right-0 bg-white border border-gray-200 rounded-md shadow-lg py-1 w-40 z-10 ${!sidebarExpanded ? "transform translate-x-12" : ""}`}
                                >
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main content */}
            <main
                className={`
                flex-1 p-6 transition-all duration-300
                ${sidebarExpanded ? "ml-[256px]" : "ml-[20px]"}
                min-h-screen
            `}
            >

                {/* Inertia akan render halaman di sini */}
            </main>
        </div>
    );
};

export default App;
