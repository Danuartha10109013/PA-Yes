import React from 'react';
import {
    ChevronDown,
    NotificationsOutline,
    PersonCircle,
    SearchOutline,
    SettingsOutline,
    ShareSocialOutline,
} from 'react-ionicons';

const Navbar = () => {
    return (
        <div className="md:w-[calc(100%-230px)] w-[calc(100%-60px)] fixed flex items-center justify-between pl-2 pr-6 h-[70px] top-0 md:left-[230px] left-[60px] border-b border-slate-300 bg-white z-40">
            {/* Left: Profile Info */}
            <div className="flex items-center gap-3 cursor-pointer" title="User Profile">
                <PersonCircle color="blue" width="28px" height="28px" />
                <span className="text-blue-400 font-semibold md:text-lg text-sm whitespace-nowrap">
                    Tappp
                </span>
                <ChevronDown color="blue" width="16px" height="16px" />
            </div>

            {/* Middle: Search Box */}
            <div className="md:w-[800px] w-[130px] bg-gray-100 rounded-lg px-3 py-2 flex items-center gap-2">
                <SearchOutline color="#999" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-gray-100 outline-none text-[15px]"
                    readOnly
                    aria-label="Search input (readonly)"
                />
            </div>

            {/* Right: Action Icons */}
            <div className="md:flex hidden items-center gap-4">
                <button
                    className="grid place-items-center bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition"
                    title="Share"
                    aria-label="Share"
                >
                    <ShareSocialOutline color="#444" />
                </button>
                <button
                    className="grid place-items-center bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition"
                    title="Settings"
                    aria-label="Settings"
                >
                    <SettingsOutline color="#444" />
                </button>
                <button
                    className="grid place-items-center bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition"
                    title="Notifications"
                    aria-label="Notifications"
                >
                    <NotificationsOutline color="#444" />
                </button>
            </div>
        </div>
    );
};

export default Navbar;
