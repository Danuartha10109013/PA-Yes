import React from 'react';

interface Props {
  colorClass: string;
  onClick?: () => void;
}

const AddLeadButton: React.FC<Props> = ({ colorClass, onClick }) => (
  <button
    className={`${colorClass} text-sm font-semibold mt-2 text-left select-none`}
    onClick={onClick}
  >
    + Add Lead
  </button>
);

export default AddLeadButton;
