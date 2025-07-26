// components/Dropdown.tsx
import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface DropdownProps {
  buttonContent: ReactNode;
  children: ReactNode; // The content of the dropdown menu
  alignment?: 'left' | 'right'; // Optional prop for dropdown alignment
}

const Dropdown: React.FC<DropdownProps> = ({ buttonContent, children, alignment = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        // className="w-12 h-12 flex items-center justify-center shadow-lg"
        onClick={toggleDropdown}
      >
        {buttonContent}
      </button>
      <div
        className={`${isOpen ? 'block' : 'hidden'}
                   absolute ${alignment === 'right' ? 'right-0' : 'left-0'}
                   mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20`}
      >
        <ul className="py-1 text-gray-700">
          {children} {/* Render the passed children as dropdown items */}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
