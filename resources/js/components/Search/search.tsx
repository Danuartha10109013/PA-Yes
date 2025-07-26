import React from 'react';
import 'tailwindcss/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface SearchProps {
    searchQuery: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    // You can add more props for sorting or other controls if needed
}

const Search: React.FC<SearchProps> = ({
    searchQuery,
    onSearchChange,
}) => {
    return (
        <div className="flex items-center space-x-4">
            {/* Search input field */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Cari ..."
                    value={searchQuery}
                    onChange={onSearchChange}
                    className="w-64 h-10 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                </div>
            </div>
        </div>
    );
};

export default Search;
